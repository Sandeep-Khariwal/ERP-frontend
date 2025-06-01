"use client";

import { useState } from "react";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login";

export default function page() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <>
      {isLogin ? (
        <Login
          onCreateAccount={() => {
            setIsLogin(false);
          }}
        />
      ) : (
        <Signup
          onClickLogin={() => {
            setIsLogin(true);
          }}
        />
      )}
    </>
  );
}
