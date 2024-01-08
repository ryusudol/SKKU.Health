"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Title = () => {
  const router = useRouter();

  const onClick = () => {
    router.push("/home");
  };

  return (
    <h1
      onClick={onClick}
      className="text-white text-5xl md:text-6xl lg:text-8xl absolute top-[3%] cursor-pointer"
    >
      SKKU.HEALTH
    </h1>
  );
};

export default Title;
