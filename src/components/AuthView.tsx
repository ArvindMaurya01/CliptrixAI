import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Smartphone, KeyRound, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';
import { CliptrixLogo } from './CliptrixLogo';

interface AuthViewProps {
  onSuccessfulAuth: (name: string, email: string) => void;
  onBackToHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccessfulAuth }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Validation helpers
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidMobile = (val: string) => /^[+]?[\d\s-]{8,15}$/.test(val);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (mobileNumber && !isValidMobile(mobileNumber)) {
      alert('Please enter a valid mobile number (at least 8 digits).');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }
    const displayName = name || email.split('@')[0] || 'Professional User';
    const displayEmail = email || `${mobileNumber}@cliptrix.ai`;
    onSuccessfulAuth(displayName, displayEmail);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInIdentifier.trim().toLowerCase() === 'admin@cliptrix.ai') {
      if (authMethod === 'password' && signInPassword !== 'admin123') {
        alert('Incorrect admin password. (Use admin123)');
        return;
      }
      onSuccessfulAuth('System Administrator', 'admin@cliptrix.ai');
      return;
    }
    const displayName = signInIdentifier ? signInIdentifier.split('@')[0] : 'Professional User';
    const displayEmail = signInIdentifier.includes('@') ? signInIdentifier : `${signInIdentifier || 'user'}@cliptrix.ai`;
    onSuccessfulAuth(displayName, displayEmail);
  };

  const handleSendOtp = () => {
    if (!signInIdentifier) {
      alert('Please enter your email or mobile number first.');
      return;
    }
    setOtpSent(true);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput) return;
    setForgotSent(true);
  };

  const handleSocialAuth = (provider: string) => {
    onSuccessfulAuth(`${provider} User`, `user@${provider.toLowerCase()}.com`);
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 view-enter">
        <div className="max-w-md w-full glass-panel p-8 relative shadow-2xl gradient-border-card space-y-6">
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] p-0.5 shadow-lg shadow-[var(--accent-1)]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[var(--bg)] rounded-[14px] flex items-center justify-center p-2">
                <KeyRound className="w-7 h-7 text-[var(--accent-1)]" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Reset Password</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Enter your registered email address or mobile number to receive reset instructions.
              </p>
            </div>
          </div>

          {forgotSent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-[var(--text)]">Reset Instructions Sent</h4>
              <p className="text-xs text-[var(--text-muted)]">
                We have sent a secure password reset link / OTP to <strong className="text-[var(--text)]">{forgotInput}</strong>.
              </p>
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setForgotSent(false); }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] mt-2"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text)]">Email Address or Mobile Number</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="name@company.com or +1 555-0192"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 transition-all shadow-lg shadow-[var(--accent-1)]/25 flex items-center justify-center gap-2"
              >
                <span>Send Reset Link / OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs text-[var(--accent-1)] hover:underline font-medium"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 view-enter">
      <div className="max-w-md w-full glass-panel p-8 relative shadow-2xl gradient-border-card space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] p-0.5 shadow-lg shadow-[var(--accent-1)]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[var(--bg)] rounded-[14px] flex items-center justify-center p-2">
              <CliptrixLogo className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              {isSignUp ? 'Create Your Account' : 'Welcome Back to ClipTrix'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isSignUp ? 'Start analyzing your video assessments instantly.' : 'Sign in to access your assessment history and reports.'}
            </p>
          </div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialAuth('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-elevated)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-[var(--text)] transition-all shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('Facebook')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-elevated)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-[var(--text)] transition-all shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0 fill-current text-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>



        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-glass)]"></div></div>
          <span className="relative px-3 bg-[var(--bg)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-medium">or continue with credentials</span>
        </div>

        {/* Tab switcher for Sign In vs Create Account */}
        <div className="grid grid-cols-2 p-1.5 rounded-full glass-panel bg-[var(--bg-elevated)] border border-[var(--border-glass)]">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !isSignUp ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-md' : 'text-[var(--text)] hover:text-[var(--accent-1)]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isSignUp ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-md' : 'text-[var(--text)] hover:text-[var(--accent-1)]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth method switcher (Password vs OTP) for Sign In */}
        {!isSignUp && (
          <div className="flex rounded-2xl bg-[var(--bg)] p-1.5 text-xs font-semibold border border-[var(--border-glass)] shadow-inner">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-md font-bold'
                  : 'text-[var(--text)] hover:text-[var(--accent-1)]'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('otp')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                authMethod === 'otp'
                  ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-md font-bold'
                  : 'text-[var(--text)] hover:text-[var(--accent-1)]'
              }`}
            >
              OTP Login
            </button>
          </div>
        )}

        {isSignUp ? (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text)]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text)]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
              {email && (
                <p className={`text-[11px] font-medium pt-0.5 ${isValidEmail(email) ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isValidEmail(email) ? '✓ Valid email address format' : '✗ Please enter a valid email address (e.g. name@domain.com)'}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text)]">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter a mobile no"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
              {mobileNumber && (
                <p className={`text-[11px] font-medium pt-0.5 ${isValidMobile(mobileNumber) ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isValidMobile(mobileNumber) ? '✓ Valid mobile number' : '✗ Please enter a valid mobile number'}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
              {password && (() => {
                const strength = (() => {
                  if (password.length < 6) return { label: 'Weak', color: 'text-rose-500', bg: 'bg-rose-500', text: 'Weak password (at least 6 characters)' };
                  let score = 0;
                  if (password.length >= 8) score++;
                  if (/[A-Z]/.test(password)) score++;
                  if (/[0-9]/.test(password)) score++;
                  if (/[^A-Za-z0-9]/.test(password)) score++;
                  if (score <= 1) return { label: 'Weak', color: 'text-amber-500', bg: 'bg-amber-500', text: 'Weak password (add numbers or symbols)' };
                  if (score === 2 || score === 3) return { label: 'Medium', color: 'text-blue-500', bg: 'bg-blue-500', text: 'Medium strength password' };
                  return { label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500', text: 'Strong and secure password' };
                })();
                return (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${strength.color}`}>Strength: {strength.label}</span>
                      <span className="text-[var(--text-muted)]">{strength.text}</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.bg} ${strength.label === 'Weak' ? 'w-1/3' : strength.label === 'Medium' ? 'w-2/3' : 'w-full'}`}></div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text)]">Re-enter Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
              {confirmPassword && (
                <p className={`text-[11px] font-medium pt-1 ${confirmPassword === password ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[var(--accent-1)]/25 flex items-center justify-center gap-2 mt-2"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignInSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text)]">Email Address or Mobile Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="enter a email or mobile no"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
            </div>

            {authMethod === 'password' ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[var(--text)]">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-[var(--accent-1)] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[var(--text)]">One-Time Password (OTP)</label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] font-semibold text-[var(--accent-1)] hover:underline"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP Code'}
                  </button>
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required={authMethod === 'otp'}
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 482910)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-1)] tracking-widest font-mono transition-colors"
                  />
                </div>
                {otpSent && (
                  <p className="text-[11px] text-emerald-500 font-medium">
                    ✓ OTP code sent successfully to {signInIdentifier}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[var(--accent-1)]/25 flex items-center justify-center gap-2 mt-2"
            >
              <span>{authMethod === 'otp' ? 'Verify & Sign In' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
