"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth } from "@/app/firebase";

const LogoutButton = () => {
  const router = useRouter();

  const onLogoutBtnClick = () => {
    signOut(auth);
    router.push("/login");
  };

  return (
    <button
      onClick={onLogoutBtnClick}
      className="text-red-500 absolute top-3 right-5 font-normal hover:font-semibold transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
