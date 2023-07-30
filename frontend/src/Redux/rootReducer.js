import { combineReducers } from "redux"
import Login from "./auth/reducer"
import Configuration from "./configuration/reducer"
const rootReducer = combineReducers({
  Login,
  Configuration
})
export default rootReducer
