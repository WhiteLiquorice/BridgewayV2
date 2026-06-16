"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StanleyAutomationAgent = void 0;
const playwright_1 = require("playwright");
const generative_ai_1 = require("@google/generative-ai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/**
 * Stanley Visual Browser Automation Agent
 *
 * Runs a headful browser context allowing individual prosumers to monitor actions.
 * Listens to console logs and executes JS code within the page invisibly (simulating
 * the browser's inspect/devtools console). Feeds screenshots and console state to
 * Gemini to complete explained natural language workflows.
 */
class StanleyAutomationAgent {
    browser = null;
    context = null;
    page = null;
    consoleLogs = [];
    geminiClient = null;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.geminiClient = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
        else {
            console.warn("[Stanley Agent] GEMINI_API_KEY environment variable is not defined.");
        }
    }
    /**
     * Initializes the Playwright browser.
     */
    async initialize(startUrl) {
        console.log("[Stanley Agent] Launching headful Chromium browser...");
        this.browser = await playwright_1.chromium.launch({
            headless: false,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        });
        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 800 }
        });
        this.page = await this.context.newPage();
        // Mask webdriver
        await this.page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });
        // Intercept console logs invisibly
        this.page.on('console', (msg) => {
            const entry = {
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString()
            };
            this.consoleLogs.push(entry);
        });
        // Intercept unhandled page exceptions
        this.page.on('pageerror', (err) => {
            this.consoleLogs.push({
                type: 'error',
                text: `Page Uncaught Error: ${err.message}`,
                timestamp: new Date().toISOString()
            });
        });
        if (startUrl) {
            await this.page.goto(startUrl, { waitUntil: 'domcontentloaded' });
        }
        return this.page;
    }
    /**
     * Navigates the active page to a target URL.
     */
    async navigate(url) {
        if (!this.page) {
            throw new Error("Browser session is not initialized.");
        }
        console.log(`[Stanley Agent] Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
    /**
     * Executes JS code in the context of the page, mirroring typing in the inspect console.
     * Runs completely invisibly on the user's screen.
     */
    async executeInvisibleConsoleCommand(jsCode) {
        if (!this.page) {
            throw new Error("Browser session is not initialized.");
        }
        console.log(`[Stanley Agent] Executing console command: ${jsCode}`);
        try {
            // Run the JS code in the page context
            const result = await this.page.evaluate((code) => {
                // Wrap execution in an eval-like expression to return value
                try {
                    // eslint-disable-next-line no-eval
                    const val = window.eval(code);
                    return { success: true, val: val !== undefined ? JSON.stringify(val) : "undefined" };
                }
                catch (e) {
                    const err = e;
                    return { success: false, error: err.message };
                }
            }, jsCode);
            if (result.success) {
                return { success: true, result: result.val };
            }
            else {
                return { success: false, result: null, error: result.error };
            }
        }
        catch (err) {
            const error = err;
            return { success: false, result: null, error: error.message };
        }
    }
    /**
     * Captures the visible viewport as a base64 encoded screenshot.
     */
    async captureViewportBase64() {
        if (!this.page) {
            throw new Error("Browser session is not initialized.");
        }
        const buffer = await this.page.screenshot({ type: 'png' });
        return buffer.toString('base64');
    }
    /**
     * Returns current buffered console logs.
     */
    getConsoleLogs() {
        return this.consoleLogs;
    }
    /**
     * Clears buffered console logs.
     */
    clearConsoleLogs() {
        this.consoleLogs = [];
    }
    /**
     * Closes browser resources.
     */
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        this.browser = null;
        this.context = null;
        this.page = null;
    }
    /**
     * Solves a workflow step by querying Gemini Vision with the user's goal, the page's current
     * screenshot, and the invisible DevTools console logs.
     */
    async determineNextAction(goal) {
        if (!this.geminiClient) {
            throw new Error("Gemini AI client is not configured. Please supply GEMINI_API_KEY.");
        }
        if (!this.page) {
            throw new Error("No active page context exists.");
        }
        const screenshot = await this.captureViewportBase64();
        const logsText = this.consoleLogs
            .slice(-25) // Keep last 25 logs to avoid bloating token count
            .map(l => `[${l.type.toUpperCase()}] ${l.text}`)
            .join('\n');
        const currentUrl = this.page.url();
        const prompt = `You are Stanley, an elite web automation agent. The user wants you to achieve this goal: "${goal}".
Current Page URL: ${currentUrl}

Here is the current state of the page's console logs (which are running invisibly behind the scenes):
${logsText || "(No logs captured yet)"}

Based on the user's goal and the attached screenshot, output your next action as a valid JSON object matching the format:
{
  "thought": "Brief explanation of your visual analysis and reasoning",
  "actionType": "execute_js" | "navigate" | "wait" | "finish",
  "payload": "The specific value: JS code to execute in the console, the navigation URL, wait duration in ms, or empty for finish"
}

Guidelines:
1. To interact with elements (clicking buttons, typing into inputs), write JS code to run in the console (e.g. document.querySelector('#submit').click() or document.querySelector('input[type="text"]').value = 'hello').
2. Ensure the JS code is robust and self-contained. You can query document structures, click nodes, or submit forms.
3. If you get stuck or need to load a new page, use "navigate" with the target URL.
4. When the goal is completed successfully, return actionType "finish".

Output ONLY the raw JSON block. No markdown wrapper.`;
        const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
        try {
            const response = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: screenshot,
                        mimeType: 'image/png'
                    }
                }
            ]);
            const responseText = response.response.text().trim();
            // Clean up markdown block if returned
            const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
            const parsedAction = JSON.parse(cleanJson);
            return parsedAction;
        }
        catch (err) {
            const error = err;
            console.error("[Stanley Agent] Gemini Vision parsing failed:", error);
            return {
                thought: `Failed to request Gemini Vision: ${error.message}`,
                actionType: 'finish',
                payload: ''
            };
        }
    }
}
exports.StanleyAutomationAgent = StanleyAutomationAgent;
