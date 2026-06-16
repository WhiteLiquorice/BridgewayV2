document.addEventListener('DOMContentLoaded', () => {
  // UI Panels
  const loginPanel = document.getElementById('login-panel');
  const mainPanel = document.getElementById('main-panel');
  
  // Login Panel Elements
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');
  const loginStatus = document.getElementById('login-status');
  
  // Main Panel Elements
  const userInfo = document.getElementById('user-info');
  const signoutBtn = document.getElementById('signout-btn');
  const taskInput = document.getElementById('task-input');
  const runBtn = document.getElementById('run-btn');
  const connectionBadge = document.getElementById('connection-badge');
  const badgeText = document.getElementById('badge-text');
  const statusDesc = document.getElementById('status-desc');
  const statusLog = document.getElementById('status-log');
  const exampleTags = document.querySelectorAll('.example-tag');

  // Firebase Config Identifiers
  const FIREBASE_API_KEY = "AIzaSyAs-PlaceholderApiKeyGoesHere";
  const FIREBASE_PROJECT_ID = "bridgeway-db29e";

  let hasValidSession = false;

  // Handle example clicks
  exampleTags.forEach(tag => {
    tag.addEventListener('click', () => {
      taskInput.value = tag.getAttribute('data-text');
    });
  });

  // Switch between Login and Main Workspace panels
  function togglePanels(loggedIn) {
    if (loggedIn) {
      loginPanel.style.display = 'none';
      mainPanel.style.display = 'block';
    } else {
      loginPanel.style.display = 'block';
      mainPanel.style.display = 'none';
      runBtn.setAttribute('disabled', 'true');
    }
  }

  // Update popup badge and state
  function setConnectionState(connected) {
    if (connected && hasValidSession) {
      connectionBadge.className = 'badge connected';
      badgeText.textContent = 'Connected';
      runBtn.removeAttribute('disabled');
    } else {
      connectionBadge.className = 'badge disconnected';
      badgeText.textContent = connected ? 'Active' : 'Offline';
      if (!connected) {
        runBtn.setAttribute('disabled', 'true');
      }
    }
  }

  // Query background for connection status and logs
  function queryStatus() {
    chrome.runtime.sendMessage({ action: "get_status" }, (response) => {
      if (chrome.runtime.lastError) {
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

  // Submit automation task
  runBtn.addEventListener('click', () => {
    const prompt = taskInput.value.trim();
    if (!prompt || !hasValidSession) return;

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

  // Login handler
  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      loginStatus.textContent = "Email and password are required.";
      return;
    }

    loginStatus.style.color = "var(--accent)";
    loginStatus.textContent = "Authenticating...";
    loginBtn.disabled = true;

    try {
      // 1. Call Firebase Auth REST API
      const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
      const authRes = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });

      if (!authRes.ok) {
        const errData = await authRes.json();
        throw new Error(errData.error.message || "Authentication failed.");
      }

      const authData = await authRes.json();
      const uid = authData.localId;
      const idToken = authData.idToken;

      // 2. Query user status in Firestore REST API
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`;
      const dbRes = await fetch(firestoreUrl, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (!dbRes.ok) {
        throw new Error("License details not found. Register on the website first.");
      }

      const dbData = await dbRes.json();
      const fields = dbData.fields;
      const status = fields.status ? fields.status.stringValue : 'inactive';
      
      let trialEndsAtVal = null;
      if (fields.trialEndsAt && fields.trialEndsAt.timestampValue) {
        trialEndsAtVal = fields.trialEndsAt.timestampValue;
      }

      // Validate session access
      const access = validateAccess(status, trialEndsAtVal);
      if (!access.isValid) {
        throw new Error(access.reason);
      }

      // Save session info
      await chrome.storage.local.set({
        email: email,
        uid: uid,
        idToken: idToken,
        status: status,
        trialEndsAt: trialEndsAtVal,
        savedAt: Date.now()
      });

      loginStatus.textContent = "";
      hasValidSession = true;
      userInfo.textContent = access.label;
      togglePanels(true);
      queryStatus();
    } catch (err) {
      console.error(err);
      loginStatus.style.color = "var(--error)";
      loginStatus.textContent = err.message.replace(/_/g, ' ');
    } finally {
      loginBtn.disabled = false;
    }
  });

  // Sign out handler
  signoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await chrome.storage.local.remove(['email', 'uid', 'idToken', 'status', 'trialEndsAt', 'savedAt']);
    hasValidSession = false;
    emailInput.value = "";
    passwordInput.value = "";
    togglePanels(false);
  });

  // Validate account status limits
  function validateAccess(status, trialEndsAtIso) {
    if (status === 'active') {
      return { isValid: true, label: "Butler Status: Active (Paid License)", reason: "" };
    }
    
    if (status === 'trialing' && trialEndsAtIso) {
      const ends = new Date(trialEndsAtIso).getTime();
      const now = Date.now();
      if (ends > now) {
        const daysLeft = Math.ceil((ends - now) / (24 * 60 * 60 * 1000));
        return { isValid: true, label: `Butler Status: Trial active (${daysLeft} days left)`, reason: "" };
      } else {
        return { isValid: false, label: "", reason: "Trial expired. Purchase a lifetime license." };
      }
    }

    return { isValid: false, label: "", reason: "License inactive. Upgrade account to access." };
  }

  // Session verification on load
  async function checkSession() {
    const data = await chrome.storage.local.get(['email', 'uid', 'idToken', 'status', 'trialEndsAt', 'savedAt']);
    
    if (data.idToken && data.uid) {
      // Validate local cache first
      const access = validateAccess(data.status, data.trialEndsAt);
      if (access.isValid) {
        hasValidSession = true;
        userInfo.textContent = access.label;
        togglePanels(true);
        queryStatus();
        
        // Quietly re-verify with Firestore in the background
        try {
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${data.uid}`;
          const dbRes = await fetch(firestoreUrl, {
            headers: { 'Authorization': `Bearer ${data.idToken}` }
          });
          if (dbRes.ok) {
            const dbData = await dbRes.json();
            const status = dbData.fields.status ? dbData.fields.status.stringValue : 'inactive';
            let trialEndsAtVal = null;
            if (dbData.fields.trialEndsAt && dbData.fields.trialEndsAt.timestampValue) {
              trialEndsAtVal = dbData.fields.trialEndsAt.timestampValue;
            }
            
            const freshAccess = validateAccess(status, trialEndsAtVal);
            if (!freshAccess.isValid) {
              // Session expired in backend, sign out
              signoutBtn.click();
            } else {
              userInfo.textContent = freshAccess.label;
              chrome.storage.local.set({ status, trialEndsAt: trialEndsAtVal });
            }
          }
        } catch (e) {
          // Ignore background fetch errors (e.g. offline) to allow local cached runs
        }
      } else {
        togglePanels(false);
      }
    } else {
      togglePanels(false);
    }
  }

  // Initialize
  checkSession();
  setInterval(queryStatus, 1000);
});
