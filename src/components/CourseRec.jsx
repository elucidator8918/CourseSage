import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function CourseRec({ key, code }) {
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState(true);
  const [useful, setUseful] = useState(true);
  const [easy, setEasy] = useState(true);
  const [liked, setLiked] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [chartData, setChartData] = useState(null);

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
        setReviews(data.reviews);

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
    <div className="flex justify-center ">
      {/* {loading ? <div className=""></div> : <div>loadingggg!!</div>} */}
      {loading && <div className="text-black text-">loading</div>}
      <li className="flex items-center justify-between p-5 m-2 rounded-lg bg-indigo-700 mb-1 w-full h-96 max-h-96 overflow-y-auto no-scrollbar">
        <div className="flex flex-col w-full mt-10 no-scrollbar">
          <div className="flex flex-row justify-between  w-full">
            <div className="flex flex-row items-center">
              {" "}
              {loading ? (
                <div className="animate-pulse">
                  <div className="bg-gray-400 h-4 w-64 mb-2 rounded-md"></div>
                  <div className="bg-gray-500 h-4 w-48 rounded-md"></div>
                </div>
              ) : (
                <div className="flex flex-col items-start no-scrollbar">
                  <p className="text-sm md:text-2xl font-bold leading-5 text-white no-scrollbar">
                    {code}
                  </p>
                  <p className="mt-1 text-xs md:text-xl leading-5 text-slate-100 overflow-auto no-scrollbar">
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
          </div>
          <p className="text-sm md:text-2xl font-bold leading-5 text-white no-scrollbar">
            Reviews:
          </p>

          <div className="flex flex-col">
            {" "}
            {reviews.map((review) => {
              return (
                <div className="text-white">
                  <span>&rarr;</span> {review}
                </div>
              ); // You can render each review here
            })}
          </div>
        </div>
      </li>
    </div>
  );
}
