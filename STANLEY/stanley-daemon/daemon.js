const fs = require('fs');
const path = require('path');

// Redirect all standard console.log output to stderr so it does not corrupt the Native Messaging stdout stream
console.log = console.error;

const { StanleyFoundation } = require('../foundationAgent.js');

// Helper to write length-prefixed messages to stdout (Chrome Native Messaging protocol)
function sendResponse(msg) {
  const payload = Buffer.from(JSON.stringify(msg), 'utf8');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32LE(payload.length, 0);
  process.stdout.write(Buffer.concat([lenBuf, payload]));
}

// Logging utilities that notify the Chrome extension UI
function logToExtension(desc, logDetails) {
  sendResponse({ desc, log: logDetails });
}

// Simple natural language prompt compiler to build action arrays
function compilePromptToActions(prompt) {
  const actions = [];
  // Split on commas, semicolons or newlines
  const steps = prompt.split(/[,;\n]+/);
  
  for (let step of steps) {
    step = step.trim();
    if (!step) continue;
    
    const lowerStep = step.toLowerCase();
    
    if (lowerStep.startsWith('go to') || lowerStep.startsWith('navigate to') || lowerStep.startsWith('goto')) {
      const match = step.match(/(?:go\s+to|navigate\s+to|goto)\s+['"]?([^'"]+)['"]?/i);
      if (match) {
        let url = match[1].trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        actions.push({ action: 'navigate', url });
      }
    } else if (lowerStep.startsWith('click')) {
      const match = step.match(/click\s+(?:on\s+|at\s+)?['"]?([^'"]+)['"]?/i);
      if (match) {
        actions.push({ action: 'click', selector: match[1].trim() });
      }
    } else if (lowerStep.startsWith('type')) {
      const match = step.match(/type\s+['"]?([^'"]+)['"]?\s+into\s+['"]?([^'"]+)['"]?/i);
      if (match) {
        actions.push({ action: 'type', value: match[1], selector: match[2].trim() });
      }
    } else if (lowerStep.startsWith('wait')) {
      const match = step.match(/wait\s+(\d+)\s*(ms|s|second|seconds)?/i);
      if (match) {
        let val = parseInt(match[1], 10);
        let unit = match[2] ? match[2].toLowerCase() : 'ms';
        if (unit.startsWith('s') || val < 100) {
          val = val * 1000; // default to seconds if small value or 's' specified
        }
        actions.push({ action: 'wait', ms: val });
      }
    } else {
      // Fallback: search for elements or links if unrecognized
      console.error(`Unrecognized instruction step: "${step}"`);
    }
  }
  
  return actions;
}

// Browser automation engine using StanleyFoundation
async function runWorkflow(actions) {
  const agent = new StanleyFoundation({
    headless: process.env.STANLEY_HEADLESS === 'true' ? true : false, // Check environmental headless flag
    statePath: path.join(__dirname, 'stanley_session_state.json')
  });

  try {
    logToExtension("Initializing browser", "Launching decoupled Playwright instance...");
    await agent.initialize();
    
    for (let i = 0; i < actions.length; i++) {
      const step = actions[i];
      const stepLabel = `[Step ${i+1}/${actions.length}]`;
      
      switch (step.action) {
        case 'navigate':
          logToExtension(`${stepLabel} Navigating`, `URL: ${step.url}`);
          await agent.navigate(step.url);
          break;
          
        case 'click':
          logToExtension(`${stepLabel} Clicking`, `Selector: ${step.selector}`);
          await agent.waitForSelector(step.selector, 15000);
          await agent.click(step.selector);
          break;
          
        case 'type':
          logToExtension(`${stepLabel} Typing`, `Value into: ${step.selector}`);
          await agent.waitForSelector(step.selector, 15000);
          await agent.type(step.selector, step.value);
          break;
          
        case 'wait':
          logToExtension(`${stepLabel} Waiting`, `Duration: ${step.ms}ms`);
          await agent.wait(step.ms);
          break;
          
        default:
          logToExtension(`${stepLabel} Error`, `Unknown action: ${step.action}`);
      }
    }
    
    // Save browser storage state (session, cookies) for persistence
    await agent.saveState();
    logToExtension("Workflow Complete", `Executed ${actions.length} commands successfully.`);
  } catch (err) {
    logToExtension("Workflow Failed", `Error: ${err.message}`);
  } finally {
    await agent.cleanup();
  }
}

// Receive and buffer standard input chunks
let inputBuffer = Buffer.alloc(0);

process.stdin.on('data', (chunk) => {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  
  while (inputBuffer.length >= 4) {
    const length = inputBuffer.readUInt32LE(0);
    
    if (inputBuffer.length >= 4 + length) {
      const messageBuffer = inputBuffer.slice(4, 4 + length);
      inputBuffer = inputBuffer.slice(4 + length);
      
      try {
        const message = JSON.parse(messageBuffer.toString('utf8'));
        handleIncomingMessage(message);
      } catch (err) {
        logToExtension("Protocol Error", "Failed to parse incoming JSON payload.");
      }
    } else {
      break;
    }
  }
});

// Route and execute incoming message requests
function handleIncomingMessage(msg) {
  if (msg.prompt) {
    const actions = compilePromptToActions(msg.prompt);
    if (actions.length === 0) {
      logToExtension("Empty Workflow", "No valid automation actions detected.");
      return;
    }
    runWorkflow(actions).catch((err) => {
      logToExtension("Process Error", err.message);
    });
  } else if (Array.isArray(msg.actions)) {
    runWorkflow(msg.actions).catch((err) => {
      logToExtension("Process Error", err.message);
    });
  } else {
    logToExtension("Invalid Message", "Requires 'prompt' or 'actions' array.");
  }
}

// Keep daemon running in stdio state
logToExtension("Daemon Active", "Listening on stdin channel...");
