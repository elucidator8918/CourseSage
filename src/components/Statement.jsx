import React from "react";
import Threemodel from "./Threemodel";

export default function Statement() {
  const token = localStorage.getItem("jwt");
  return (
    <div className="overflow-hidden py-12 sm:py-18">
      <div className="mx-auto max-w-7xl px-10 lg:px-14">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pl-12 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="md:text-xl text-lg font-bold leading-7 mt-6 text-black text-center">
                Course Insights
              </h2>
              <p className="mt-2 p-3 text-4xl sm:text-4xl md:text-6xl font-bold flex justify-center items-left tracking-tight bg-gradient-to-r from-blue-500 to-purple-800 bg-clip-text text-transparent ">
                CurateSage
              </p>
              <p className="mt-5 text-md sm:text-md md:text-2xl text-black text-center font-light">
                Our AI-driven platform curates personalized courses,
                prioritizing security, clarity, and accessibility for students
                to navigate their academic journey confidently.
              </p>
              <div className="flex items-center justify-center ">
                {!token && (
                  <a
                    href="/signup"
                    className="mt-5 rounded-md border border-transparent bg-indigo-600 py-3 px-6 font-medium text-white hover:bg-blue-700"
                  >
                    Get Recommendations <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
                {token && (
                  <a
                    href="/dashboard"
                    className="mt-5 rounded-md border border-transparent bg-indigo-600 py-3 px-6 font-medium text-white hover:bg-blue-700"
                  >
                    Dashboard <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-0 lg:mt-20">
            <Threemodel />
          </div>
        </div>
      </div>
    </div>
  );
}
