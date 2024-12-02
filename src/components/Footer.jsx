import React, { useEffect } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";
import Aos from "aos";
import "aos/dist/aos.css";

export const Footer = () => {
  useEffect(() => {
    Aos.init({
      duration: 500,
      once: false,
      easing: "cubic-bezier(.02,.66,.85,.19)",
      offset: 60,
    });
  }, []);
  return (
    <div
      className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white bottom-0"
      // data-aos="slide-up"
      // data-aos-mirror="true"
    >
      <div className="container mx-auto py-3">
        <div className="flex justify-center items-center">
          <a
            href="https://github.com/Arjun-254"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-6 text-gray-300 hover:text-gray-100 transition duration-300"
          >
            <FaGithub className="w-8 h-8" />
          </a>
          <a
            href="https://www.linkedin.com/in/arjun-shah-389699235/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 mr-6 hover:text-gray-100 transition duration-300"
          >
            <FaLinkedin className="w-8 h-8" />
          </a>
          <a
            href="https://drive.google.com/file/d/1AwSZUSmziBhfy4b_OC9j6az12qHm3_mE/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-6 text-gray-300 hover:text-gray-100 transition duration-300"
          >
            <IoMdPaper className="w-8 h-8" />
          </a>
        </div>
      </div>

      <div className="w-full border-t border-gray-600"></div>

      <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-800 py-3 text-center text-gray-300">
        Thanks for visiting 😊
      </div>
    </div>
  );
};
