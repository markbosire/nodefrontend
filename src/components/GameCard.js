import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const GameCard = ({ image, genre, name, price, color, user, id }) => {
  const [showModal, setShowModal] = useState(false);
  const [purchaseResponse, setPurchaseResponse] = useState(null);
  const handleBuyGame = async () => {
    const apiKey = process.env.REACT_APP_API_KEY;
  
    try {
      const assetId = uuidv4();
  
      // Make API call to create asset
      const assetResponse = await axios.post('http://localhost:4000/Assets/create-asset', {
        GameName: name,
        GameValue: price,
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
            gameId: id,
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
      <div
        className={`card border-2 p-3`}
        style={{ width: '100%', borderColor: '#000', color: '#000', backgroundColor: color }}
        onClick={handleShowModal}
      >
        <img src={image} className="card-img-top" alt={name} style={{ aspectRatio: 1, width: '100%', objectFit: 'cover' }} />
        <div className={`card-body`}>
          <h5 className="card-title" title={name}>
            {name}
          </h5>
          <p className="card-text">{genre}</p>
          <p className="card-text">
            <strong>{price === 0 ? 'Free' : `$${price}`}</strong>
          </p>
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
export default GameCard;
