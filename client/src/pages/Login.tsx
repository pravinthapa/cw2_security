import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axios from "axios";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/otp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the captcha verification");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_BASE_URL + "/auth/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.status === "MFA_REQUIRED") {
        navigate(from, { replace: true, state: { userId: data?.userId } });
      } else {
        // Successful login without MFA
        navigate("/dashboard");
        localStorage.setItem("user", data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
      // Reset captcha on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "/auth/verify-mfa",
        {
          email: formData.email,
          code: mfaCode,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Successful MFA verification
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Verification failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showMfaInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="card-security max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient">
              Two-Factor Authentication
            </h2>
            <p className="mt-2 text-muted-foreground">
              Enter the verification code from your authenticator app
            </p>
          </div>

          <form onSubmit={handleMfaSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive-light border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <Label htmlFor="mfaCode">Verification Code</Label>
              <Input
                id="mfaCode"
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="form-input text-center text-lg tracking-widest"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-security"
              disabled={isLoading || mfaCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <button
              type="button"
              onClick={() => setShowMfaInput(false)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="card-security max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gradient">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your LifeLockr account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive-light border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-input pl-10"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="form-input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key - replace with your actual site key
              onChange={handleCaptchaChange}
              theme="light"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-security"
            disabled={isLoading || !captchaToken}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
