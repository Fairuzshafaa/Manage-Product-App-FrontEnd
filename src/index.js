import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import ProductList from "./pages/ProductList";
import "antd/dist/reset.css";

ReactDOM.render(
  <Provider store={store}>
    <ProductList />
  </Provider>,
  document.getElementById("root")
);
