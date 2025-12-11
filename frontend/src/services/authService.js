/**
 * 🔐 AUTHENTICATION SERVICE LAYER
 * ------------------------------------------------------------------
 * A hybrid service that attempts real API calls first, then gracefully
 * falls back to a robust local mock (localStorage) simulation.
 * * - Network First: Tries to hit process.env.VITE_API_URL
 * - Offline Ready: Simulates a full backend database locally
 * - Latency Injection: Adds realistic delays for better UX
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const MOCK_DELAY = 800; // ms to simulate network latency

// --- STORAGE KEYS ---
const KEY_USERS = 'ranger_users_v1';
const KEY_TOKEN = 'ranger_auth_token_v1';

// --- UTILS ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const logSystem = (msg, type = 'info') => {
  const styles = type === 'error' 
    ? 'background: #450a0a; color: #fca5a5; padding: 2px 4px; border-radius: 2px;'
    : 'background: #064e3b; color: #6ee7b7; padding: 2px 4px; border-radius: 2px;';
  console.log(`%c[AUTH SERVICE] ${msg}`, styles);
};

// ============================================================================
// 🛠️ MOCK BACKEND SIMULATION (LOCAL STORAGE)
// ============================================================================
const MockDB = {
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
    } catch { return []; }
  },
  
  saveUser: (user) => {
    const users = MockDB.getUsers();
    users.push(user);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  },

  findUser: (email) => {
    const users = MockDB.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  validateCreds: (email, password) => {
    const user = MockDB.findUser(email);
    // In a real app, never store passwords plain text. 
    // This is a local mock ONLY.
    if (user && user.password === password) return user;
    return null;
  }
};

// ============================================================================
// 📡 PUBLIC API METHODS
// ============================================================================

/**
 * 1. CHECK EMAIL EXISTENCE
 * GET /api/auth/check-email?email=...
 */
export async function checkEmailExists(email) {
  try {
    // Attempt Real Network Call
    const res = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.exists;
    }
    throw new Error('Network fallback');
  } catch (err) {
    // Fallback: Local Mock
    await delay(600); // Simulate network hop
    const user = MockDB.findUser(email);
    return !!user;
  }
}

/**
 * 2. REGISTER NEW USER
 * POST /api/auth/register
 */
export async function registerUser({ name, email, password, role }) {
  try {
    // Attempt Real Network Call
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    if (res.ok) {
      return await res.json(); // Expected: { user, token }
    } else if (res.status !== 404 && res.status !== 500) {
      // If server responded with logic error (e.g. 409 Conflict), throw it
      const errorData = await res.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    throw new Error('Network fallback');
  } catch (err) {
    // Fallback: Local Mock
    logSystem(`Running Mock Registration for ${email}`, 'info');
    await delay(MOCK_DELAY);

    // 1. Validation
    if (MockDB.findUser(email)) {
      throw new Error("Account with this email already exists");
    }

    // 2. Create User
    const newUser = {
      id: `rng_${Date.now()}`,
      name,
      email,
      password, // Note: Stored plain text only for local mock demo
      role: role || 'ranger',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      isMock: true
    };

    // 3. Save & Return
    MockDB.saveUser(newUser);
    
    // Generate Mock Token
    const token = `mock_token_${Date.now()}_${btoa(email)}`;
    
    return { user: newUser, token };
  }
}

/**
 * 3. LOGIN USER
 * POST /api/auth/login
 */
export async function loginUser({ email, password }) {
  try {
    // Attempt Real Network Call
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      return await res.json();
    }
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error("Invalid credentials");
    throw new Error(errorData.message || 'Network fallback');
  } catch (err) {
    // Fallback: Local Mock
    logSystem(`Running Mock Login for ${email}`, 'info');
    await delay(MOCK_DELAY);

    const user = MockDB.validateCreds(email, password);
    
    if (user) {
      const token = `mock_token_${Date.now()}_${btoa(email)}`;
      return { user, token };
    } else {
      throw new Error("Invalid credentials");
    }
  }
}

/**
 * 4. REQUEST PASSWORD RESET
 * POST /api/auth/forgot-password
 */
export async function requestPasswordReset(email) {
  try {
    await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    // Always return true for security (don't reveal user existence)
    return true;
  } catch (err) {
    // Fallback
    logSystem(`Mock Password Reset Request for ${email}`, 'info');
    await delay(MOCK_DELAY);
    return true; // We pretend we sent it
  }
}

/**
 * 5. RESET PASSWORD
 * POST /api/auth/reset-password
 */
export async function resetPassword({ token, newPassword }) {
  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
    if (!res.ok) throw new Error('Invalid Token');
    return await res.json();
  } catch (err) {
    // Fallback
    logSystem(`Mock Password Update`, 'info');
    await delay(MOCK_DELAY);
    
    if (!token) throw new Error("Missing token");
    
    // In a real mock, we would find the user by token, but for now
    // we just simulate success to complete the UI flow.
    return { success: true };
  }
}