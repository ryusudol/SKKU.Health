"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { query, collection, getDocs, orderBy } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// register basic data to ChartJS object to show graphs to users
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

import { auth, db } from "../firebase";
import Title from "@/components/Title";
import LogoutButton from "@/components/LogoutButton";
import QuoteAndAuthor from "@/components/Quote";

type DataType = { date: string; value: string };

const imgCnt = 22;

const HistoryPage = () => {
  const router = useRouter();

  // data for showing history of the user's physical data
  const [BFPs, setBFPs] = useState<DataType[]>([]);
  const [frequencies, setFrequencies] = useState<DataType[]>([]);
  const [sleeps, setSleeps] = useState<DataType[]>([]);
  const [weights, setWeights] = useState<DataType[]>([]);

  // initialize physical data by fetching the stored data in firebase
  useEffect(() => {
    const init = async () => {
      let bfps: DataType[] = [];
      let frequencies: DataType[] = [];
      let sleeps: DataType[] = [];
      let weights: DataType[] = [];

      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }
      const email = user.email;

      const healthInfoQuery = query(
        collection(db, "health_info"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(healthInfoQuery);

      snapshot.docs.forEach((doc) => {
        const healthInfo = doc.data();
        if (healthInfo.email === email) {
          const newBFP = {
            date: healthInfo.createdAt,
            value: healthInfo.bfp,
          };
          const newFrequency = {
            date: healthInfo.createdAt,
            value: healthInfo.frequency,
          };
          const newSleeps = {
            date: healthInfo.createdAt,
            value: healthInfo.sleep,
          };
          const newWeights = {
            date: healthInfo.createdAt,
            value: healthInfo.weight,
          };

          bfps.push(newBFP);
          frequencies.push(newFrequency);
          sleeps.push(newSleeps);
          weights.push(newWeights);
        }
      });

      setBFPs(bfps);
      setFrequencies(frequencies);
      setSleeps(sleeps);
      setWeights(weights);
    };

    init();
  }, [router]);

  // to generate random background image
  const randomBackgroundImageNumber = Math.floor(Math.random() * imgCnt) + 1;

  // to modify data to fit in 'data' props in <Line/> component
  const bfpData = (data: DataType[]) => {
    return {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: "Body Fat Percentage",
          data: data.map((item) => parseInt(item.value)),
          fill: false,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "#FF6384",
        },
      ],
    };
  };
  const frquenciesData = (data: DataType[]) => {
    return {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: "Body Fat Percentage",
          data: data.map((item) => parseInt(item.value)),
          fill: false,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "#36A2EB",
        },
      ],
    };
  };
  const sleepsData = (data: DataType[]) => {
    return {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: "Body Fat Percentage",
          data: data.map((item) => parseInt(item.value)),
          fill: false,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "#4AC0C0",
        },
      ],
    };
  };
  const weightsData = (data: DataType[]) => {
    return {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: "Body Fat Percentage",
          data: data.map((item) => parseInt(item.value)),
          fill: false,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "#FF9F41",
        },
      ],
    };
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
          <div className="grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-6 gap-y-6 h-[640px] md:h-[800px] lg:h-fit overflow-auto">
            <div className="bg-white rounded-lg w-[280px] h-[180px] md:w-[480px] md:h-[270px] px-4 py-2">
              <h4 className="text-sm lg:text-lg text-[#FF6384] mb-2">
                Body Fat Percentage
              </h4>
              <Line data={bfpData(BFPs)} />
            </div>
            <div className="bg-white rounded-lg w-[280px] h-[180px] md:w-[480px] md:h-[270px] px-4 py-2">
              <h4 className="text-sm lg:text-lg text-[#36A2EB] mb-2">
                Frequency
              </h4>
              <Line data={frquenciesData(frequencies)} />
            </div>
            <div className="bg-white rounded-lg w-[280px] h-[180px] md:w-[480px] md:h-[270px] px-4 py-2">
              <h4 className="text-sm lg:text-lg text-[#4AC0C0] mb-2">
                Sleep per Day
              </h4>
              <Line data={sleepsData(sleeps)} />
            </div>
            <div className="bg-white rounded-lg w-[280px] h-[180px] md:w-[480px] md:h-[270px] px-4 py-2">
              <h4 className="text-sm lg:text-lg text-[#FF9F41] mb-2">Weight</h4>
              <Line data={weightsData(weights)} />
            </div>
          </div>
          <QuoteAndAuthor />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
