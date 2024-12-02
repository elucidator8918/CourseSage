import React, { useState, useRef, useEffect } from "react";
import { Bars, CirclesWithBar, Audio, Puff, DNA } from "react-loader-spinner";
import { FaMicrophone } from "react-icons/fa";
import { marked } from "marked";

const ChatMessage = ({ type, content }) => {
  const [transcription, setTranscription] = useState("");

  //workaround to double click get route
  const [count, setCount] = useState(0);

  //Falcon 40B response
  const [falcon, setFalcon] = useState(null);
  const [tts, setTts] = useState(null);

  //blob url of reply
  const [audio1, setAudio1] = useState(null);

  //check if reply audio is playing and play loader
  const [isPlaying, setIsPlaying] = useState(false);

  const [clickspeak, setclickspeak] = useState(false);

  //NER Endpoint useState
  const [ner, setNer] = useState([]);

  const [correctedText, setCorrectedText] = useState("");

  const mimeType = "audio/webm";
  const ngrokurl = "https://9789-34-124-187-173.ngrok-free.app";
  //in built api reference
  const mediaRecorder = useRef(null);

  const handleSound = async () => {
    setclickspeak(true);
    console.log(tts);
    try {
      let endpoint;
      endpoint = ngrokurl + "/labs-tts";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("access_token"),
          // Specify JSON content type
        },
        body: JSON.stringify({
          text: tts,
          emotion: "cheerful",
        }),
      });

      if (response.ok) {
        const responseData = await response.blob(); // Get the binary response data
        const audioUrl = URL.createObjectURL(responseData); // Create a URL for the blob
        setAudio1(audioUrl);
      } else {
        alert("Reply Failed");
      }
    } catch (error) {
      console.error("Error during audio request:", error);
      alert("An error occurred while replying to the audio");
    }
    setclickspeak(false);
  };

  // Get Location via NER API CALL
  const handleNER = async () => {
    try {
      const response = await fetch(ngrokurl + "/ner/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
          token: localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
          text: content,
          emotion: "Anger",
        }),
      });

      if (response.ok) {
        const nerData = await response.json();
        setNer(nerData.LOC);
        console.log(content);
        console.log(nerData.LOC);
        const url = `https://www.google.com/maps/dir/${nerData.LOC[0]}+station/${nerData.LOC[1]}+station`;
        //to only open new window when double clicked
        if (true) {
          window.open(url, "_blank", "noreferrer");
          setCount(0);
        } else {
          setCount(count + 1);
          console.log(count);
        }
      } else {
        alert("NER failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error while fetching location");
    }
  };

  const [loading, setLoading] = useState(false); // New loading state

  const falconResponse = async () => {
    try {
      setLoading(true); // Set loading to true when the request starts
      console.log(content);
      const response = await fetch("http://127.0.0.1:8000/gemini/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: content,
        }),
      });
      console.log(response);
      if (response.ok) {
        const falcon_response = await response.json();
        // Convert Falcon response text from Markdown to HTML
        const htmlText = marked(falcon_response.text);
        setFalcon(htmlText);
      } else {
        console.log("model dead");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    // Check if content is available and falcon is not set
    if (content && !falcon) {
      falconResponse();
    }
  }, [content, falcon]);

  return (
    <div className="px-2 no-scrollbar overflow-y-auto">
      <div
        className={`flex flex-row my-2 mr-1 ${
          type === "user" ? "justify-end" : "justify-start"
        } items-center ml-auto`}
      >
        <div
          className={`flex flex-col ${
            type != "user" ? "items-end" : "items-start"
          } w-11/12 md:w-7/12 bg-${
            type === "user" ? "indigo-400" : "gray-300"
          } rounded-lg p-3`}
        >
          <h2 className="text-lg font-semibold">
            <i>{type === "user" ? " You " : " Railway Buddy 🚞 "}</i>
          </h2>
          <p className="text-sm">{content}</p>
        </div>
      </div>

      <div className="flex flex-row justify-start items-center mr-auto pt-2 ml-1">
        <div className="flex flex-col justify-start items-start w-11/12 md:w-7/12 bg-gray-300 rounded-lg p-3">
          <h2 className="text-lg font-semibold">
            <i>CurateSage Chat🤖</i>
          </h2>
          {loading ? (
            <DNA
              visible={true}
              height="50"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          ) : (
            <div
              className=" text-sm"
              dangerouslySetInnerHTML={{ __html: falcon }}
            ></div>
          )}
        </div>

        {audio1 ? (
          <div className="audio-container flex flex-row items-center mt-2 mx-4">
            {isPlaying && (
              <Audio
                height="40"
                width="40"
                color="#009CFF"
                ariaLabel="audio-loading"
                wrapperStyle={{}}
                wrapperClass="wrapper-class"
                visible={true}
              />
            )}
            <audio
              src={audio1}
              controls
              onPlay={() => {
                setIsPlaying(true);
              }}
              onPause={() => {
                setIsPlaying(false);
              }}
              className="mb-2"
            ></audio>
            <a
              download
              href={audio1}
              className="text-cyan-500 hover:text-cyan-700"
            ></a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatMessage;
