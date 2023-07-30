import {
    CONFIGURATION,
  } from "./actionType"
  
  export const configuration = (data) => {
    return {
      type: CONFIGURATION,
      payload: data,
    }
  }
  
  

  