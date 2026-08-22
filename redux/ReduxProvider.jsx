"use client";

import { Provider } from "react-redux";

import { store } from "../redux/store";
import AuthInitializer from "./AuthInitializer";

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
};

export default ReduxProvider;