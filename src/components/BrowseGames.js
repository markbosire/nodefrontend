import GameCard from "./GameCard";
import React,{useState} from "react";
import { Container, Row, Col, Dropdown, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const BrowseGames = ({ genre, games, side, genreId, number }) => {
    const route = side ? `/admin/${genre}` : `/${genre}`;
    const totalPages = Math.ceil(games.length / 24);
    const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const filteredGames = games.slice((currentPage - 1) * 24, currentPage * 24);
  
    return (
     
     <React.Fragment>
        <Row>
          {filteredGames.map((game, index) => (
            <Col key={index} xs={12} md={6} lg={3} className="my-3">
              <GameCard
                image={game.gamePicBlob}
                genre={game.genre}
                name={game.gameName}
                price={game.cost}
                color={game.color}
              />
            </Col>
          ))}
        </Row>
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        </Pagination>
        </React.Fragment>
     
    );
  };
  export default BrowseGames