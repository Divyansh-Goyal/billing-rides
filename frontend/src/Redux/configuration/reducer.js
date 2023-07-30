import {
    CONFIGURATION,
  } from "./actionType"
  
  const initialState = {
    data: {},
  }
  
  const configuration = (state = initialState, action) => {
    switch (action.type) {
      case CONFIGURATION:
        state = {
          ...state,
          data: action.payload
        }
        break
      default:
        state = { ...state }
        break
    }
    return state
  }
  
  export default configuration
  