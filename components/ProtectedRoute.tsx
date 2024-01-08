"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const user = auth.currentUser;

  if (user === null) {
    router.push("/login");
  }

  return children;
};

export default ProtectedRoute;
