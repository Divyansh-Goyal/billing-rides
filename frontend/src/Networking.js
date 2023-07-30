import { logoutUser } from "./Redux";
import { store } from "./Redux/store";
import axios from "axios";
/**
 * @returns JWT token for the user.
 */
export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  /**
   * Sets JWT token to localStorage.
   * @param token 
   */
  export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  /**
   * Removes JWT token from localStorage.
   */
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };
  
  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
  /**
   * Checks the validity of JWT.
   * @returns true/false.
   */
  export function validateToken() {
    try {
      let token = getAuthToken();
      if (!token) {
        return false;
      }
      let parsedToken = parseJwt(token || '');
      let exp = Math.round(parsedToken['exp'] / 60);
      let minutes = Math.round(new Date().getTime() / (60 * 1000));
      return !(minutes + 10 >= exp);
    } catch (err) {
      return false;
    }
  }

  /**
   * Make api call calls.
   * @returns data or false.
   */
  export async function makeApiCalls(req) {
    try {
      let token = getAuthToken();
      if(!token){
        store.dispatch(logoutUser())
        return false;
      }
      const isTokenValid = validateToken();
      if (token && !isTokenValid) {
        await refreshToken();
      }
      req.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + getAuthToken(),
      };
      const data = await axios(req)
      return data
    } catch (err) {
      return false;
    }
  }

  /**
 * Refresh JWT token if token is expired
 */
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('refresh');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    };
    axios
      .post(
        
          '/auth/refresh',
        {},
        {
          headers: headers,
        }
      )
      .then((response) => {
        setAuthToken(response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
      })
      .catch((err) => {
        if(err.response.status === 401){
          removeAuthToken();
        }
        store.dispatch(logoutUser())
      });
  } catch (err) {
    store.dispatch(logoutUser())
    console.log(err);
  }
};


