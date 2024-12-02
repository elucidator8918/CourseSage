import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import CourseRec from "./CourseRec";

export const Recommendations = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    arrows: false,
  };
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (true) {
          const res = await axios.post(
            "http://127.0.0.1:8000/recommend",
            {},
            {
              headers: {
                token: `${localStorage.getItem("jwt")}`,
                "Content-Type": `application/json`,
              },
            }
          );

          setRecommendations(res.data.recommendations);
          //console.log(res.data.recommendations);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-11/12 lg:w-full mx-auto rounded-md ">
      {loading ? (
        <div>
          <li className="flex items-center justify-between p-2 m-2 rounded-lg bg-indigo-700 w-full h-96 max-h-96 overflow-y-auto no-scrollbar">
            <div className="flex flex-col w-full mr-3 no-scrollbar animate-pulse">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row items-center">
                  <div className="flex flex-col items-start no-scrollbar">
                    <div className="">
                      <div className="bg-gray-200 h-8 w-32 mb-2 rounded-md"></div>
                      <div className="bg-gray-300 h-7 w-52  rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end w-1/2 bg-gray-50 ml-1 h-48 rounded-lg"></div>
              </div>
              <p className="text-sm md:text-2xl font-bold text-white no-scrollbar"></p>
              <div className="flex flex-col mt-6 bg-gray-200 w-full h-8 rounded-lg"></div>
              <div className="flex flex-col mt-3 bg-gray-300 w-11/12 h-8 rounded-lg"></div>
            </div>
          </li>
        </div>
      ) : (
        <Slider {...settings}>
          {recommendations.map((code, index) => (
            <CourseRec key={index} code={code} />
          ))}
        </Slider>
      )}
    </div>
  );
};
