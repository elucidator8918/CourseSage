import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Navbar from "../components/Navbar";
import Phone from "../components/Phone";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const animatedComponents = makeAnimated();

export default function PreferencesForm() {
  //   const [stockList, setStockList] = useState([]);
  //   const [watchList, setWatchlist] = useState([]);
  //   const [risk, setRisk] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [studiedCredits, setStudiedCredits] = useState("");
  const [interests, setInterests] = useState("");
  const [forceRerender, setForceRerender] = useState(false); // Way to force the react select component to rerender after API call

  const navigate = useNavigate();

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
        // Check local storage first
        const cachedData = localStorage.getItem("userLists");

        if (cachedData) {
          // If data is in local storage, use it
          const parsedData = JSON.parse(cachedData);
          setCourseList(parsedData.courses_list);
          console.log(parsedData);
          setStudiedCredits(parsedData.studied_credits);
          setInterests(parsedData.interests);
        } else {
          // If not in local storage, make API call
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

          // Update state with API data
          setCourseList(res.data.courses_list);
          setStudiedCredits(res.data.studied_credits);
          setInterests(res.data.interests);
          console.log(res.data);
          //   setWatchlist(res.data.WatchList);
          //   setRisk(res.data.Risk);

          // Update local storage
          localStorage.setItem("userLists", JSON.stringify(res.data));
        }

        // Force rerender
        setForceRerender((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCourseChoose = (selectedOptions) => {
    const selectedCourses = selectedOptions.map((option) => option.value);
    setCourseList(selectedCourses);
    //console.log(selectedStocks);
  };

  //   const handleWatchlistChoose = (selectedOptions) => {
  //     const selectedWatchlist = selectedOptions.map((option) => option.value);
  //     setWatchlist(selectedWatchlist);
  //     //console.log(selectedWatchlist);
  //   };

  //   const handleRiskChoose = (selectedOptions) => {
  //     const selectedRisk = selectedOptions.value;
  //     setRisk(selectedRisk);
  //     //console.log(selectedRisk);
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform the post request to the server with the selected data
    localStorage.removeItem("userLists");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/updatelists",
        {
          courses_list: courseList,
          studied_credits: studiedCredits,
          interests: interests,
        },
        {
          headers: {
            token: `${localStorage.getItem("jwt")}`,
            "Content-Type": `application/json`,
          },
        }
      );
      //console.log(res.data);
      // Handle the response from the server as needed
    } catch (error) {
      console.error(error);
      // Handle error case
    }

    navigate("/dashboard");
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full md:flex-row min-h-screen bg-gradient-to-r from-indigo-100 to-indigo-100 bg-full pb-6">
      <Navbar />
      <div className="overflow-hidden py-12 sm:py-18 w-full">
        <div className="mx-auto w-full px-10 lg:px-14">
          <div className="mx-auto grid max-w-2xl pt-16 grid-cols-1 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:p-12 lg:pt-4">
              <div className="m lg:max-w-lg justify-between text-center flex flex-col">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-2xl pt-10 pb-2">
                  Select Your Courses
                </h1>
                <div className="">
                  <Select
                    key={forceRerender ? "forceRerender" : "normal"} // Change the key to force re-render
                    options={courseOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleCourseChoose}
                    defaultValue={courseList.map((course) => ({
                      value: course,
                      label: course,
                    }))}
                  />
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-2xl pt-10 pb-2">
                  Enter your current studied credits
                </h1>
                <div className="">
                  <input
                    className="border border-gray-400 p-2 w-full text-center rounded-lg bg-indigo-200 placeholder-gray-600 text-black "
                    value={studiedCredits}
                    placeholder="0.0 to 1.0"
                    onChange={(e) => setStudiedCredits(e.target.value)}
                  />
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-2xl pt-10 pb-2">
                  Enter your current interests
                </h1>
                <div className="">
                  <input
                    className="border border-gray-400 p-2 w-full text-center rounded-lg bg-indigo-200 placeholder-gray-600 text-black "
                    value={interests}
                    placeholder="Your interests"
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </div>
                {/* <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-2xl pt-10 pb-2">
                  Select Your Risk Tolerance
                </h1>
                <div className="">
                  <Select
                    key={forceRerender ? "forceRerender" : "normal"}
                    options={riskOptions}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleRiskChoose}
                    defaultValue={{
                      value: risk,
                      label: risk,
                    }}
                  />
                </div> */}
                <button
                  type="submit"
                  className="mt-10 bg-indigo-500 text-white px-10 py-2 rounded hover:bg-indigo-700 "
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            <Phone />
          </div>
        </div>
      </div>
    </div>
  );
}
