import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import image from "./assets/download.jpg";

SwiperCore.use([Autoplay]);
SwiperCore.use([Navigation]);

export default function News() {
  const [articles, setArticles] = useState([
    { title: "News 1", image_url: "", link: "#" },
    { title: "News 2", image_url: "", link: "#" },
    { title: "News 3", image_url: "", link: "#" },
    { title: "News 4", image_url: "", link: "#" },
    { title: "News 5", image_url: "", link: "#" },
  ]);
  const [placeholderImageUrl, setPlaceholderImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(currentDate.getMonth() - 1);

        const formattedCurrentDate = currentDate.toISOString().split("T")[0];
        const formattedLastMonthDate = lastMonthDate
          .toISOString()
          .split("T")[0];

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=UpGrad&from=${formattedLastMonthDate}&to=${formattedCurrentDate}&sortBy=publishedAt&language=en&apiKey=baea8a5de1a74cfc93627e7a4ca3a4d4`
        );
        const data = await response.json();
        console.log(data);
        const sortedArticles = data.articles;

        setArticles(sortedArticles);

        if (sortedArticles.length > 0) {
          setPlaceholderImageUrl(image);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const truncateTitle = (title, wordCount) => {
    const words = title.split(" ");
    if (words.length > wordCount) {
      return `${words.slice(0, wordCount).join(" ")}...`;
    }
    return title;
  };

  return (
    <div className="pb-2">
      <p className="text-2xl md:text-3xl font-extrabold flex justify-center items-left tracking-tight text-indigo-800 bg-clip-text p-2">
        News
      </p>
      <Swiper
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        style={{ width: "100%" }}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
        }}
      >
        {articles.slice(0, 10).map((article) => (
          <SwiperSlide
            key={article.title}
            style={{ width: "305px", height: "17.5rem" }}
          >
            {loading ? (
              <div className="bg-indigo-400 p-3 h-full rounded-lg flex flex-col justify-between overflow-y-auto no-scrollbar animate-pulse">
                <div className="bg-gray-100 h-16 w-full mb-2 rounded-md" />
                <div className="bg-gray-100 h-72 w-full mb-2 rounded-md" />
              </div>
            ) : (
              <div className="bg-indigo-400 p-3 h-full rounded-lg flex flex-col justify-between overflow-y-auto no-scrollbar">
                <div className="flex-grow">
                  <h2
                    className={`text-white text-left text-[16px] md:text-[12px] font-bold mb-4`}
                  >
                    {truncateTitle(article.title, 10)}
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-auto rounded-lg"
                      style={{ aspectRatio: "16/9" }}
                    />
                  ) : (
                    <img
                      src={placeholderImageUrl}
                      alt="Placeholder"
                      className="w-full h-auto rounded-lg"
                      style={{ aspectRatio: "16/9" }}
                    />
                  )}
                </div>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-indigo-800 rounded-lg px-4 py-1 mt-1 block text-center"
                >
                  Read
                </a>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
