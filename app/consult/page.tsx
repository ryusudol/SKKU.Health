"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

import { auth, db } from "../firebase";
import LogoutButton from "@/components/LogoutButton";
import SubmitButton from "@/components/SubmitButton";
import QuoteAndAuthor from "@/components/Quote";
import Title from "@/components/Title";

const HomePage = () => {
  const router = useRouter();

  // data for forwarding the user's health data entered
  const [isMale, setIsMale] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [bfp, setBFP] = useState("15~20");
  const [sleep, setSleep] = useState("6~7");
  const [exercise, setExercise] = useState("Nothing");
  const [frequency, setFrequency] = useState("0");
  const [purpose, setPurpose] = useState("");
  // data for operating the web page
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  // to fill the basic health information with the physical information previously entered by the user
  useEffect(() => {
    const userInfoFetch = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userInfoQuery = query(collection(db, "user_info"));
      const snapshot = await getDocs(userInfoQuery);
      const userInfoDoc = snapshot.docs.find(
        (doc) => doc.data().email === user.email
      );

      // if there is no users' physical information, then it directs users to the info page where they can upload their physical information
      if (!userInfoDoc) {
        router.push("/info");
        return;
      }

      const userInfo = userInfoDoc.data();
      if (userInfo.gender === "male") {
        setIsMale(true);
      } else if (userInfo.gender === "female") {
        setIsMale(false);
      }
      setBirthday(userInfo.birthday);
      setAge(new Date().getFullYear() - parseInt(birthday.split("-")[0]));
      setHeight(userInfo.height);
      setWeight(userInfo.weight);
    };

    const user = auth.currentUser;
    if (!user) {
      router.push("../login");
    }
    userInfoFetch();
  }, [router, birthday]);

  // store data according to the changed elements
  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = e;

    if (name === "age") setAge(parseInt(value));
    else if (name === "height") setHeight(parseFloat(value));
    else if (name === "weight") setWeight(parseFloat(value));
    else if (name === "purpose") setPurpose(value);
  };

  // store data according to the changed elements
  const onChangeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "sleep") setSleep(value);
    else if (name === "bfp") setBFP(value);
    else if (name === "exercise") setExercise(value);
    else if (name === "frequency") setFrequency(value);
  };

  // change the date data to 'yyyy-mm-dd' format
  const formatDate = (dateString: string) => {
    const timestamp = parseInt(dateString, 10); // Convert back to number
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ask chatGPT for health advice
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      return;
    }

    // when only white spaces are entered, the function returns
    if (purpose.trim() === "") {
      alert("Please fill out the Workout Purpose.");
      return;
    }

    const healthData = {
      createdAt: formatDate(Date.now().toString()),
      email: user.email,
      gender: isMale ? "male" : "female",
      age,
      height,
      weight,
      bfp,
      sleep,
      exercise,
      frequency,
      purpose,
    };

    try {
      setIsLoading(true);
      // ask chatGPT for health advice using fetch API
      const res = await fetch("/consult/api/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(healthData),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      alert("Some thing went wrong while getting an advice from chatGPT.");
    } finally {
      setIsLoading(false);
    }

    try {
      await addDoc(collection(db, "health_info"), healthData);
    } catch (err) {
      alert(
        "Something went wrong while adding the information you entered. Please try again."
      );
      return;
    }
  };

  const onAgainBtnClick = () => {
    setResponse("");
  };

  const onHomeBtnClick = () => {
    router.push("/home");
  };

  return (
    <div className="w-full h-full bg-[url(/images/consult-bg.png)] bg-cover bg-center">
      <div className="w-full h-full bg-slate-700/70 z-10">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Title />
          <LogoutButton />
          {response === "" ? (
            <div>
              <form
                onSubmit={onSubmit}
                className="overflow-y-auto h-[600px] md:h-[720px] w-[360px] md:w-[580px] flex flex-col justify-start md:justify-center items-center text-white rounded-lg py-8 px-10 backdrop-blur-xl bg-black/60 md:mt-8"
              >
                <h4 className="mb-4 md:mb-8 text-3xl md:text-4xl">
                  Health Info.
                </h4>
                <div className="flex flex-col justify-center items-end">
                  <div className="mb-3 flex justify-center items-center w-full">
                    <label className="mr-2" htmlFor="gender">
                      Male
                    </label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="mr-8"
                      checked={isMale}
                      required
                      readOnly
                    />
                    <label className="mr-2" htmlFor="gender">
                      Female
                    </label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={!isMale}
                      required
                      readOnly
                    />
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="age">
                      Age
                    </label>
                    <input
                      onChange={onChangeInput}
                      name="age"
                      type="number"
                      id="age"
                      required
                      placeholder="Age"
                      value={age}
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    />
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="height">
                      Height(cm)
                    </label>
                    <input
                      onChange={onChangeInput}
                      name="height"
                      type="number"
                      id="height"
                      required
                      placeholder="Height"
                      value={height}
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    />
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="weight">
                      Weight(kg)
                    </label>
                    <input
                      onChange={onChangeInput}
                      name="weight"
                      type="number"
                      id="weight"
                      required
                      placeholder="Weight"
                      value={weight}
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    />
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="bfp">
                      Body Fat(%)
                    </label>
                    <select
                      onChange={onChangeSelection}
                      name="bfp"
                      id="bfp"
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    >
                      <option value="0~5">0~5</option>
                      <option value="5~10">5~10</option>
                      <option value="10~15">10~15</option>
                      <option value="15~20" selected={isMale}>
                        15~20
                      </option>
                      <option value="20~25" selected={!isMale}>
                        20~25
                      </option>
                      <option value="25~30">25~30</option>
                      <option value="Higher than 30">Higher than 30</option>
                    </select>
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="sleep">
                      Sleep(hrs/day)
                    </label>
                    <select
                      onChange={onChangeSelection}
                      name="sleep"
                      id="sleep"
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    >
                      <option value="less than 4hrs">less than 4hrs</option>
                      <option value="4~5">4~5</option>
                      <option value="5~6">5~6</option>
                      <option value="6~7" selected>
                        6~7
                      </option>
                      <option value="7~8">7~8</option>
                      <option value="more than 8hrs">more than 8hrs</option>
                    </select>
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="exercise">
                      Main Exercise
                    </label>
                    <select
                      onChange={onChangeSelection}
                      name="exercise"
                      id="exercise"
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    >
                      <option value="nothing">Nothing</option>
                      <option value="weight training">Weight Training</option>
                      <option value="crossfit">Crossfit</option>
                      <option value="swimming">Swimming</option>
                      <option value="running">Running</option>
                      <option value="boxing">Boxing</option>
                      <option value="martial arts">Martial Arts</option>
                      <option value="badminton">Badminton</option>
                      <option value="ping-pong">Ping-Pong</option>
                      <option value="jogging">Jogging</option>
                      <option value="yoga">Yoga</option>
                      <option value="pilates">Pilates</option>
                      <option value="etc.">etc.</option>
                    </select>
                  </div>
                  <div className="mb-5 md:mb-4 flex flex-col justify-center items-start md:flex-row md:items-center">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="frequency">
                      Frequency/week
                    </label>
                    <select
                      onChange={onChangeSelection}
                      name="frequency"
                      id="frequency"
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    >
                      <option value="0">0</option>
                      <option value="1~2">1~2</option>
                      <option value="2~3">2~3</option>
                      <option value="3~4">3~4</option>
                      <option value="4~5">4~5</option>
                      <option value="5~6">5~6</option>
                      <option value="7">Everyday</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-center items-start md:flex-row md:items-center mb-3">
                    <label className="mr-3 mb-1 md:mb-0" htmlFor="purpose">
                      Workout Purpose
                    </label>
                    <textarea
                      onChange={onChangeInput}
                      name="purpose"
                      id="purpose"
                      cols={20}
                      rows={3}
                      value={purpose}
                      placeholder="Workout Purpose"
                      required
                      className="w-[280px] md:w-[320px] text-black px-3 py-2 rounded outline-none text-base"
                    ></textarea>
                  </div>
                </div>
                <SubmitButton
                  isLoading={isLoading}
                  buttonMsg="Give me an advice"
                  loadingMsg="Asking"
                  buttonStyle={`flex justify-center items-center text-lg border-2 border-white px-4 py-2 rounded text-white w-[190px] mt-4 md:mt-6 hover:bg-white/20 transition ${
                    isLoading ? "text-slate-400 border-slate-400" : "text-white"
                  }`}
                  radius="16"
                  strokeWidth="5"
                />
              </form>
            </div>
          ) : (
            <div className="overflow-y-auto h-[600px] md:h-[720px] w-[360px] md:w-[580px] flex flex-col justify-start items-center text-white rounded-lg py-8 px-10 backdrop-blur-xl bg-black/60 md:mt-8">
              <div className="flex justify-center items-center mb-4 md:mb-8 mt-4 md:mt-6">
                <button
                  onClick={onAgainBtnClick}
                  className={`flex justify-center items-center text-lg underline text-slate-400 px-4 py-2 rounded w-[100px] hover:bg-white/20 hover:text-white transition`}
                >
                  Again
                </button>
                <h4 className="mx-8 text-3xl md:text-4xl">Health Advice.</h4>
                <button
                  onClick={onHomeBtnClick}
                  className={`flex justify-center items-center text-lg underline text-slate-400 px-4 py-2 rounded w-[100px] hover:bg-white/20 hover:text-white transition`}
                >
                  Home
                </button>
              </div>
              <p className="text-lg">{response}</p>
            </div>
          )}
          <QuoteAndAuthor />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
