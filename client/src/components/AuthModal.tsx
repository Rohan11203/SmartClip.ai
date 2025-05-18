// src/components/AuthModal.jsx
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function AuthModal({
  isOpen,
  onClose,
  onSubmit,
  onGoogle,
  error,
  loading,
  googleLoading,
}: any) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  if (!isOpen) return null;
  const isSignup = mode === "signup";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1e1e1e] rounded-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6  dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-5">
          {isSignup ? "Sign up" : "Sign in"}
        </h2>

        {/* Google button */}
        <button
          onClick={() => onGoogle()}
          className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg py-2 mb-4 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          {!googleLoading ? (
            <>
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {isSignup ? "Sign up" : "Sign in"} with Google
              </span>
            </>
          ) : (
            <ClipLoader size={16} color="orange" />
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs mb-4">
          <span className="flex-1 border-t border-gray-300 dark:border-gray-600" />
          <span className="px-2">{isSignup ? "or" : "or"}</span>
          <span className="flex-1 border-t border-gray-300 dark:border-gray-600" />
        </div>

        {/* Username */}
        {isSignup && (
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        )}
        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {/* eye icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.269 2.943 
                       9.542 7-1.273 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={() => onSubmit(mode, { username, email, password })}
          className={`w-full cursor-pointer font-semibold rounded-lg py-2 mb-4 transition
            ${
              isSignup
                ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800"
                : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800"
            }`}
        >
          {!loading ? (
            isSignup ? (
              "Sign up"
            ) : (
              "Sign in"
            )
          ) : (
            <ClipLoader size={16} color="purple" />
          )}
        </button>

        {/* Terms (only on signup) */}
        {isSignup && (
          <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mb-3">
            By signing up, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            &amp;{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error[0]}</p>
        )}
        {/* Footer toggle */}
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setMode(isSignup ? "signin" : "signup")}
            className="font-medium cursor-pointer text-purple-600 hover:underline dark:text-purple-400"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
