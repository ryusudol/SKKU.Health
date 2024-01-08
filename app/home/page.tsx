"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { auth } from "../firebase";
import LogoutButton from "@/components/LogoutButton";
import Title from "@/components/Title";
import QuoteAndAuthor from "@/components/Quote";

const imgCnt = 22;

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;

    // when there is no user signed in, then it directs to login page
    if (user === null) {
      router.push("../login");
    }
  }, [router]);

  // to randomly select the background image
  const randomBackgroundImageNumber = Math.floor(Math.random() * imgCnt) + 1;

  // users can move on to the next page according to the button users clicked
  const onBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget.id;
    if (target === "consult") router.push("../consult");
    else if (target === "history") router.push("../history");
  };

  return (
    <div
      style={{
        backgroundImage: `url(/images/${randomBackgroundImageNumber}.jpg)`,
      }}
      className="w-full h-full bg-cover bg-center z-0"
    >
      <div className="w-full h-full bg-slate-700/80 z-10">
        <div className="w-full h-full flex flex-col justify-center items-center z-50">
          <Title />
          <LogoutButton />
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <div
              onClick={onBtnClick}
              id="consult"
              className="bg-gradient-to-t from-[#2A2A3D] to-[#B79BD1]/50 hover:bg-[#26253C] text-white p-8 m-4 rounded-lg w-[360px] md:w-[420px] cursor-pointer h-[240px] md:h-[340px] lg:h-[600px] flex md:flex-row lg:flex-col md:justify-center lg:justify-between md:items-center lg:items-start transition hover:shadow-[0px_1px_60px_1px_#B79BD1]"
            >
              <Image
                src="/images/consult.png"
                width={300}
                height={300}
                alt="consult img"
                className="w-[200px] md:w-[240px] lg:w-[340px] transition"
              />
              <span className="font-bold md:text-2xl lg:text-3xl mb-4 md:ml-6 justify-center">
                Consult.
              </span>
            </div>
            <div
              onClick={onBtnClick}
              id="history"
              className="bg-gradient-to-t from-[#2A2A3D] to-[#DED0A5]/50 hover:bg-[#26253C] text-white p-8 m-4 rounded-lg w-[360px] md:w-[420px] cursor-pointer h-[240px] md:h-[340px] lg:h-[600px] flex md:flex-row lg:flex-col md:justify-center lg:justify-between md:items-center lg:items-start transition hover:shadow-[0px_1px_60px_1px_#DED0A5]"
            >
              <Image
                src="/images/history.png"
                width={300}
                height={300}
                alt="history img"
                className="w-[200px] md:w-[260px] lg:w-[340px] mt-10"
              />
              <span className="font-bold md:text-2xl lg:text-3xl mb-4 md:ml-6 justify-center">
                History.
              </span>
            </div>
          </div>
          <QuoteAndAuthor />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
