// src/components/Login.js
import React, { useState } from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { loginUser, logoutUser } from "../../Redux";
import { store } from "../../Redux/store";
import { Navigate, useNavigate } from "react-router-dom";
import { server_url } from "../../Constant";
import { removeAuthToken, setAuthToken } from "../../Networking";
// Create this action to handle login logic

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    if (username.trim() !== "") {
      console.log("username", username)
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      axios
        .post(
          server_url + "api/token/",
          {
            email: username,
            password: password,
          },
          {
            headers: headers,
          }
        )
        .then((response) => {
          console.log(response.data)
          setAuthToken(response.data.access);
          localStorage.setItem("refresh", response.data.refresh);
          store.dispatch(loginUser({ user: username }));
          navigate("/config");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            removeAuthToken();
          }
          store.dispatch(logoutUser());
        });
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
