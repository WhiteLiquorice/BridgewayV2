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
exports.StanleyFoundation = void 0;
const playwright_1 = require("playwright");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Project Stanley Generic Framework Core (StanleyFoundation)
 *
 * Manages non-headless browser lifecycles, persists session states,
 * and implements a client-side 'Record-and-Generalize' listener to capture
 * user click, change, and submit paths into serialized macro timelines.
 */
class StanleyFoundation {
    config;
    browser = null;
    context = null;
    page = null;
    interactionTimeline = [];
    constructor(config = {}) {
        this.config = {
            headless: false, // Strict user directive: Must run headful so users can solve CAPTCHAs/MFA
            userAgent: config.userAgent ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport: config.viewport ?? { width: 1280, height: 800 },
            statePath: config.statePath ?? path.join(process.cwd(), 'stanley_session_state.json'),
            ...config
        };
    }
    /**
     * Initializes the Playwright browser session.
     * Restores session storageState if it exists, exposes the event logger callback,
     * and registers the DOM event listener script.
     */
    async initialize() {
        console.log("[StanleyFoundation] Launching headful Chromium browser...");
        this.browser = await playwright_1.chromium.launch({
            headless: this.config.headless, // Use configured headless mode
            args: [
                '--disable-blink-features=AutomationControlled', // Evade simple webdriver flags
                '--no-sandbox'
            ]
        });
        const contextOptions = {
            userAgent: this.config.userAgent,
            viewport: this.config.viewport,
        };
        if (this.config.statePath && fs.existsSync(this.config.statePath)) {
            console.log(`[StanleyFoundation] Restoring state session from: ${this.config.statePath}`);
            try {
                const stateText = fs.readFileSync(this.config.statePath, 'utf-8');
                contextOptions.storageState = JSON.parse(stateText);
            }
            catch (err) {
                console.error("[StanleyFoundation] Failed to load session state JSON:", err);
            }
        }
        this.context = await this.browser.newContext(contextOptions);
        this.page = await this.context.newPage();
        // Mask the window.navigator.webdriver automation attribute
        await this.page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });
        // Expose the node event logging function to the browser window context
        await this.page.exposeFunction('logStanleyEvent', (event) => {
            console.log(`[StanleyFoundation Event Logged] ${event.eventType.toUpperCase()} on "${event.selector}"`);
            this.interactionTimeline.push(event);
        });
        // Inject global DOM event listener script
        await this.page.addInitScript(() => {
            // Helper function to dynamically construct a unique CSS selector path for any element
            function computeCssSelector(el) {
                if (!el)
                    return '';
                if (el.id)
                    return `#${el.id}`;
                const pathParts = [];
                let current = el;
                while (current && current.nodeType === Node.ELEMENT_NODE) {
                    let selector = current.nodeName.toLowerCase();
                    if (current.className) {
                        // Filter classes, escaping spaces or odd tokens
                        const classNames = current.className
                            .split(/\s+/)
                            .map(c => c.trim())
                            .filter(c => c.length > 0 && !c.includes(':') && !c.includes('[')); // omit Tailwind dynamic parts
                        if (classNames.length > 0) {
                            selector += `.${classNames.join('.')}`;
                        }
                    }
                    const parent = current.parentNode;
                    if (parent) {
                        const siblings = Array.from(parent.children);
                        if (siblings.length > 1) {
                            const index = siblings.indexOf(current) + 1;
                            selector += `:nth-child(${index})`;
                        }
                    }
                    pathParts.unshift(selector);
                    current = parent;
                }
                return pathParts.join(' > ');
            }
            // Event Listener for clicks (excluding clicks on textboxes/inputs to prevent double logging)
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (!target)
                    return;
                const tagName = target.tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea' || tagName === 'select')
                    return;
                window.logStanleyEvent({
                    eventType: 'click',
                    selector: computeCssSelector(target),
                    value: null,
                    textContent: target.textContent?.trim().slice(0, 150) || '',
                    currentUrl: window.location.href,
                    timestamp: Date.now()
                });
            }, true);
            // Event Listener for inputs and textchanges
            document.addEventListener('change', (e) => {
                const target = e.target;
                if (!target)
                    return;
                window.logStanleyEvent({
                    eventType: 'change',
                    selector: computeCssSelector(target),
                    value: target.type === 'password' ? '********' : target.value,
                    textContent: '',
                    currentUrl: window.location.href,
                    timestamp: Date.now()
                });
            }, true);
            // Event Listener for form submits
            document.addEventListener('submit', (e) => {
                const target = e.target;
                if (!target)
                    return;
                window.logStanleyEvent({
                    eventType: 'submit',
                    selector: computeCssSelector(target),
                    value: null,
                    textContent: 'Form Submit',
                    currentUrl: window.location.href,
                    timestamp: Date.now()
                });
            }, true);
        });
        return this.page;
    }
    /**
     * Navigates the current browser page to a target URL.
     */
    async navigate(url) {
        if (!this.page)
            throw new Error("Agent browser session is not initialized.");
        console.log(`[StanleyFoundation] Navigating context to: ${url}`);
        await this.page.goto(url, { waitUntil: 'load' });
    }
    /**
     * Helper to wait for a specific duration in milliseconds.
     */
    async wait(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Wait for selector helper.
     */
    async waitForSelector(selector, timeout = 10000) {
        if (!this.page)
            throw new Error("Agent browser session is not initialized.");
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }
    /**
     * Clicks a target selector.
     */
    async click(selector) {
        if (!this.page)
            throw new Error("Agent browser session is not initialized.");
        await this.page.click(selector);
    }
    /**
     * Types text into a target input.
     */
    async type(selector, text) {
        if (!this.page)
            throw new Error("Agent browser session is not initialized.");
        await this.page.fill(selector, text);
    }
    /**
     * Saves the browser state (cookies + local storage contents) to file.
     */
    async saveState() {
        if (!this.context || !this.config.statePath)
            throw new Error("Browser context not established.");
        console.log(`[StanleyFoundation] Saving session state to: ${this.config.statePath}`);
        const state = await this.context.storageState();
        fs.writeFileSync(this.config.statePath, JSON.stringify(state, null, 2), 'utf-8');
    }
    /**
     * Serializes the captured timeline events to a JSON configuration block on disk.
     */
    saveMacroTimeline(filename) {
        const outputPath = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);
        console.log(`[StanleyFoundation] Serializing ${this.interactionTimeline.length} macro steps to: ${outputPath}`);
        try {
            const dataStr = JSON.stringify(this.interactionTimeline, null, 2);
            fs.writeFileSync(outputPath, dataStr, 'utf-8');
        }
        catch (err) {
            console.error(`[StanleyFoundation] Error serializing macro timeline to ${outputPath}:`, err);
        }
    }
    /**
     * Returns current timeline.
     */
    getTimeline() {
        return this.interactionTimeline;
    }
    /**
     * Closes browser sessions cleanly.
     */
    async cleanup() {
        console.log("[StanleyFoundation] Cleaning up browser processes...");
        if (this.browser) {
            await this.browser.close();
        }
        this.browser = null;
        this.context = null;
        this.page = null;
    }
}
exports.StanleyFoundation = StanleyFoundation;
//# sourceMappingURL=foundationAgent.js.map