import React,{useEffect} from 'react';
import GameCard from './GameCard';


function truncateString(str, maxLength) {

  if (str.length <= maxLength) {
    return str; // Return the original string if it's within the maximum length
  } else {
    return str.slice(0, maxLength - 3) + '...'; // Truncate the string and add an ellipsis
  }
}


const GameCardContainer =  ({ genre, games,side,genreId ,number,user}) => {
    

  const route=side?`/admin/${genre}`:`/${genre}`
  return (
    <div className="container d-flex flex-column align-items-left gcard">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">{`${genre} Games`}</h3> {/* Remove margin-bottom for better alignment */}
        
          <a href={`${route}`} className="ml-auto">View All</a>
        
      </div>
      <div className="d-flex justify-content-between">
        {games.map((game, index) => (
          <div key={index} className="mx-3 my-3" style={{width:`${100/number}%`}} title={game.gameName}>
            <GameCard
              user={user}
              id={game._id}
              image={game.gamePicBlob}
              genre={game.genre}
              name={game.gameName}
              price={game.cost}
              color={game.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCardContainer;
