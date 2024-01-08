"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, getDocs } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

import { auth, db } from "../firebase";
import { errors } from "@/constants/error";
import SubmitButton from "@/components/SubmitButton";

const LoginPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // It is to determine whether the authentication state has been initialized and is ready to be used
  const init = async () => {
    await auth.authStateReady();
  };

  useEffect(() => {
    init();
  }, []);

  // // change the stored data according to the name of the changed elements
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // try to sign in
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (isLoading || email === "" || password === "") return;

    try {
      setIsLoading(true);
      // signInWithEmailAndPassword is an API that firebase authentication provides, and users can sign in through this API
      await signInWithEmailAndPassword(auth, email, password);

      // fetching the previously stored user information to check whether there is the user's physical information
      const userInfoQuery = query(collection(db, "user_info"));
      const snapshot = await getDocs(userInfoQuery);

      const userInfo = snapshot.docs.find((doc) => email === doc.data().email);

      // if users already stored their physical information, they can directly go to main page
      if (userInfo) router.push("/home");
      // otherwise, users are redirected to the page where users can upload their physical information
      else router.push("/info");
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorMsg = errors[err.code];
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // if eye icon is clicked, users cna check their entered password
  const onClick = (e: React.MouseEvent) => {
    const targetId = e.currentTarget.id;
    if (targetId === "shown") {
      setIsPasswordShown(false);
    } else {
      setIsPasswordShown(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[url(/images/bg-img.png)] bg-cover bg-center">
      <h1 className="text-white text-5xl md:text-6xl lg:text-8xl absolute top-[6%]">
        SKKU.HEALTH
      </h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col py-8 px-10 rounded-lg backdrop-blur-2xl w-[360px] md:w-[460px] lg:w-[560px]"
      >
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          LOGIN
        </h3>
        <div className="my-6">
          <div className="flex flex-col">
            <label
              className="mr-2 text-base lg:text-lg text-white"
              htmlFor="email"
            >
              Email
            </label>
            <input
              onChange={onChange}
              name="email"
              value={email}
              type="text"
              placeholder="Email"
              required
              className="outline-none h-9 md:h-10 lg:h-12 mb-2 py-1 px-2 text-base lg:text-lg rounded"
            />
          </div>
          <div className="flex flex-col relative">
            <label
              className="mr-2 text-base lg:text-lg text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              onChange={onChange}
              name="password"
              value={password}
              type={isPasswordShown ? "text" : "password"}
              placeholder="Password"
              required
              className="outline-none h-9 md:h-10 lg:h-12 py-1 px-2 text-base lg:text-lg rounded"
            />
            {isPasswordShown ? (
              <FontAwesomeIcon
                onClick={onClick}
                id="shown"
                icon={faEye}
                className="text-gray-400 w-[18px] md:w-[24px] cursor-pointer absolute right-2 md:right-3 lg:right-4 top-[34px] md:top-9 lg:top-11"
              />
            ) : (
              <FontAwesomeIcon
                onClick={onClick}
                id="not-shown"
                icon={faEyeSlash}
                className="text-gray-400 w-[18px] md:w-[24px] cursor-pointer absolute right-2 md:right-3 lg:right-4 top-[34px] md:top-9 lg:top-11"
              />
            )}
          </div>
        </div>
        <SubmitButton
          isLoading={isLoading}
          buttonMsg="Login"
          loadingMsg="Loading"
          buttonStyle={`flex justify-center items-center text-base md:text-xl lg:text-2xl border-2 border-white px-4 py-1 md:py-2 rounded text-white w-[110px] md:w-[120px] lg:w-[140px] mb-2 hover:bg-white/20 transition ${
            isLoading ? "text-slate-400 border-slate-400" : "text-white"
          }`}
          radius="20"
          strokeWidth="8"
        />
        {error ? <p className="text-base text-red-500">{error}</p> : null}
        <div className="flex">
          <p className="text-sm md:text-base text-white mr-2">
            Is it your first time to visit?
          </p>
          <Link
            className="text-sm md:text-base text-blue-700 hover:underline"
            href="../"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
