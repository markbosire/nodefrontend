import React, { useState, useEffect } from 'react';
import UserNavbar from '../components/userNavbar';
import axios from 'axios';
import GameCarousel from '../components/GameCarousel';
import GameCardContainer from '../components/GameCardContainer';
import RecentGamesComponent from '../components/RecentGamesComponent.js';
import GenreCarousel from '../components/GenreCarousel.js';

function Home() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user details when component mounts
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('immortal-token');
      if (!token) {
        throw new Error('No token found');
      }

      // Get API key from environment variables
      const apiKey = process.env.REACT_APP_API_KEY;
      if (!apiKey) {
        throw new Error('No API key found');
      }

      // Fetch user details from the backend
      const response = await fetch('http://localhost:5000/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      // Parse the response
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };
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
        const tempGenres = genresResponse.data

        setGames(gamesResponse.data);
        setGenres(tempGenres.sort(() => 0.5 - Math.random()).slice(0, 5));
     
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
    
      {userData ? (
        <React.Fragment>
              <UserNavbar user={userData} games={games}/>
             
       <GameCarousel games={games} user={userData}/>
       <RecentGamesComponent games={games} user={userData}/>
       <GenreCarousel/>
       {randomGamesByGenre.map((genreData, index) => (
        <div key={index}>
          <GameCardContainer key={genreData.genre} genre={genreData.genre} side="User" games={genreData.games} user={userData} genreId={index} number={genreData.games.length} />
        </div>
      ))}
        </React.Fragment>
   
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}

export default Home;
