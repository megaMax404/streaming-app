import { API_URL } from "../config";
import {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminLogin({ setIsAdmin }) {

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [lockTime, setLockTime] =
    useState(0);

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await fetch(
            `${API_URL}/api/admin/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                password,
              }),
            }
          );

        const data = await res.json();

        if (res.status === 429) {

          setLockTime(300);

          alert(
            "พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 60 วินาที"
          );

          return;
        }

        if (!res.ok) {
          alert(
            "รหัสผ่านไม่ถูกต้อง"
          );
          return;
        }

        sessionStorage.setItem("adminToken", data.token);
        setIsAdmin(true);

        navigate("/9x9adm-panel");
      } catch (err) {
        console.error(err);
        alert("Login failed");
      }
    };

  useEffect(() => {
    if (lockTime <= 0) return;

    const timer =
      setInterval(() => {
        setLockTime((prev) =>
          prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [lockTime]);

  return (
    <div className="admin-login-page">

      <div className="login-bg-circle one"></div>
      <div className="login-bg-circle two"></div>

      <div className="admin-login-card">

        <div className="login-logo">
          🎬
        </div>

        <h1 className="login-title">
          Admin Dashboard
        </h1>

        <p className="login-subtitle">
          เข้าสู่ระบบจัดการเว็บไซต์
        </p>

        <form
          onSubmit={handleLogin}
          className="admin-login-form"
        >

          <div className="password-wrap">
            <input
              disabled={lockTime > 0}
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={lockTime > 0}
          >
            {lockTime > 0
              ? `รอ ${lockTime}s`
              : "🔐 เข้าสู่ระบบ"}
          </button>
        </form>

      </div>
    </div>
  );
}


export default AdminLogin;