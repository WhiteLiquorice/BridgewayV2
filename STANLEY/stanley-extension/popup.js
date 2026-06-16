document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const runBtn = document.getElementById('run-btn');
  const connectionBadge = document.getElementById('connection-badge');
  const badgeText = document.getElementById('badge-text');
  const statusDesc = document.getElementById('status-desc');
  const statusLog = document.getElementById('status-log');
  const exampleTags = document.querySelectorAll('.example-tag');

  // Fill input when clicking tag examples
  exampleTags.forEach(tag => {
    tag.addEventListener('click', () => {
      taskInput.value = tag.getAttribute('data-text');
    });
  });

  // Update popup badge and state
  function setConnectionState(connected) {
    if (connected) {
      connectionBadge.className = 'badge connected';
      badgeText.textContent = 'Connected';
      runBtn.removeAttribute('disabled');
    } else {
      connectionBadge.className = 'badge disconnected';
      badgeText.textContent = 'Offline';
      runBtn.setAttribute('disabled', 'true');
    }
  }

  // Request latest daemon status and logs from background script
  function queryStatus() {
    chrome.runtime.sendMessage({ action: "get_status" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("[Stanley Popup] Could not communicate with background script:", chrome.runtime.lastError.message);
        setConnectionState(false);
        return;
      }
      if (response) {
        setConnectionState(response.connected);
        if (response.lastLog) {
          statusLog.textContent = response.lastLog;
        }
        if (response.lastDesc) {
          statusDesc.textContent = response.lastDesc;
        }
      }
    });
  }

  // Listen for updates from background.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "status_update") {
      setConnectionState(message.connected);
      if (message.log) statusLog.textContent = message.log;
      if (message.desc) statusDesc.textContent = message.desc;
    }
  });

  // Submit automation task on run button click
  runBtn.addEventListener('click', () => {
    const prompt = taskInput.value.trim();
    if (!prompt) return;

    statusDesc.textContent = 'Orchestrating workflow...';
    statusLog.textContent = 'Passing message to Daemon Host';

    chrome.runtime.sendMessage({ action: "run_workflow", prompt: prompt }, (response) => {
      if (chrome.runtime.lastError) {
        statusDesc.textContent = 'Failed to execute';
        statusLog.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.error) {
        statusDesc.textContent = 'Daemon Error';
        statusLog.textContent = response.error;
      }
    });
  });

  // Initial poll and setup standard interval polling
  queryStatus();
  const pollInterval = setInterval(queryStatus, 1000);

  // Clear timer when popup is closed
  window.addEventListener('unload', () => {
    clearInterval(pollInterval);
  });
});
