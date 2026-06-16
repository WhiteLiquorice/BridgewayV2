let nativePort = null;
let isConnected = false;
let lastLog = "Idle";
let lastDesc = "Ready to launch daemon wrapper.";

const HOST_NAME = "com.project.stanley";

// Connect to native daemon
function connectToNativeHost() {
  if (nativePort !== null) {
    return;
  }

  console.log(`[Stanley Extension] Connecting to native host: ${HOST_NAME}`);
  try {
    nativePort = chrome.runtime.connectNative(HOST_NAME);
    isConnected = true;

    nativePort.onMessage.addListener((msg) => {
      console.log("[Stanley Extension] Received message from native daemon:", msg);
      
      // Update state
      if (msg.log) {
        lastLog = msg.log;
      }
      if (msg.desc) {
        lastDesc = msg.desc;
      }
      
      // Push state update to popup if open
      chrome.runtime.sendMessage({
        action: "status_update",
        connected: isConnected,
        log: lastLog,
        desc: lastDesc
      }).catch(() => {
        // Suppress errors when popup is closed
      });
    });

    nativePort.onDisconnect.addListener(() => {
      console.log("[Stanley Extension] Disconnected from native daemon.");
      const err = chrome.runtime.lastError;
      if (err) {
        console.warn("[Stanley Extension] Native error details:", err.message);
        lastLog = "Disconnected: " + err.message;
      } else {
        lastLog = "Connection closed cleanly.";
      }
      lastDesc = "Connection failed. Run daemon.bat or register manifest.";
      nativePort = null;
      isConnected = false;

      // Notify popup
      chrome.runtime.sendMessage({
        action: "status_update",
        connected: isConnected,
        log: lastLog,
        desc: lastDesc
      }).catch(() => {});
    });
  } catch (err) {
    console.error("[Stanley Extension] Exception during connection:", err);
    isConnected = false;
    lastLog = "Error: " + err.message;
    lastDesc = "Failed to launch native connection.";
    nativePort = null;
  }
}

// Auto-connect on background startup
connectToNativeHost();

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_status") {
    // Attempt reconnect if offline
    if (!isConnected) {
      connectToNativeHost();
    }
    sendResponse({
      connected: isConnected,
      lastLog: lastLog,
      lastDesc: lastDesc
    });
  } else if (request.action === "run_workflow") {
    if (!isConnected || !nativePort) {
      connectToNativeHost();
    }
    
    if (isConnected && nativePort) {
      lastDesc = "Workflow triggered...";
      lastLog = `Sending prompt: "${request.prompt}"`;
      
      // Forward the workflow request to native host daemon
      nativePort.postMessage({
        prompt: request.prompt
      });
      
      sendResponse({ success: true });
    } else {
      sendResponse({ error: "Native Daemon is not running or registered." });
    }
  }
  return true; // Keep message channel open for async responses
});
