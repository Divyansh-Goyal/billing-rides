import React, { useEffect } from "react";
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Components/Auth/login";
import Configuration from "./Components/Config";
import Config from "./Components/Config/config";

function App() {
  const authUser = useSelector((state) => state.Login.isLoggedIn)
  console.log(authUser)
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={!authUser ? <Login /> : <Navigate to="/config" replace />}/>
          <Route
          path="/config"
          element={authUser ? <Configuration /> : <Navigate to="/" replace />}
          />
          <Route
          path="/config/:id"
          element={authUser ? <Config /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </React.Fragment>
  );
}


export default App;
