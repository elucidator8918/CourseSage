import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import Navbar from "../components/Navbar";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { InfinitySpin } from "react-loader-spinner";

const videoConstraints = {
  width: 200,
  height: 200,
  facingMode: "user",
  mirrored: "False",
};

const animatedComponents = makeAnimated();

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [edu, setEdu] = useState("");
  const [credits, setCredits] = useState("");
  const [region, setRegion] = useState("");
  const [disability, setDisability] = useState("");
  const [result, setResult] = useState("");
  const [imd, setImd] = useState("");

  const [file, setFile] = useState("");
  const webcamRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChooseGender = (selectedOption) => {
    setGender(selectedOption.value);
  };

  const handleChooseDisability = (selectedOption) => {
    setDisability(selectedOption.value);
  };

  const handleChooseResult = (selectedOption) => {
    setResult(selectedOption.value);
  };

  const handleChooseAge = (selectedOptions) => {
    setAge(selectedOptions.value);
  };

  const handleChooseEdu = (selectedOptions) => {
    setEdu(selectedOptions.value);
  };

  const handleChooseImd = (selectedOptions) => {
    setImd(selectedOptions.value);
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];

  const disabilityOptions = [
    { value: "1", label: "Physically Disabled" },
    { value: "0", label: "Not Physically Disabled" },
  ];

  const imdOptions = [
    { value: "90-100%", label: "90-100%" },
    { value: "80-90%", label: "80-90%" },
    { value: "70-80%", label: "70-80%" },
    { value: "60-70%", label: "60-70%" },
    { value: "50-60%", label: "50-60%" },
    { value: "40-50%", label: "40-50%" },
    { value: "30-40%", label: "30-40%" },
    { value: "20-30%", label: "20-30%" },
    { value: "10-20%", label: "10-20%" },
    { value: "0-10%", label: "0-10%" },
  ];

  const ageOptions = [
    { value: "1", label: "<18" },
    { value: "2", label: "19-29" },
    { value: "3", label: "30-39" },
    { value: "4", label: "40-49" },
    { value: "5", label: "50-59" },
    { value: "6", label: "60-69" },
    { value: "7", label: ">70" },
  ];

  const resultOptions = [
    { value: "2", label: "Outstanding" },
    { value: "1", label: "Average" },
    { value: "0", label: "Pass" },
    { value: "-1", label: "Fail" },
  ];

  const eduOptions = [
    { value: "No Formal quals", label: "No Formal quals" },
    { value: "Lower Than A Level", label: "Lower Than A Level" },
    { value: "A Level or Equivalent'", label: "A Level or Equivalent'" },
    { value: "HE Qualification", label: "HE Qualification" },
    {
      value: "Post Graduate Qualification",
      label: "Post Graduate Qualification",
    },
  ];

  const handleFileChange = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Create a blob from the base64-encoded data
    const blob = await (await fetch(imageSrc)).blob();
    // Create a File object from the blob
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName || !age || !gender) {
      setLoading(false);
      setError("Please fill in all the fields.");
      return;
    }
    try {
      setLoading(true);
      e.preventDefault();
      // console.log({
      //   username: email,
      //   password: password,
      //   first_name: firstName,
      //   last_name: lastName,
      //   age: age,
      //   gender: gender,
      //   highest_edu: edu,
      //   disability: disability,
      //   final_result: result,
      //   region: region,
      //   imd_band: imd,
      // });

      const res = await axios.post("http://127.0.0.1:8000/signup", {
        username: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        age: age,
        gender: gender,
        highest_edu: edu,
        studied_credits: credits,
        disability: disability,
        final_result: result,
        region: region,
        imd_band: imd,
      });

      if (res.status === 200) {
        navigate("/login");
      } else {
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.detail);
      setLoading(false);
    }
  };

  /* const capture = React.useCallback(async() => {
 const imageSrc = webcamRef.current.getScreenshot();
 set(imageSrc);
 // Create a blob from the base64-encoded data
 const blob = await (await fetch(imageSrc)).blob();

 // Create a File object from the blob
const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });



}); */

  //THE CAPTCHA PART
  const key = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  const [captchaIsDone, setCaptchaDone] = useState(false);
  function onChange() {
    //console.log("changed");
    setCaptchaDone(true);
  }

  return (
    <div className="py-20 md:py-10 bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-200">
      <div className="flex flex-col items-center mx-auto justify-center h-screen text-black overflow-y-auto">
        <Navbar />
        <div className="absolute ">
          <div className="text-3xl font-bold mb-4 mt-6 text-gray-900 flex justify-center items-center">
            <Typewriter words={["Signup"]} cursor cursorStyle="_" loop={0} />
          </div>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex  ">
              <div className="flex flex-wrap mb-4 justify-end">
                <div className=" w-11/12 sm:w-11/12 md:w-6/12 m-2">
                  <label
                    htmlFor="first-name"
                    className="flex mb-2 font-bold text-gray-900"
                  >
                    First Name:
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="border border-gray-400 p-2 w-full rounded-lg bg-indigo-200 placeholder-gray-600 text-black"
                    value={firstName}
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label
                    htmlFor="email"
                    className="flex mb-2 font-bold text-gray-900"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border border-gray-400 p-2 w-full rounded-lg bg-indigo-200 placeholder-gray-600 text-black"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Studied Credits
                  </label>
                  <input
                    className="border border-gray-400 p-2 w-full rounded-lg bg-indigo-200 placeholder-gray-600 text-black"
                    value={credits}
                    placeholder="0.0 to 1.0"
                    onChange={(e) => setCredits(e.target.value)}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Age:
                  </label>
                  <Select
                    options={ageOptions}
                    type="age"
                    id="age"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChooseAge}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Disability:
                  </label>
                  <Select
                    options={disabilityOptions}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChooseDisability}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Last Course Result:
                  </label>
                  <Select
                    options={resultOptions}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChooseResult}
                  />
                </div>
              </div>
              <div className="flex flex-wrap mb-4 text-center justify-start">
                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="border border-gray-400 p-2 w-full rounded-lg bg-indigo-200 placeholder-gray-600 text-black"
                    value={lastName}
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12 m-2">
                  <label
                    htmlFor="password"
                    className="flex mb-2 font-bold text-gray-900"
                  >
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="border border-gray-400 p-2 w-full rounded-lg bg-indigo-200 placeholder-gray-600 text-black "
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Region:
                  </label>
                  <input
                    className="border border-gray-400 p-2 w-full rounded-lg bg-indigo-200 placeholder-gray-600 text-black"
                    value={region}
                    placeholder="Region"
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Gender:
                  </label>
                  <Select
                    options={genderOptions}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChooseGender}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Education:
                  </label>
                  <Select
                    options={eduOptions}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChooseEdu}
                  />
                </div>

                <div className="w-11/12 sm:w-11/12 md:w-6/12  m-2">
                  <label className="flex mb-2 font-bold text-gray-900">
                    Imd Band:
                  </label>
                  <Select
                    options={imdOptions}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={handleChooseImd}
                  />
                </div>
              </div>
            </div>
            <div className="home-container flex items-center mx-auto col-md-6">
              <div className="container flex items-center justify-center ">
                <div className="text-gray-900 items-center flex flex-col justify-center">
                  {/*<h1 className="mb-3 text-lg">
                    Please take an image of your face
  </h1>*/}
                  <form className="form">
                    {/*<div className="webcam-container">
                      <div className="webcam-img flex justify-center">
                        {file === "" ? (
                          <Webcam
                            audio={false}
                            height={200}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={220}
                            mirrored="true"
                            videoConstraints={videoConstraints}
                          />
                        ) : (
                          <div>
                            <p className="text-xl font-bold text-gray-900 bg-green-500 p-2 rounded-md opacity-60">
                              Image Captured succesfully
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="justify-center flex items-center">
                        {file !== "" ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setFile("");
                            }}
                            className="webcam-btn btn m-3 text-gray-900 hover:bg-blue-800 bg-blue-600 border-blue-600 p-2 rounded-full"
                          >
                            Retake Image
                          </button>
                        ) : (
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              handleFileChange();
                              // You can do something with the file, if needed
                            }}
                            className="webcam-btn btn m-3  text-gray-900 hover:bg-blue-800 bg-blue-600 border-blue-600 p-2 rounded-md"
                          >
                            Capture
                          </button>
                        )}
                      </div>
                          </div>*/}
                    {/* <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                         <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} /> */}
                  </form>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
              <div className="flex flex-col justify-center items-center mx-auto col-md-6">
                <ReCAPTCHA sitekey={key} onChange={onChange} />
                {error && <p className="my-2 text-red-500">{error}</p>}
              </div>
              {captchaIsDone &&
                (loading ? (
                  <InfinitySpin width="200" color="gray" />
                ) : (
                  <button
                    type="submit"
                    className="bg-indigo-600 text-gray-100 py-2 mt-2 px-4 rounded hover:bg-indigo-800"
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </button>
                ))}
            </div>
          </form>
          <div className="flex justify-center items-center">
            <p className="mt-4 text-gray-900">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                LogIn
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
