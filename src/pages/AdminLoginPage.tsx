import React, { useState, useEffect } from 'react';
import { Lock, Mail, ShieldAlert, ArrowLeft, ArrowRight, KeyRound, Check, Key } from 'lucide-react';
import { AuthService } from '../services/auth';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filledDemo, setFilledDemo] = useState(false);

  // Password reset flow states
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetTokenParam, setResetTokenParam] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);

  // Check if URL has reset token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('reset_token');
      const emailParam = params.get('email');
      if (token && emailParam) {
        setResetTokenParam(token);
        setResetEmail(emailParam);
        setIsForgotPasswordMode(true);
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccessMessage(null);
    setLoading(true);

    try {
      const result = await AuthService.requestPasswordReset(resetEmail);
      setResetSuccessMessage(
        t('resetEmailSentDetail', { email: result.email })
      );
    } catch (err: any) {
      setError(err.message || t('resetEmailNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.completePasswordReset(resetEmail, resetTokenParam!, newPassword);
      setResetCompleted(true);
      setTimeout(() => {
        setIsForgotPasswordMode(false);
        setResetTokenParam(null);
        setPassword(newPassword);
        setEmail(resetEmail);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to complete password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    const creds = AuthService.getDemoCredentials();
    setEmail(creds.email);
    setPassword(creds.password);
    setFilledDemo(true);
    setError(null);
    setTimeout(() => setFilledDemo(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors mb-8"
      >
        {isUrdu ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        <span>{t('adminReturnHome')}</span>
      </button>

      {/* Card */}
      <div className="bg-[#FAF7F2] p-8 rounded-lg border border-stone-300 shadow-xs space-y-6 text-start">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-950 text-amber-200 rounded-md mx-auto flex items-center justify-center font-serif text-xl border border-amber-600/30">
            ن
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            {isForgotPasswordMode ? t('forgotPasswordTitle') : t('adminLoginTitle')}
          </h1>
          <p className="text-xs text-stone-600">
            {isForgotPasswordMode ? t('forgotPasswordDesc') : t('adminLoginDesc')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 space-y-1">
            <p className="font-semibold">{t('resetEmailSentSuccess')}</p>
            <p className="leading-relaxed">{resetSuccessMessage}</p>
          </div>
        )}

        {/* View 1: Complete Password Reset with Token */}
        {isForgotPasswordMode && resetTokenParam ? (
          <form onSubmit={handleCompleteResetSubmit} className="space-y-4">
            {resetCompleted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('passwordUpdatedSuccess')}</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    {t('adminEmailLabel')}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={resetEmail}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded text-xs text-stone-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    {t('newPasswordLabel')} (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-amber-50 text-xs font-medium rounded transition-colors shadow-xs"
                >
                  {loading ? 'Updating...' : t('updatePasswordBtn')}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setIsForgotPasswordMode(false);
                setResetTokenParam(null);
              }}
              className="w-full text-center text-xs text-stone-600 hover:text-stone-900 py-1"
            >
              {t('backToLoginBtn')}
            </button>
          </form>
        ) : isForgotPasswordMode ? (
          /* View 2: Request Password Reset Link */
          <form onSubmit={handleResetRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('adminEmailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@maktaba.library"
                  className="w-full ps-9 pe-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-amber-50 text-xs font-medium rounded transition-colors shadow-xs"
            >
              {loading ? 'Dispatching...' : t('sendResetLinkBtn')}
            </button>

            <button
              type="button"
              onClick={() => setIsForgotPasswordMode(false)}
              className="w-full text-center text-xs text-stone-600 hover:text-stone-900 py-1"
            >
              {t('backToLoginBtn')}
            </button>
          </form>
        ) : (
          /* View 3: Standard Login */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                {t('adminEmailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@noor.library"
                  className="w-full ps-9 pe-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  {t('adminPasswordLabel')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordMode(true);
                    setResetEmail(email || 'admin@noor.library');
                    setError(null);
                  }}
                  className="text-[11px] text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
                >
                  {t('adminForgotPasswordBtn')}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full ps-9 pe-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-amber-50 text-xs font-medium rounded transition-colors shadow-xs"
            >
              {loading ? 'Authenticating...' : t('adminSignInBtn')}
            </button>
          </form>
        )}

        {/* Quick fill demo credentials */}
        {!isForgotPasswordMode && (
          <div className="pt-4 border-t border-stone-300 text-center space-y-2">
            <p className="text-[11px] text-stone-500">
              Authorized Evaluator Credentials:
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-900 hover:text-emerald-700 font-medium px-3 py-1.5 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors"
            >
              {filledDemo ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('adminCredsFilled')}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('adminDemoCredsBtn')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
