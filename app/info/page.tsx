"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";

import { auth, db } from "../firebase";
import Title from "@/components/Title";
import LogoutButton from "@/components/LogoutButton";
import SubmitButton from "@/components/SubmitButton";

// when users don't enter the body fat percentage, then the default value 20 is stored
const defaultBFP = 20;

const PersonalInfoPage = () => {
  const router = useRouter();

  // data for uploading users' physical information
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [bfp, setBFP] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  // store data according to the names of changed elements
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "gender") setGender(value);
    else if (name === "birthday") setBirthday(value);
    else if (name === "height") setHeight(parseFloat(value));
    else if (name === "weight") setWeight(parseFloat(value));
    else if (name === "bfp") setBFP(parseFloat(value));
  };

  // upload users' physical information
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (
      !user ||
      isLoading ||
      gender === "" ||
      birthday === "" ||
      !height ||
      !weight
    )
      return;

    try {
      setIsLoading(true);
      // through addDoc API, the system can store users' physical information to firebase storage
      await addDoc(collection(db, "user_info"), {
        email: user.email,
        gender,
        birthday,
        height,
        weight,
        bfp: bfp || defaultBFP,
        createdAt: Date.now(),
      });
      router.push("/home");
    } catch (err) {
      console.log(err);
      alert("Something went wrong while saving your profile information . . .");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-cover bg-center z-0 bg-[url(/images/bg-img.png)]">
      <div className="w-full h-full bg-slate-700/80 z-10">
        <div className="w-full h-full flex flex-col justify-center items-center z-50">
          <Title />
          <LogoutButton />
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center text-white bg-slate-400/40 rounded-lg py-8 px-10"
          >
            <h4 className="mb-8 text-4xl">My Info.</h4>
            <div className="flex flex-col justify-center items-end">
              <div className="mb-3 flex justify-center items-center w-full">
                <label className="mr-2" htmlFor="male">
                  Male
                </label>
                <input
                  onChange={onChange}
                  type="radio"
                  name="gender"
                  id="male"
                  value="male"
                  required
                  className="mr-8"
                />
                <label className="mr-2" htmlFor="female">
                  Female
                </label>
                <input
                  onChange={onChange}
                  type="radio"
                  name="gender"
                  id="female"
                  value="female"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="mr-3" htmlFor="birthday">
                  Birthday<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  onChange={onChange}
                  type="date"
                  name="birthday"
                  id="birthday"
                  min="1920-01-01"
                  max="2023-12-31"
                  required
                  className="text-black px-3 py-2 rounded outline-none text-base w-[140px] md:w-[200px]"
                />
              </div>
              <div className="mb-3">
                <label className="mr-3" htmlFor="height">
                  Height(cm)<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  onChange={onChange}
                  type="text"
                  name="height"
                  id="height"
                  placeholder="Height"
                  required
                  className="text-black px-3 py-2 rounded outline-none text-base w-[140px] md:w-[200px]"
                />
              </div>
              <div className="mb-3">
                <label className="mr-3" htmlFor="weight">
                  Weight(kg)<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  onChange={onChange}
                  type="text"
                  name="weight"
                  id="weight"
                  placeholder="Weight"
                  required
                  className="text-black px-3 py-2 rounded outline-none text-base w-[140px] md:w-[200px]"
                />
              </div>
              <div className="mb-3">
                <label className="mr-3" htmlFor="bfp">
                  Body Fat Percentage(%)
                </label>
                <input
                  onChange={onChange}
                  type="text"
                  name="bfp"
                  id="bfp"
                  placeholder="BFP"
                  className="text-black px-3 py-2 rounded outline-none text-base w-[140px] md:w-[200px]"
                />
              </div>
            </div>
            <SubmitButton
              isLoading={isLoading}
              buttonMsg="Save my info"
              loadingMsg="Saving"
              buttonStyle="flex justify-center items-center border-2 border-white rounded px-4 py-2 mt-6 hover:bg-white/20 transition"
              radius="16"
              strokeWidth="5"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
