import React, { useState, useEffect } from "react";
import Course from "../components/Course";
import Navbar from "../components/Navbar";
// import LineChart from "../components/LineChart";
import { Typewriter } from "react-simple-typewriter";
// import StockCarousel from "../components/StockCarousel";
import News from "../components/News";
import { useNavigate } from "react-router-dom";
// import StockCarousel2 from "../components/StockCarousel2";
import axios from "axios";
import { Footer } from "../components/Footer";
import { Recommendations } from "../components/Recommendations";

export default function Dashboard() {
  const [courseList, setCourseList] = useState(["CS 135"]);
  const navigate = useNavigate();
  // Function to toggle between watchlist and portfolio list

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("userLists");

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          // console.log(parsedData.courses_list);
          setCourseList(parsedData.courses_list);
        } else {
          const res = await axios.post(
            "http://127.0.0.1:8000/getlists",
            {},
            {
              headers: {
                token: `${localStorage.getItem("jwt")}`,
                "Content-Type": `application/json`,
              },
            }
          );
          // console.log(res.courses_list);
          setCourseList(res.data.courses_list);
          localStorage.setItem("userLists", JSON.stringify(res.data));
        }
        // Handle the response from the server as needed
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []);

  return (
    <div className="bg-indigo-200">
      <div className="flex flex-col xl:flex-row  bg-auto overflow-x-hidden my-16 ">
        <Navbar />

        <div className="flex flex-col p-5 items-left min-h-fit xl:max-h-screen mb-0 rounded-lg overflow-y-auto overflow-x-hidden w-full xl:w-1/3 bg-indigo-400 shadow-xl">
          <div className="flex flex-col sm:flex-col xl:flex-row justify-between">
            <p className="mt-2 text-left text-6xl font-extrabold tracking-tight text-white sm:text-3xl">
              My Courses
            </p>
            <button
              className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-1 px-4 mt-4 rounded text-xl animate-bounce"
              onClick={() => {
                navigate("/Chatbot");
              }}
            >
              Go To ChatBot
            </button>
          </div>

          <ul className="mt-4">
            <li>
              {" "}
              {courseList.map((code, index) => (
                <Course key={index} code={code} />
              ))}
            </li>
          </ul>
        </div>

        <div className="flex flex-col mt-0 min-h-max xl:w-2/3 xl:px-1 justify-start items-center ">
          <div></div>

          {/* <div className="flex flex-col xl:flex-row gap-y-6 xl:gap-y-0 w-full xl:w-1/2 items-center justify-center ml-0  "> */}
          <div className="my-2 overflow-y-auto overflow-x-hidden rounded-2xl w-full items-center justify-center">
            <p className="mt-4 text-4xl md:text-4xl font-bold text-indigo-800 no-scrollbar flex items-center text-center justify-center">
              Your Recommendations
            </p>
            <Recommendations />
            {/* </div> */}
          </div>
          {/*
            <div className="flex flex-col mt-4 w-11/12 xl:w-full">
              <p className="mb-2 text-4xl font-extrabold text-white text-center">
                Top Losers
                <span className="text-red-600">
                  <Typewriter words={[""]} cursor cursorStyle="%" loop={0} />
                </span>
              </p>
              <StockCarousel2 color="red" />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row my-4 gap-y-6 xl:gap-y-0 w-11/12 xl:w-full items-center justify-center">
            <LineChart symbol={1} />
            <LineChart symbol={2} />
                </div> */}

          <div className="m-2 ml-2 overflow-y-auto overflow-x-hidden rounded-2xl w-11/12 xl:w-full items-center justify-center">
            <News />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
