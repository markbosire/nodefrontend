import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Container,Col, Row, Button,Modal } from 'react-bootstrap';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

const GameCard = ({ user,game}) => {
  const [showModal, setShowModal] = useState(false);
  const [purchaseResponse, setPurchaseResponse] = useState(null);
  const handleBuyGame = async () => {
    const apiKey = process.env.REACT_APP_API_KEY;
  
    try {
      const assetId = uuidv4();
  
      // Make API call to create asset
      const assetResponse = await axios.post('http://localhost:4000/Assets/create-asset', {
        GameName: game.gameName,
        GameValue: game.cost,
        ID: assetId,
        Owner: user.username,
        OwnerType: 'player',
      });
  
      console.log('Asset created:', assetResponse);
  
      // Check if asset creation is successful
      if (assetResponse.status === 201) {
        // If asset creation is successful, make collection request
        const collectionResponse = await fetch('http://localhost:5000/api/collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({
            userId: user._id,
            gameId: game._id,
          }),
        });
  
        if (collectionResponse.status === 200) {
          console.log(collectionResponse)
        setPurchaseResponse({ success: true, message: 'Game purchased successfully.' });
        }else{
          console.log(collectionResponse);         
          setPurchaseResponse({ success: false, message: 'An error occurred while purchasing the game.' });
      }

      } else {
        setPurchaseResponse({ success: false, message: 'An error occurred while purchasing the game.' });
      
        // Handle asset creation failure
        console.log('Asset creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setPurchaseResponse({ success: false, message: 'An error occurred while purchasing the game.' });
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setPurchaseResponse(null); // Clear response when modal is closed
  };
  const handleShowModal = () => setShowModal(true);
  return (
    <>
    <div className="game-card border border-3 border-dark  p-5 gap-3 text-dark" style={{ height:"600px",display:"flex", flexDirection:"column", backgroundColor:game.color}}>
      <img src={game.gamePicBlob} alt={game.gameName} style={{  aspectRatio:1, width:"40%", objectFit: 'cover',border:`3px solid ${game.color}`}} />
      <div className="game-info">
        <h1>{game.gameName}</h1>
        <h2>{game.genre}</h2>
        <h2 className="price">Free</h2>
       <Button onClick={handleShowModal} style={{backgroundColor:"#8300e7",border:"2px solid #000",color:"#fff"}}>Buy Now</Button>
      </div>
    </div>
    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to buy this game?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBuyGame}>
            Buy
          </Button>
        </Modal.Footer>
        {purchaseResponse && (
          <Modal.Body>
            {purchaseResponse.success ? (
              <p className="text-success">{purchaseResponse.message}</p>
            ) : (
              <p className="text-danger">{purchaseResponse.message}</p>
            )}
          </Modal.Body>
        )}
      </Modal>
    </>
  );
};
const GameCarousel = ({ games,user }) => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timerValue, setTimerValue] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const freeGames = games.filter((game) => game.cost === 0);
    const shuffledFreeGames = freeGames.sort(() => Math.random() - 0.5);
    setFilteredGames(shuffledFreeGames.slice(0, 4));
  }, [games]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerValue((prevValue) => (prevValue + 1) % 100);
    }, 75); // Update timer value every 50ms

    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (newIndex) => {
    setSelectedIndex(newIndex);
    setTimerValue(0); // Reset timer value when slide changes
  };

  const handleNavigationClick = (index) => {
    sliderRef.current.slickGoTo(index);
  };

 
  const navigationItems = filteredGames.map((game, index) => {
   
    const startColor = hexToRgba(game.color, 0.4);
    const percentage = index === selectedIndex? Math.min(100, timerValue * 2):0; // Adjust the percentage based on timerValue
    const gradient = `linear-gradient(to right, ${game.color} ${percentage}%, ${startColor} 0)`;

    return (
      <div
        key={game.gameName}
        className="navigation-item border border-2 border-dark d-flex px-5"
        style={{
          backgroundImage: gradient,
          height: '25%',
          gap: '5px',
          alignItems: 'center',
        }}
        onClick={() => handleNavigationClick(index)}
      >
        <img
          src={game.gamePicBlob}
          alt={game.gameName}
          className="navigation-pic border border-3 border-dark"
          style={{ height: '80px', width: '60px', objectFit: 'cover' }}
        />
        <h6>{game.gameName}</h6>
      </div>
    );
  });

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    afterChange: handleSlideChange,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
   
    <div className="game-carousel-container m-5">
        <Container>
            <h2>Free </h2>
            <Row>    
                
                <Col md={8}>
      <Slider ref={sliderRef} {...settings}>
        {filteredGames.map((game) => (
          <GameCard key={game.gameName} game={game} user={user}/>
        ))}
      </Slider>
      </Col>
      <Col md={4}>
      <div className="navigation" style={{height:"600px",backgroundColor:"#fff"}}>
        {navigationItems}
      </div>
      </Col></Row>
    
        </Container>
        
     
    </div>
 
    </>  );
};
export default GameCarousel;