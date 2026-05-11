import { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.length > 0 && password.length > 0 && !loading;
  }, [email, password, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/login", {
        email,
        password,
      });

      // save token
      localStorage.setItem("token", res.data.token);

      // save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err: any) {
      console.log(err.response);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__bg" aria-hidden="true" />

      <main className="login__wrap">
        <section className="login__hero" aria-label="Welcome">
          <div className="login__badge">Microfinance Platform</div>
          <h1 className="login__title">Karibu tena</h1>
          <p className="login__subtitle">
            Ingia kwenye mfumo ili uendelee na usimamizi wa mikopo na taarifa za
            wanachama.
          </p>

          <div className="login__mini">
            <div className="login__miniItem">
              <div className="login__miniDot" aria-hidden="true" />
              <span>Salama na rahisi kutumia</span>
            </div>
            <div className="login__miniItem">
              <div className="login__miniDot" aria-hidden="true" />
              <span>Ufuatiliaji wa malipo kwa haraka</span>
            </div>
          </div>
        </section>

        <section className="login__panel" aria-label="Login form">
          <form onSubmit={handleLogin} className="login__form">
            <div className="login__panelHeader">
              <div>
                <div className="login__panelTitle">Login</div>
                <div className="login__panelHint">
                  Tumia barua pepe na nenosiri.
                </div>
              </div>
              <Link to="/" className="login__back">
                Home
              </Link>
            </div>

            {error && (
              <div className="login__alert" role="alert">
                {error}
              </div>
            )}

            <label className="login__field">
              <span className="login__label">Email</span>
              <input
                className="login__input"
                type="email"
                placeholder="mfano: user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="login__field">
              <span className="login__label">Password</span>
              <div className="login__passwordRow">
                <input
                  className="login__input login__input--password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Weka nenosiri"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button className="login__btn" disabled={!canSubmit}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="login__footerText">
              Huna akaunti?{" "}
              <Link to="/register" className="login__link">
                Register
              </Link>
            </div>
          </form>
        </section>
      </main>

      <style>{`
        .login {
          min-height: 100vh;
          color: #e5e7eb;
          position: relative;
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          background: radial-gradient(1200px 700px at 10% 10%, #1d4ed8 0%, rgba(29, 78, 216, 0) 55%),
            radial-gradient(900px 600px at 80% 20%, #10b981 0%, rgba(16, 185, 129, 0) 55%),
            radial-gradient(1000px 700px at 60% 110%, #7c3aed 0%, rgba(124, 58, 237, 0) 55%),
            linear-gradient(180deg, #0b1220 0%, #050816 100%);
        }

        .login__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, rgba(255,255,255,0) 0);
          background-size: 22px 22px;
          mask-image: radial-gradient(closest-side, rgba(0,0,0,1), rgba(0,0,0,0));
          -webkit-mask-image: radial-gradient(closest-side, rgba(0,0,0,1), rgba(0,0,0,0));
          transform: translateY(-8%) scale(1.05);
        }

        .login__wrap {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: center;
          padding: 48px 20px;
          max-width: 1080px;
          margin: 0 auto;
        }

        .login__hero {
          padding: 10px 0;
        }

        .login__badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(229,231,235,0.92);
        }

        .login__title {
          margin: 14px 0 10px;
          font-size: clamp(32px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-shadow: 0 12px 40px rgba(0,0,0,0.55);
        }

        .login__subtitle {
          margin: 0 0 18px;
          max-width: 56ch;
          font-size: 15px;
          line-height: 1.65;
          color: rgba(229,231,235,0.86);
        }

        .login__mini {
          display: grid;
          gap: 10px;
          margin-top: 16px;
          max-width: 520px;
        }

        .login__miniItem {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: rgba(229,231,235,0.85);
          box-shadow: 0 18px 50px rgba(0,0,0,0.25);
        }

        .login__miniDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(180deg, #60a5fa, #34d399);
          box-shadow: 0 0 0 4px rgba(96,165,250,0.18);
          flex: none;
        }

        .login__panel {
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 28px 80px rgba(0,0,0,0.45);
          padding: 22px;
        }

        .login__form {
          display: grid;
          gap: 12px;
        }

        .login__panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 2px;
        }

        .login__panelTitle {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .login__panelHint {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(229,231,235,0.8);
          line-height: 1.5;
        }

        .login__back {
          font-size: 13px;
          text-decoration: none;
          color: rgba(229,231,235,0.85);
          border: 1px solid rgba(255,255,255,0.16);
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          transition: transform 160ms ease, filter 160ms ease;
        }

        .login__back:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .login__alert {
          padding: 10px 12px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.35;
          color: rgba(254,243,199,0.95);
          border: 1px solid rgba(245,158,11,0.25);
          background: rgba(245,158,11,0.08);
        }

        .login__field {
          display: grid;
          gap: 8px;
        }

        .login__label {
          font-size: 13px;
          color: rgba(229,231,235,0.85);
          font-weight: 700;
        }

        .login__input {
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(2,6,23,0.35);
          color: rgba(255,255,255,0.92);
          padding: 0 12px;
          outline: none;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }

        .login__input::placeholder {
          color: rgba(229,231,235,0.55);
        }

        .login__input:focus {
          border-color: rgba(96,165,250,0.55);
          box-shadow: 0 0 0 4px rgba(96,165,250,0.16);
        }

        .login__passwordRow {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: center;
        }

        .login__input--password {
          width: 100%;
        }

        .login__toggle {
          height: 44px;
          padding: 0 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.9);
          cursor: pointer;
          font-weight: 800;
          letter-spacing: 0.01em;
          transition: transform 160ms ease, filter 160ms ease;
        }

        .login__toggle:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .login__btn {
          height: 44px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-weight: 900;
          letter-spacing: 0.01em;
          color: #0b1220;
          background: linear-gradient(90deg, #60a5fa, #34d399);
          box-shadow: 0 14px 40px rgba(52,211,153,0.18);
          transition: transform 160ms ease, filter 160ms ease;
          margin-top: 4px;
        }

        .login__btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.02);
        }

        .login__btn:active {
          transform: translateY(1px) scale(0.99);
        }

        .login__btn:disabled {
          cursor: not-allowed;
          opacity: 0.75;
          filter: grayscale(0.1);
          transform: none;
        }

        .login__footerText {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(229,231,235,0.75);
          line-height: 1.5;
        }

        .login__link {
          color: rgba(255,255,255,0.92);
          text-decoration: none;
          font-weight: 900;
          border-bottom: 1px solid rgba(255,255,255,0.28);
        }

        .login__link:hover {
          border-bottom-color: rgba(255,255,255,0.5);
        }

        @media (max-width: 900px) {
          .login__wrap {
            grid-template-columns: 1fr;
            padding: 34px 16px;
          }
          .login__panel {
            padding: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login__btn,
          .login__btn:hover,
          .login__btn:active,
          .login__back,
          .login__back:hover,
          .login__toggle,
          .login__toggle:hover {
            transition: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;