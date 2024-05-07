import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameCard from './GameCard';

const RecentGamesComponent = ({ games,user }) => {
  const [shuffledGames, setShuffledGames] = useState([]);

  useEffect(() => {
    // Filter games released this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const recentGames = games.filter(
      (game) =>
        new Date(game.releaseDate).getMonth() === currentMonth &&
        new Date(game.releaseDate).getFullYear() === currentYear
    );

    // Shuffle the recent games
    const shuffledGames = recentGames
      .map((game) => ({ game, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ game }) => game)
      .slice(0, 4); // Take the first 4 games

    setShuffledGames(shuffledGames);
  }, [games]);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center gcard"> 
        <h2>Released this month</h2>
        <a href={"#"} className="ml-auto">View All</a>
      </div>
      <Row>
        {shuffledGames.map((game) => (
          <Col key={game._id} md={3}>
            <GameCard
            user={user}
            id={game._id}
              image={game.gamePicBlob}
              genre={game.genre}
              name={game.gameName}
              price={game.cost}
              color={game.color}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecentGamesComponent;