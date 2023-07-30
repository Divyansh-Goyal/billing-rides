import {
    LOGIN_USER,
    LOGOUT_USER,
  } from "./actionType"
  
  const initialState = {
    user: {},
    isLoggedIn: localStorage.getItem('token') ? true: false,
  }
  
  const login = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_USER:
        state = {
          ...state,
          isLoggedIn: true,
          user: action.payload
        }
        break
      case LOGOUT_USER:
        state = { 
            ...state,
            isLoggedIn: false,
            user: {}
        }
        break
      default:
        state = { ...state }
        break
    }
    return state
  }
  
  export default login
  