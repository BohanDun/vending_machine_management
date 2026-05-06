"use client";

import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // 如果你的后端路由是 /auth/register，把下面这行改成：
    // axios.post("http://localhost:8000/auth/register", {...})
    axios
      .post("http://localhost:8000/auth/", {
        username: registerUsername,
        password: registerPassword,
      })
      .then(() => {
        setRegisterUsername("");
        setRegisterPassword("");
        alert("注册成功");
      })
      .catch((err) => {
        const msg =
          (err &&
            err.response &&
            (err.response.data?.detail || err.response.data)) ||
          err.message ||
          "Register failed";
        alert(msg);
        console.error(err);
      });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <h2 className="mt-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="registerUsername" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="registerUsername"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-secondary">Register</button>
      </form>
    </div>
  );
};

export default Login;
