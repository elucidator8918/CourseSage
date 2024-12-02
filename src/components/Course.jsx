import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Course({ key, code }) {
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState(true);
  const [useful, setUseful] = useState(true);
  const [easy, setEasy] = useState(true);
  const [liked, setLiked] = useState(true);

  const [chartData, setChartData] = useState(null);

  const courseOptions = [
    { value: "MATH 135", label: "MATH 135" },
    { value: "ECON 101", label: "ECON 101" },
    { value: "MATH 137", label: "MATH 137" },
    { value: "CS 135", label: "CS 135" },
    { value: "MATH 115", label: "MATH 115" },
    { value: "MATH 136", label: "MATH 136" },
    { value: "ENGL 109", label: "ENGL 109" },
    { value: "STAT 230", label: "STAT 230" },
    { value: "CHE 102", label: "CHE 102" },
    { value: "PD 1", label: "PD 1" },
    { value: "SPCOM 223", label: "SPCOM 223" },
    { value: "MATH 239", label: "MATH 239" },
    { value: "CS 136", label: "CS 136'" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8000/stats",
          {
            code: code,
          },
          {
            headers: {
              "Content-Type": `application/json`,
            },
          }
        );

        const data = response.data;
        setCourseTitle(data.course_title);
        setUseful(data.useful);
        setLiked(data.liked);
        setEasy(data.easy);

        const usefulPercentage = parseFloat(data.useful.replace("%", ""));
        const likedPercentage = parseFloat(data.liked.replace("%", ""));
        const easyPercentage = parseFloat(data.easy.replace("%", ""));

        setChartData({
          labels: ["Useful", "Liked", "Easy"],
          // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
          datasets: [
            {
              data: [easyPercentage, usefulPercentage, likedPercentage],
              // you can set indiviual colors for each bar
              backgroundColor: [
                getColorForBar(easyPercentage),
                getColorForBar(usefulPercentage),
                getColorForBar(likedPercentage),
              ],
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const getColorForBar = (value) => {
    if (value > 75) {
      return "rgba(55, 48, 163, 0.9)"; // Green
    } else if (value >= 40 && value <= 75) {
      return "rgba(99, 102, 241, 0.9)"; // Yellow
    } else {
      return "rgba(165, 180, 252,0.9)"; // Red
    }
  };

  return (
    <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} className="flex justify-center">
      <li className="flex items-center justify-between p-3 rounded-lg bg-indigo-700 mb-1 w-full">
        <div className="flex items-center w-1/2">
          {" "}
          {loading ? (
            <div className="animate-pulse">
              <div className="bg-gray-200 h-4 w-64 mb-2 rounded-md"></div>
              <div className="bg-gray-300 h-4 w-48 rounded-md"></div>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <p className="text-xs md:text-sm font-bold leading-5 text-white">
                {code}
              </p>
              <p className="mt-1 text-[8px] md:text-[10px] leading-5 text-slate-400 overflow-auto">
                {courseTitle}
              </p>
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex flex-col items-end w-1/2 bg-indigo-50 ml-1  rounded-lg">
            <Bar
              data={chartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "User Reviews (%)",
                    color: "black", // Set title text color to white
                  },
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                  x: {
                    ticks: {
                      color: "black", // Set x-axis tick color to white
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </li>
    </Tilt>
  );
}
