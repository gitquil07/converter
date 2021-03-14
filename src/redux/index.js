import converterReducer from "./converter/converterReducer";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";

const store = createStore(converterReducer, applyMiddleware(thunk));

export default store;