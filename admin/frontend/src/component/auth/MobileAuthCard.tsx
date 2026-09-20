"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { baseURL, secretKey, projectName } from "@/util/config";
import Logo from "@/assets/images/wudau-icon.jpg";
import { useAppDispatch } from "@/store/store";
import { login as adminLogin } from "@/store/adminSlice";

export interface MobileAuthCardProps {
  mode?: "login" | "signup";
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: (user: any) => void;
}

// Popular African and global country codes with Tanzania default
const COUNTRY_CODES = [
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+86", country: "China", flag: "🇨🇳" },
];

export default function MobileAuthCard({
  mode = "login",
  isModal = false,
  onClose,
  onSuccess,
}: MobileAuthCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // State management
  const [activeView, setActiveView] = useState<"main" | "mobile" | "google" | "admin">("main");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Backend settings from real API
  const [settings, setSettings] = useState<{
    googlePlaySwitch: boolean;
    loginBonus: number;
    privacyPolicyLink: string;
    termsOfUsePolicyLink: string;
    currencySymbol: string;
  }>({
    googlePlaySwitch: true,
    loginBonus: 5000,
    privacyPolicyLink: "https://www.termsfeed.com/live/d0e1017d-7ad3-439d-815a-bf4d195f6d0d",
    termsOfUsePolicyLink: "https://www.termsfeed.com/live/d0e1017d-7ad3-439d-815a-bf4d195f6d0d",
    currencySymbol: "TSh",
  });

  // Mobile number form state (defaulting to +255 Tanzania)
  const [countryCode, setCountryCode] = useState<string>("+255");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [mobileUserName, setMobileUserName] = useState<string>("");

  // Google email prompt state
  const [googleEmail, setGoogleEmail] = useState<string>("");
  const [googleName, setGoogleName] = useState<string>("");

  // Admin / Email password state
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");

  // Fetch real settings from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${baseURL}client/setting/getSetting`, {
          headers: { key: secretKey },
        });
        if (isMounted && res.data?.status && res.data?.data) {
          const d = res.data.data;
          setSettings({
            googlePlaySwitch: d.googlePlaySwitch !== false,
            loginBonus: d.loginBonus || 5000,
            privacyPolicyLink: d.privacyPolicyLink || "https://www.termsfeed.com/live/d0e1017d-7ad3-439d-815a-bf4d195f6d0d",
            termsOfUsePolicyLink: d.termsOfUsePolicyLink || "https://www.termsfeed.com/live/d0e1017d-7ad3-439d-815a-bf4d195f6d0d",
            currencySymbol: d.currency?.symbol || "TSh",
          });
        }
      } catch (e) {
        console.warn("Could not fetch live settings, using defaults", e);
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Utility to obtain or create persistent device identity (matches mobile Database.identity)
  const getDeviceIdentity = (): string => {
    if (typeof window === "undefined") return "web_client_user";
    let id = localStorage.getItem("wudao_web_identity");
    if (!id) {
      id = "web_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem("wudao_web_identity", id);
    }
    return id;
  };

  // Store user in local & session storage
  const handleAuthSuccess = (user: any, role: string = "user") => {
    if (typeof window !== "undefined") {
      const token = user.token || user._id || "token_" + Date.now();
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("isAuth", "true");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (onSuccess) {
      onSuccess(user);
    }
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  // 1. Quick Log In (Matches mobile LoginController.onQuickLogin)
  const handleQuickLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const identity = getDeviceIdentity();
      const randomNames = [
        "Juma Mwinyi",
        "Amina Said",
        "Baraka Mwangi",
        "Zawadi Tembo",
        "Kassim Omar",
        "Neema John",
        "Hamisi Bakari",
        "Zuhura Ally",
      ];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];

      const res = await axios.post(
        `${baseURL}client/user/loginOrSignUp`,
        {
          identity,
          email: identity,
          loginType: 3,
          fcmToken: "web_fcm_token_" + identity.slice(0, 10),
          userName: randomName,
        },
        { headers: { key: secretKey } }
      );

      if (res.data?.status && res.data?.user) {
        setSuccessMessage("Logged in successfully! 🚀");
        setTimeout(() => {
          handleAuthSuccess(res.data.user, "user");
        }, 300);
      } else if (res.data?.message === "You are blocked by the admin.") {
        setErrorMessage("This account has been blocked by the admin.");
      } else {
        setErrorMessage(res.data?.message || "Quick Login could not be completed. Please try again.");
      }
    } catch (err: any) {
      console.error("Quick login error:", err);
      setErrorMessage(err?.response?.data?.message || "Network error during Quick Login. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Mobile Number Login / Register (Matches mobile MobileNumLoginView & loginType 1)
  const handleMobileLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = phoneNumber.trim().replace(/^[0]/, "");
    if (!cleanNumber) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const fullMobile = `${countryCode}${cleanNumber}`;
      const identity = `mobile_${fullMobile.replace(/\+/g, "")}`;

      const res = await axios.post(
        `${baseURL}client/user/loginOrSignUp`,
        {
          identity,
          mobileNumber: fullMobile,
          loginType: 1,
          fcmToken: "web_fcm_" + identity.slice(0, 12),
          name: mobileUserName.trim() || undefined,
        },
        { headers: { key: secretKey } }
      );

      if (res.data?.status && res.data?.user) {
        setSuccessMessage("Mobile sign in successful! 🎉");
        setTimeout(() => {
          handleAuthSuccess(res.data.user, "user");
        }, 300);
      } else if (res.data?.message === "You are blocked by the admin.") {
        setErrorMessage("This account is blocked by the administrator.");
      } else {
        setErrorMessage(res.data?.message || "Mobile sign in failed. Please verify your number.");
      }
    } catch (err: any) {
      console.error("Mobile login error:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to connect to mobile auth service.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Google Social Login (Matches mobile LoginController.onGoogleLogin & loginType 2)
  const handleGoogleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!googleEmail.trim()) {
      setErrorMessage("Please enter your Google account email.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const email = googleEmail.trim().toLowerCase();
      const identity = `google_${email.replace(/[@.]/g, "_")}`;
      const name = googleName.trim() || email.split("@")[0];

      const res = await axios.post(
        `${baseURL}client/user/loginOrSignUp`,
        {
          identity,
          email,
          name,
          userName: `@${name.replace(/\s+/g, "").toLowerCase()}`,
          loginType: 2,
          fcmToken: "web_fcm_" + identity.slice(0, 12),
        },
        { headers: { key: secretKey } }
      );

      if (res.data?.status && res.data?.user) {
        setSuccessMessage("Google sign in successful! ✨");
        setTimeout(() => {
          handleAuthSuccess(res.data.user, "user");
        }, 300);
      } else if (res.data?.message === "You are blocked by the admin.") {
        setErrorMessage("This account has been blocked by the admin.");
      } else {
        setErrorMessage(res.data?.message || "Google sign in failed.");
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setErrorMessage(err?.response?.data?.message || "Error connecting to Google authentication.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Admin / Email Password Login (Preserves admin dashboard access)
  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const actionResult = await dispatch(
        adminLogin({
          email: adminEmail.trim(),
          data: {
            email: adminEmail.trim(),
            password: adminPassword.trim(),
          },
          adminId: "",
        })
      );

      if (adminLogin.fulfilled.match(actionResult)) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("role", "admin");
        }
        setSuccessMessage("Admin authentication verified! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 400);
      } else {
        setErrorMessage("Invalid credentials or administrator access denied.");
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      setErrorMessage("Failed to authenticate administrator.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Browse as Guest
  const handleBrowseAsGuest = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("role", "guest");
    }
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  return (
    <div className={`mobile-auth-wrapper ${isModal ? "is-modal" : "is-page"}`}>
      <div className="mobile-auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button for Modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="mobile-auth-close-btn"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* Brand Header */}
        <div className="mobile-auth-header">
          <div className="brand-logo-circle">
            <Image
              src={Logo}
              alt={projectName}
              width={76}
              height={76}
              priority
              className="brand-logo-img"
            />
          </div>
          <h2 className="mobile-auth-title">
            {mode === "signup" ? "Join the Community" : "Welcome to WUDAO"}
          </h2>
          <p className="mobile-auth-subtitle">
            Explore & share African moments, reels and talent
          </p>
          {settings.loginBonus > 0 && (
            <div className="welcome-bonus-pill">
              <span className="bonus-icon">🎁</span>
              <span>
                Get <strong>{settings.loginBonus.toLocaleString()}</strong> welcome coins
              </span>
            </div>
          )}
        </div>

        {/* Status Alerts */}
        {errorMessage && <div className="auth-alert error-alert">{errorMessage}</div>}
        {successMessage && <div className="auth-alert success-alert">{successMessage}</div>}

        {/* ============================================================== */}
        {/* VIEW: MAIN (Quick Login, Google, Mobile, Guest)                */}
        {/* ============================================================== */}
        {activeView === "main" && (
          <div className="mobile-auth-main-actions">
            {/* Quick Log In Button (Primary Gradient Pill) */}
            <button
              type="button"
              className="auth-btn quick-login-btn"
              onClick={handleQuickLogin}
              disabled={loading}
            >
              <div className="btn-icon-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                    fill="#FF4B1F"
                    stroke="#FF4B1F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="btn-label">
                {loading ? "Signing In..." : "Quick Log In"}
              </span>
            </button>

            {/* OR Divider */}
            <div className="auth-divider">
              <div className="divider-line" />
              <span className="divider-text">OR</span>
              <div className="divider-line" />
            </div>

            {/* Social / Mobile Action Row */}
            <div className="auth-secondary-row">
              {/* Google Button */}
              {settings.googlePlaySwitch && (
                <button
                  type="button"
                  className="auth-btn google-btn"
                  onClick={() => setActiveView("google")}
                  disabled={loading}
                >
                  <div className="btn-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.26v3.13C3.25 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.26C.46 8.22 0 10.05 0 12s.46 3.78 1.26 5.4l4.06-3.13z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.6l4.06 3.13c.94-2.83 3.58-4.98 6.68-4.98z"
                      />
                    </svg>
                  </div>
                  <span className="btn-label">Google</span>
                </button>
              )}

              {/* Mobile Number Button */}
              <button
                type="button"
                className="auth-btn mobile-btn"
                onClick={() => setActiveView("mobile")}
                disabled={loading}
              >
                <div className="btn-icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
                      stroke="#3F51B5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 18H12.01"
                      stroke="#3F51B5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="btn-label">Mobile</span>
              </button>
            </div>

            {/* Browse as Guest Button */}
            <button
              type="button"
              className="auth-btn guest-btn"
              onClick={handleBrowseAsGuest}
            >
              Browse as Guest
            </button>

            {/* Admin / Email Switch */}
            <div className="auth-footer-toggle">
              <button
                type="button"
                className="toggle-link"
                onClick={() => setActiveView("admin")}
              >
                Sign in with Email or Admin Account →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: MOBILE NUMBER LOGIN / REGISTER (Tanzania default)        */}
        {/* ============================================================== */}
        {activeView === "mobile" && (
          <form className="mobile-auth-sub-form" onSubmit={handleMobileLogin}>
            <div className="sub-form-header">
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setActiveView("main");
                  setErrorMessage("");
                }}
              >
                ← Back
              </button>
              <h4>Enter Mobile Number</h4>
              <p>Enter your phone number to continue or register</p>
            </div>

            <div className="input-field-group">
              <label>Phone Number</label>
              <div className="phone-input-row">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-select"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code + c.country} value={c.code}>
                      {c.flag} {c.code} ({c.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="phone-number-input"
                  autoFocus
                  required
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="input-field-group">
                <label>Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Kassim Omar"
                  value={mobileUserName}
                  onChange={(e) => setMobileUserName(e.target.value)}
                  className="standard-input"
                />
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW: GOOGLE ACCOUNT LOGIN                                     */}
        {/* ============================================================== */}
        {activeView === "google" && (
          <form className="mobile-auth-sub-form" onSubmit={handleGoogleLogin}>
            <div className="sub-form-header">
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setActiveView("main");
                  setErrorMessage("");
                }}
              >
                ← Back
              </button>
              <h4>Sign in with Google</h4>
              <p>Enter your Google account details to proceed</p>
            </div>

            <div className="input-field-group">
              <label>Google Email</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="standard-input"
                autoFocus
                required
              />
            </div>

            <div className="input-field-group">
              <label>Display Name (Optional)</label>
              <input
                type="text"
                placeholder="Your Name"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="standard-input"
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn google-submit"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Continue with Google"}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW: ADMIN / EMAIL PASSWORD LOGIN                             */}
        {/* ============================================================== */}
        {activeView === "admin" && (
          <form className="mobile-auth-sub-form" onSubmit={handleAdminLogin}>
            <div className="sub-form-header">
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setActiveView("main");
                  setErrorMessage("");
                }}
              >
                ← Back
              </button>
              <h4>Admin & Email Login</h4>
              <p>Access administration dashboard or your email account</p>
            </div>

            <div className="input-field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@wudau.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="standard-input"
                autoFocus
                required
              />
            </div>

            <div className="input-field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="standard-input"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mobile-auth-legal-footer">
          <span>By continuing, you agree to WUDAO&apos;s </span>
          <a
            href={settings.termsOfUsePolicyLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          <span> & </span>
          <a
            href={settings.privacyPolicyLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>

      <style jsx>{`
        .mobile-auth-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-auth-wrapper.is-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 15%, #1f122e 0%, #0d0914 60%, #050308 100%);
          padding: 24px 16px;
        }

        .mobile-auth-wrapper.is-modal {
          padding: 0;
        }

        .mobile-auth-card {
          width: 100%;
          max-width: 440px;
          background: rgba(18, 14, 26, 0.94);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 32px 26px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85), 0 0 60px rgba(255, 75, 31, 0.12);
          position: relative;
          color: #ffffff;
          font-family: inherit;
          animation: cardSlideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .mobile-auth-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-auth-close-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .mobile-auth-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 22px;
        }

        .brand-logo-circle {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(255, 75, 31, 0.35);
          border: 2px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 14px;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-auth-title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
          background: linear-gradient(135deg, #ffffff 30%, #ffd000 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mobile-auth-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 12px 0;
          line-height: 1.45;
        }

        .welcome-bonus-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255, 159, 0, 0.14);
          border: 1px solid rgba(255, 159, 0, 0.35);
          font-size: 12px;
          color: #ffb833;
          font-weight: 600;
        }

        .bonus-icon {
          font-size: 13px;
        }

        .auth-alert {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
          text-align: center;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.16);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .success-alert {
          background: rgba(34, 197, 94, 0.16);
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #86efac;
        }

        .mobile-auth-main-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .auth-btn {
          width: 100%;
          height: 54px;
          border-radius: 28px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .auth-btn:active {
          transform: scale(0.985);
        }

        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .btn-label {
          flex: 1;
          text-align: center;
          padding-right: 40px;
        }

        /* 1. Quick Log In Button */
        .quick-login-btn {
          background: linear-gradient(135deg, #FF4B1F 0%, #FF9F00 100%);
          color: #ffffff;
          box-shadow: 0 6px 24px rgba(255, 75, 31, 0.4);
        }

        .quick-login-btn:hover {
          box-shadow: 0 8px 30px rgba(255, 75, 31, 0.55);
        }

        /* OR Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.14);
        }

        .divider-text {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.08em;
        }

        /* Secondary Row */
        .auth-secondary-row {
          display: flex;
          gap: 10px;
        }

        .auth-secondary-row .auth-btn {
          flex: 1;
          padding: 0 6px;
        }

        .auth-secondary-row .btn-label {
          padding-right: 32px;
          font-size: 14px;
        }

        .google-btn {
          background: #d82d7e;
          color: #ffffff;
          box-shadow: 0 4px 18px rgba(216, 45, 126, 0.35);
        }

        .google-btn:hover {
          box-shadow: 0 6px 24px rgba(216, 45, 126, 0.5);
        }

        .mobile-btn {
          background: #3f51b5;
          color: #ffffff;
          box-shadow: 0 4px 18px rgba(63, 81, 181, 0.35);
        }

        .mobile-btn:hover {
          box-shadow: 0 6px 24px rgba(63, 81, 181, 0.5);
        }

        /* Guest Button */
        .guest-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          height: 48px;
        }

        .guest-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.45);
        }

        .auth-footer-toggle {
          margin-top: 6px;
          text-align: center;
        }

        .toggle-link {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.15s ease;
        }

        .toggle-link:hover {
          color: #ff9f00;
        }

        /* Sub Forms */
        .mobile-auth-sub-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sub-form-header {
          position: relative;
          text-align: center;
          margin-bottom: 6px;
        }

        .back-btn {
          position: absolute;
          left: 0;
          top: 0;
          background: none;
          border: none;
          color: #ff9f00;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .sub-form-header h4 {
          font-size: 17px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #ffffff;
        }

        .sub-form-header p {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }

        .input-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .input-field-group label {
          font-size: 12px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .phone-input-row {
          display: flex;
          gap: 8px;
        }

        .country-select {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          border-radius: 12px;
          padding: 10px 8px;
          font-size: 13px;
          max-width: 140px;
          outline: none;
          cursor: pointer;
        }

        .country-select option {
          background: #181224;
          color: #ffffff;
        }

        .phone-number-input,
        .standard-input {
          flex: 1;
          width: 100%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .phone-number-input:focus,
        .standard-input:focus {
          border-color: #ff9f00;
        }

        .auth-submit-btn {
          width: 100%;
          height: 48px;
          border-radius: 24px;
          border: none;
          background: linear-gradient(135deg, #FF4B1F 0%, #FF9F00 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(255, 75, 31, 0.4);
          transition: all 0.15s ease;
          margin-top: 4px;
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-submit-btn.google-submit {
          background: #d82d7e;
          box-shadow: 0 4px 18px rgba(216, 45, 126, 0.4);
        }

        .mobile-auth-legal-footer {
          margin-top: 18px;
          font-size: 11px;
          color: #64748b;
          text-align: center;
          line-height: 1.5;
        }

        .mobile-auth-legal-footer a {
          color: #94a3b8;
          text-decoration: underline;
        }

        .mobile-auth-legal-footer a:hover {
          color: #ff9f00;
        }
      `}</style>
    </div>
  );
}
