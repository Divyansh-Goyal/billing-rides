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

const Logout = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    store.dispatch(logoutUser())
    removeAuthToken();
  };
  return (
    <div>
      <button onClick={handleLogin}>Logout</button>
    </div>
  );
};

export default Logout;
