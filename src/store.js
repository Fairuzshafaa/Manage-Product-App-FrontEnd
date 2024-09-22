import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { productReducer } from "./productReducer";

const reducer = combineReducers({
  products: productReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
