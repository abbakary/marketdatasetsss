import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import banner1 from "../assets/banner1.png";

/* ===================== Colors ===================== */

const PRIMARY = "#61C5C3";
const SECONDARY = "#F58A24";
const DARK_BG = "#04121D";

/* ===================== Storage ===================== */

const TOKEN_KEY = "dali-token";
const USER_KEY = "dali-user";

export default function LogoutPage({ onLogout }) {
  const navigate = useNavigate();
  const ranRef = useRef(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!ranRef.current) {
      ranRef.current = true;

      onLogout?.();

      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);

        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        window.dispatchEvent(new Event("auth:updated"));
      } catch (error) {
        console.warn("Logout cleanup failed", error);
      }
    }

    const exitTimer = setTimeout(() => {
      setLeaving(true);
    }, 5200);

    const redirectTimer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 6000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, onLogout]);

  return (
    <div
      className="logout-screen"
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${banner1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,18,29,.75), rgba(4,18,29,.95))",
          zIndex: 1,
        }}
      />

      {/* Floating Orbs */}
      <div className="logout-orb logout-orb-1" />
      <div className="logout-orb logout-orb-2" />

      <div
        className={`logout-center ${leaving ? "logout-center-leave" : ""}`}
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="logout-card"
          style={{
            width: "min(560px, 94vw)",
            borderRadius: 24,
            background: "rgba(7, 26, 41, 0.92)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              padding: "34px 26px 28px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {/* Icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <div className="logout-ring">
                <div className="logout-ring-inner">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="logout-check"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
            </div>

            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: "clamp(26px, 4vw, 34px)",
              }}
            >
              Logged Out Successfully
            </h2>

            <p
              style={{
                marginTop: 10,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
              }}
            >
              You have been securely logged out from{" "}
              <span
                style={{
                  color: PRIMARY,
                  fontWeight: 800,
                }}
              >
                DALI Data Portal
              </span>
              .
            </p>

            {/* Progress */}
            <div
              style={{
                marginTop: 28,
                maxWidth: 420,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div className="logout-progress" />
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Redirecting to login…
                <Link
                  to="/login"
                  style={{
                    marginLeft: 6,
                    color: SECONDARY,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  click here
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`,
            }}
          />
        </div>
      </div>

      <style>{`
        .logout-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(12px);
          opacity: .25;
          animation: float 8s ease-in-out infinite;
        }

        .logout-orb-1 {
          width: 280px;
          height: 280px;
          top: -40px;
          left: -60px;
          background: ${PRIMARY};
        }

        .logout-orb-2 {
          width: 220px;
          height: 220px;
          right: -40px;
          bottom: -30px;
          background: ${SECONDARY};
          animation-delay: 1.2s;
        }

        .logout-center {
          opacity: 1;
          transform: scale(1);
          transition: all .5s ease;
        }

        .logout-center-leave {
          opacity: 0;
          transform: scale(.96);
        }

        .logout-ring {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.20), rgba(255,255,255,.04));
          box-shadow:
            0 0 0 8px rgba(97,197,195,0.18),
            0 0 24px rgba(97,197,195,0.45);
          animation: pulse 2.2s ease-in-out infinite;
        }

        .logout-ring-inner {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, ${PRIMARY}, ${SECONDARY});
        }

        .logout-check {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: check .8s ease forwards .2s;
        }

        .logout-progress {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, ${PRIMARY}, ${SECONDARY});
          transform-origin: left;
          animation: progress 3s linear forwards;
        }

        @keyframes check {
          to { stroke-dashoffset: 0; }
        }

        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(18px); }
        }
      `}</style>
    </div>
  );
}
