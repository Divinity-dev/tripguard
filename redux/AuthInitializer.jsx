"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "./actions/authActions";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return null;
};

export default AuthInitializer;