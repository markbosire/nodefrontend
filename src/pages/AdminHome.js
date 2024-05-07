import React, { useState, useEffect } from 'react';
import GenreCarousel from '../components/GenreCarousel';
import GameCardContainer from '../components/GameCardContainer';

import NavbarAdmin from '../components/NavbarAdmin';
import axios from 'axios';


function AdminHome() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesResponse, genresResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/game', {
            headers: {
              'x-api-key': apiKey,
            },
          }),
          axios.get('http://localhost:5000/api/genres', {
            headers: {
              'x-api-key': apiKey,
            },
          }),
        ]);

        setGames(gamesResponse.data);
     
        setGenres(genresResponse.data);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, [apiKey]);

  const [randomGamesByGenre, setRandomGamesByGenre] = useState([]); // State for random games by genre
 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sliceValue, setSliceValue] = useState(4); // Default value when window width is above 1200

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 1200 && windowWidth >= 1000) {
      setSliceValue(3);
    } else if (windowWidth < 1000 && windowWidth >= 780) {
      setSliceValue(2);
    } else if (windowWidth < 780) {
      setSliceValue(1);
    } else {
      setSliceValue(4); // Default value when window width is above 1200
    }
  }, [windowWidth]);

  useEffect(() => {
    // Generate random games for each genre
    const randomGames = genres.map((genre) => {
      const gamesForGenre = games.filter((game) => game.genre === genre.genreName);
      const shuffledGames = gamesForGenre.sort(() => 0.5 - Math.random()).slice(0, sliceValue);
      return {
        genre: genre.genreName,
        games: shuffledGames,
      };
    });
    setRandomGamesByGenre(randomGames);
  }, [games, genres, sliceValue]);



  return (
    <div>
     
      <NavbarAdmin games={games}/>
      
      <GenreCarousel/>
      {randomGamesByGenre.map((genreData, index) => (
        <div key={index}>
          <GameCardContainer key={genreData.genre} genre={genreData.genre} side="Admin" games={genreData.games} genreId={index} number={genreData.games.length} />
        </div>
      ))}
    

    </div>
  );
}

export default AdminHome;
