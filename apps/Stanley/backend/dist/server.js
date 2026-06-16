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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const automationAgent_1 = require("./automationAgent");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Singleton instance of the Stanley Automation Agent
let agent = null;
function getAgent() {
    if (!agent) {
        agent = new automationAgent_1.StanleyAutomationAgent();
    }
    return agent;
}
// 1. Initialize browser session
app.post('/api/initialize', async (req, res) => {
    const { startUrl } = req.body;
    try {
        const currentAgent = getAgent();
        await currentAgent.initialize(startUrl);
        res.status(200).json({ success: true, message: "Stanley browser instance initialized." });
    }
    catch (err) {
        const error = err;
        console.error("[Stanley Server] Initialize failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// 2. Execute JavaScript invisibly in the page console
app.post('/api/console', async (req, res) => {
    const { jsCode } = req.body;
    if (!jsCode) {
        res.status(400).json({ success: false, error: "Missing jsCode parameter." });
        return;
    }
    try {
        const currentAgent = getAgent();
        const result = await currentAgent.executeInvisibleConsoleCommand(jsCode);
        const logs = currentAgent.getConsoleLogs();
        res.status(200).json({ ...result, logs });
    }
    catch (err) {
        const error = err;
        console.error("[Stanley Server] Command execution failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// 3. Fetch buffered console logs
app.get('/api/logs', (req, res) => {
    try {
        const logs = getAgent().getConsoleLogs();
        res.status(200).json({ success: true, logs });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ success: false, error: error.message });
    }
});
// 4. Clear console logs buffer
app.post('/api/logs/clear', (req, res) => {
    try {
        getAgent().clearConsoleLogs();
        res.status(200).json({ success: true, message: "Console logs cleared." });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ success: false, error: error.message });
    }
});
// 5. Retrieve base64 screenshot of active viewport
app.get('/api/screenshot', async (req, res) => {
    try {
        const currentAgent = getAgent();
        const screenshot = await currentAgent.captureViewportBase64();
        res.status(200).json({ success: true, screenshot: `data:image/png;base64,${screenshot}` });
    }
    catch (err) {
        const error = err;
        console.error("[Stanley Server] Screenshot retrieval failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// 6. Run one step of LLM reasoning & auto-execution
app.post('/api/step', async (req, res) => {
    const { goal } = req.body;
    if (!goal) {
        res.status(400).json({ success: false, error: "Missing goal parameter." });
        return;
    }
    try {
        const currentAgent = getAgent();
        // Step 1: Query Gemini Vision to determine the next action
        console.log(`[Stanley Server] Thinking next step for goal: "${goal}"`);
        const action = await currentAgent.determineNextAction(goal);
        console.log(`[Stanley Server] Action selected: ${action.actionType} | Payload: ${action.payload}`);
        // Step 2: Auto-execute the action if requested
        let executionResult = null;
        let executionError;
        if (action.actionType === 'execute_js') {
            const exec = await currentAgent.executeInvisibleConsoleCommand(action.payload);
            executionResult = exec.result;
            executionError = exec.error;
        }
        else if (action.actionType === 'navigate') {
            await currentAgent.navigate(action.payload);
        }
        else if (action.actionType === 'wait') {
            const waitMs = parseInt(action.payload, 10) || 2000;
            await new Promise(resolve => setTimeout(resolve, waitMs));
        }
        const logs = currentAgent.getConsoleLogs();
        const nextScreenshot = await currentAgent.captureViewportBase64();
        res.status(200).json({
            success: true,
            thought: action.thought,
            actionType: action.actionType,
            payload: action.payload,
            executionResult,
            executionError,
            logs,
            screenshot: `data:image/png;base64,${nextScreenshot}`
        });
    }
    catch (err) {
        const error = err;
        console.error("[Stanley Server] Step execution failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// 7. Cleanup session
app.post('/api/cleanup', async (req, res) => {
    try {
        if (agent) {
            await agent.cleanup();
            agent = null;
        }
        res.status(200).json({ success: true, message: "Stanley browser process closed." });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ success: false, error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`[Stanley Backend] Server is running on http://localhost:${PORT}`);
});
