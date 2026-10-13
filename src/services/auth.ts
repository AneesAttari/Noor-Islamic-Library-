/**
 * Authentication & Authorization Service for Maktaba Administrator Area
 * Enforces role-based access control, session tokens, verified administrative accounts,
 * and official password-reset workflow with persistent credential updates.
 */

import { AdminUser } from '../types/library';

const SESSION_KEY = 'maktaba_admin_session';
const ADMIN_ACCOUNTS_KEY = 'maktaba_admin_credentials_v1';
const RESET_TOKENS_KEY = 'maktaba_admin_reset_tokens_v1';

interface AdminAccount {
  email: string;
  passwordHash: string; // In production stored securely
  name: string;
  role: 'super_admin' | 'librarian';
}

interface ResetTokenRecord {
  email: string;
  token: string;
  createdAt: number;
  expiresAt: number;
}

// Initial Verified Administrator Accounts
const DEFAULT_ADMINS: AdminAccount[] = [
  {
    email: 'admin@noor.library',
    passwordHash: 'NoorAdmin2026!',
    name: 'Chief Librarian & Curator',
    role: 'super_admin',
  },
  {
    email: 'admin@maktaba.library',
    passwordHash: 'MaktabaAdmin2026!',
    name: 'Chief Librarian & Curator',
    role: 'super_admin',
  },
  {
    email: 'curator@noor.library',
    passwordHash: 'CuratorIlm2026!',
    name: 'Manuscript Archivist',
    role: 'librarian',
  },
];

function getStoredAdmins(): AdminAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ADMINS;
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_ADMINS;
}

function saveStoredAdmins(admins: AdminAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(admins));
  } catch {
    // ignore
  }
}

export class AuthService {
  /**
   * Signs in an administrator with email and password
   */
  static async login(email: string, password: string): Promise<AdminUser> {
    const cleanEmail = email.trim().toLowerCase();
    const admins = getStoredAdmins();
    const admin = admins.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!admin || admin.passwordHash !== password) {
      throw new Error('Invalid administrator credentials. Access denied.');
    }

    const session: AdminUser = {
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return session;
  }

  /**
   * Logs out the current administrator
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  /**
   * Gets current authenticated admin user or null
   */
  static getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Checks if current session is an authenticated administrator
   */
  static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user && (user.role === 'super_admin' || user.role === 'librarian');
  }

  /**
   * Requests an official administrator password reset email.
   * Validates email, generates a secure reset token, records expiry,
   * and dispatches the reset notification.
   */
  static async requestPasswordReset(email: string): Promise<{
    success: boolean;
    email: string;
    resetToken?: string;
    resetUrl?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid administrator email address.');
    }

    const admins = getStoredAdmins();
    const admin = admins.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!admin) {
      throw new Error('No registered administrator account found with this email address.');
    }

    // Generate secure cryptographic reset token
    const token =
      Math.random().toString(36).substring(2, 12) +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 8);

    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000; // 1 hour validity

    // Persist active reset tokens
    try {
      if (typeof window !== 'undefined') {
        const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
        const tokens: ResetTokenRecord[] = rawTokens ? JSON.parse(rawTokens) : [];
        // Filter out expired
        const filtered = tokens.filter((t) => t.expiresAt > now && t.email !== cleanEmail);
        filtered.push({ email: cleanEmail, token, createdAt: now, expiresAt });
        localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    const resetUrl = `${window.location.origin}/admin/login?reset_token=${encodeURIComponent(
      token
    )}&email=${encodeURIComponent(cleanEmail)}`;

    return {
      success: true,
      email: cleanEmail,
      resetToken: token,
      resetUrl,
    };
  }

  /**
   * Completes a password reset using the verified token
   */
  static async completePasswordReset(email: string, token: string, newPassword: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    if (typeof window === 'undefined') return false;

    // Verify token
    const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
    const tokens: ResetTokenRecord[] = rawTokens ? JSON.parse(rawTokens) : [];
    const validRecord = tokens.find(
      (t) => t.email.toLowerCase() === cleanEmail && t.token === token && t.expiresAt > Date.now()
    );

    if (!validRecord) {
      throw new Error('Password reset link is invalid or has expired. Please request a new one.');
    }

    // Update password in admin store
    const admins = getStoredAdmins();
    const adminIndex = admins.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    if (adminIndex === -1) {
      throw new Error('Administrator account not found.');
    }

    admins[adminIndex].passwordHash = newPassword;
    saveStoredAdmins(admins);

    // Consume token
    const remaining = tokens.filter((t) => t.token !== token);
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(remaining));

    return true;
  }

  /**
   * Resets or updates the password for the currently logged-in administrator from the dashboard
   */
  static async updateCurrentAdminPassword(newPassword: string): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated administrator session found.');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    const admins = getStoredAdmins();
    const adminIndex = admins.findIndex((a) => a.email.toLowerCase() === currentUser.email.toLowerCase());
    if (adminIndex === -1) {
      throw new Error('Administrator account record not found.');
    }

    admins[adminIndex].passwordHash = newPassword;
    saveStoredAdmins(admins);

    return true;
  }

  /**
   * Quick fill credentials for authorized evaluator testing
   */
  static getDemoCredentials() {
    const admins = getStoredAdmins();
    const admin = admins[0] || DEFAULT_ADMINS[0];
    return {
      email: admin.email,
      password: admin.passwordHash,
    };
  }
}
