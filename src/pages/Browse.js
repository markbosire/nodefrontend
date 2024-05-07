import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NavbarAdmin from '../components/NavbarAdmin';
import FilterSection from '../components/FilterSection';
import BrowseGames from '../components/BrowseGames';
import { Container, Row, Col, Button } from 'react-bootstrap';
import FAQ from '../components/Faq';

function Browse() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesResponse = await axios.get('http://localhost:5000/api/game', {
          headers: {
            'x-api-key': apiKey,
          },
        });

        setGames(gamesResponse.data);
        setFilteredGames(gamesResponse.data);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, [apiKey]);
 function resetFilters(){
  setFilteredGames(games)
  setSelectedOptions([])
 }
  const handleFilterChange = useCallback((filterType, filterValue) => {
    let tempSelectedOptions = []

    if (selectedOptions.includes(`${filterType}:${filterValue}`)) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== `${filterType}:${filterValue}`));
      tempSelectedOptions=selectedOptions.filter(opt => opt !== `${filterType}:${filterValue}`)
    } else {
      setSelectedOptions([...selectedOptions, `${filterType}:${filterValue}`]);
      tempSelectedOptions=[...selectedOptions, `${filterType}:${filterValue}`]
    }
    const filtered = games.filter((game) => {
      return tempSelectedOptions.every((option) => {
        const [filterType, filterValue] = option.split(':');
  
        switch (filterType) {
          case 'genre':
            return game.genre === filterValue;
          case 'priceRange':
            if (filterValue === 'free') {
              return game.cost === 0;
            } else if (filterValue === '40+') {
              return game.cost >= 40;
            } else {
              const [min, max] = filterValue.split('-').map(Number);
              return game.cost >= min && game.cost < max;
            }
          case 'releaseDate':
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const gameYear = new Date(game.releaseDate).getFullYear();
            const gameMonth = new Date(game.releaseDate).getMonth() + 1;
  
            switch (filterValue) {
              case 'thisMonth':
                return gameYear === currentYear && gameMonth === currentMonth;
              case 'thisYear':
                return gameYear === currentYear;
              case '2020s':
                return gameYear >= 2020 && gameYear < 2030;
              case '2010s':
                return gameYear >= 2010 && gameYear < 2020;
              case '2000s':
                return gameYear >= 2000 && gameYear < 2010;
              default:
                return true;
            }

          case 'reset':
            setFilteredGames(games);
            setSelectedOptions([])
          default:
            return true;
        }
      });  });
    setFilteredGames(filtered);
  }, [games, selectedOptions]);

  const genres = [...new Set(games.map((game) => game.genre))];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div>
      <NavbarAdmin games={games} />
      <Container>
        <Row>
          <Col md={10}>
            <div className="selected-options">
              {selectedOptions.map((option, index) => (
                <span key={index} className="selected-option">
                  {option.replace(/:/g, ': ')} <i className="fa fa-times" onClick={() => handleFilterChange(...option.split(':'))}></i>
                </span>
              ))}
            </div>
            <BrowseGames games={filteredGames} number={4} />
          </Col>
          <Col md={2}>
            <div className="d-md-block d-none">
              <FilterSection genres={genres} onFilterChange={handleFilterChange} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} resetFilters={resetFilters}/>
            </div>
            <div className="d-md-none">
              <Button variant="primary" onClick={toggleFilters}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              {showFilters && (
                <FilterSection genres={genres} onFilterChange={handleFilterChange} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} resetFilters={resetFilters} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Browse;