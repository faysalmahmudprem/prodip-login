import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginCardProps {
  isVisible: boolean;
  onError: () => void;
  onSuccess: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ isVisible, onError, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // FIX: Password strength bar logic fixed - consistent level thresholds
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 5)  score++;
    if (pass.length > 9)  score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const getStrengthColor  = (s: number) => s <= 1 ? 'bg-red-500' : s <= 2 ? 'bg-orange-500' : s <= 3 ? 'bg-yellow-500' : s <= 4 ? 'bg-green-500' : 'bg-emerald-400';
  const getStrengthText   = (s: number) => s <= 1 ? 'text-red-400' : s <= 2 ? 'text-orange-400' : s <= 3 ? 'text-yellow-400' : s <= 4 ? 'text-green-400' : 'text-emerald-400';
  const getStrengthLabel  = (s: number) => s <= 1 ? 'Weak' : s <= 2 ? 'Fair' : s <= 3 ? 'Medium' : s <= 4 ? 'Strong' : 'Very Strong';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage('');
    setSuccessMessage('');

    if (username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      onError();
      return;
    }

    if (!isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        onError();
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        onError();
        return;
      }
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      onError();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(isLogin ? 'Login Successful!' : 'Account Created!');
      onSuccess();
    }, 2000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      onError();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Reset link sent to your email!');
      onSuccess();
    }, 1500);
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setErrorMessage('');
    setSuccessMessage('');
    if (isLogin) setConfirmPassword('');
  };

  const handleBackToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPassword(false);
    setIsLogin(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPassword(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSuccessContinue = () => {
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setIsForgotPassword(false);
    setIsLogin(true);
  };

  const cardBase = `w-full max-w-sm bg-[#111827] border rounded-2xl p-8 shadow-2xl transform transition-all duration-700`;
  const visibilityClass = isVisible
    ? `opacity-100 translate-y-0 scale-100 ${errorMessage ? 'border-red-500 shadow-[0_0_30px_-10px_rgba(239,68,68,0.4)]' : 'border-green-500/50 shadow-[0_0_50px_-12px_rgba(74,222,128,0.4)]'}`
    : 'opacity-0 translate-y-10 scale-95 border-transparent pointer-events-none';

  // Success screen
  if (successMessage) {
    return (
      <div className={`${cardBase} w-full max-w-sm bg-[#111827] border border-green-500/50 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(74,222,128,0.4)] flex flex-col items-center justify-center text-center ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
        <p className="text-gray-400 mb-6">{successMessage}</p>
        <button onClick={handleSuccessContinue} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors">
          Continue
        </button>
      </div>
    );
  }

  // Forgot Password screen
  if (isForgotPassword) {
    return (
      <div className={`${cardBase} ${visibilityClass}`}>
        <div className="mb-6">
          <button onClick={handleBackToLogin} className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 text-sm group">
            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset Password</h2>
            <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
          </div>
        </div>

        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="reset-email" className="block text-xs font-semibold text-gray-400 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="reset-email" type="text" disabled={isLoading}
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900/50">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button type="submit" disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-base font-bold text-white transition-all duration-200 shadow-lg ${isLoading ? 'bg-green-700 cursor-not-allowed opacity-80' : 'bg-green-600 hover:bg-green-500 active:scale-[0.98]'}`}>
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Sending...</> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    );
  }

  // Main Login / Sign Up screen
  return (
    <div className={`${cardBase} ${visibilityClass}`}>
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight transition-all duration-300">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400 text-sm">
          {isLogin ? 'Enter your details to sign in' : 'Sign up to get started'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1">
          <label htmlFor="username" className="block text-xs font-semibold text-gray-400 ml-1">Username</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
              <User size={18} />
            </div>
            <input
              id="username" type="text" disabled={isLoading}
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
              placeholder="Enter your username"
            />
          </div>
        </div>

        {/* Email (Sign Up only) */}
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <label htmlFor="email" className="block text-xs font-semibold text-gray-400 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              id="email" type="text" disabled={isLoading}
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-xs font-semibold text-gray-400 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="password" type={showPassword ? 'text' : 'password'} disabled={isLoading}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-[#1f2937] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
              placeholder="Enter your password"
            />
            <button type="button" disabled={isLoading} onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors focus:outline-none">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* FIX: Password strength bar - consistent 4-level logic */}
          {!isLogin && (
            <div className={`transition-all duration-300 overflow-hidden ${password ? 'max-h-12 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="flex gap-1.5 h-1.5 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className={`flex-1 rounded-full transition-colors duration-500 ${strength >= level + 1 ? getStrengthColor(strength) : strength >= level ? getStrengthColor(strength) : 'bg-gray-700'}`} />
                ))}
              </div>
              <p className={`text-[10px] text-right font-medium transition-colors duration-300 ${getStrengthText(strength)}`}>
                {getStrengthLabel(strength)}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password (Sign Up only) */}
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-400 ml-1">Confirm Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} disabled={isLoading}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-[#1f2937] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
              placeholder="Confirm your password"
            />
            <button type="button" disabled={isLoading} onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors focus:outline-none">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900/50">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button type="submit" disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-base font-bold text-white transition-all duration-200 shadow-lg ${isLoading ? 'bg-green-700 cursor-not-allowed opacity-80' : 'bg-green-600 hover:bg-green-500 active:scale-[0.98]'}`}>
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </div>

        {/* Footer links */}
        <div className="text-center space-y-2 pt-2">
          {isLogin && (
            <button type="button" onClick={handleForgotPasswordClick}
              className="block w-full text-xs text-gray-400 hover:text-white transition-colors focus:outline-none">
              Forgot Password?
            </button>
          )}
          <div className="text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} disabled={isLoading}
              className="font-semibold text-green-400 hover:text-green-300 transition-colors focus:outline-none disabled:opacity-50">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
