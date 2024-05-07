import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./GenreCarousel.css";

const GenreCarousel = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [genres, setGenres] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(4); // State to hold the number of slides to show
  const apiKey = process.env.REACT_APP_API_KEY;
  const left = "<";
  const right = ">";
  const colors = ['#52269a', '#7900fa', '#9a0dfe', '#f8f700', '#641617', '#b70413'];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/genres", {
          headers: {
            "x-api-key": apiKey,
          },
        });
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();

    // Set initial number of slides to show based on window width
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1280) {
        setSlidesToShow(4);
      } else if (window.innerWidth >= 1000) {
        setSlidesToShow(3);
      } else if (window.innerWidth >= 780) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };

    updateSlidesToShow(); // Call initially
    console.log(slidesToShow)

    // Update number of slides to show when window is resized
    window.addEventListener("resize", updateSlidesToShow);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", updateSlidesToShow);
    };
  }, [apiKey]);

  const settings = {
    dots: false,
    arrows: false,
    autoplay: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4, // Use state variable to determine the number of slides to show
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3, // show 2 slides at 768px
            slidesToScroll: 1,
          },
        },
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 2, // show 2 slides at 768px
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 780,
      settings: {
        slidesToShow: 1, // show 1 slide at 480px
        slidesToScroll: 1,
      },
    },
  ],
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div className="container text-center my-3 collection">
      <div className="header-container">
        <h2 className="font-weight-light">Popular Genres</h2>
        <div className="navigationContainer">
          <span className="navigation" onClick={() => goToSlide(currentSlide - 1)}>
            {left}
          </span>
          <span className="navigation" onClick={() => goToSlide(currentSlide + 1)}>
            {right}
          </span>
        </div>
      </div>
      <div className="sliderDiv">
        <Slider {...settings} ref={sliderRef}>
          {genres.map((genre, index) => (
            <div className={`imgWrapper`} style={{width:`${100/slidesToShow}%`}} key={index}>
              <div className="imgContainer">
                <img src={genre.genreImage} alt={genre.genreName} />
              </div>
              <span>{genre.genreName}</span>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default GenreCarousel;
