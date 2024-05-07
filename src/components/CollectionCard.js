import React, { useState } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const CollectionCard = ({ image, name, color, user, assetId, collectionId, gameId,setSoldItem,soldItem }) => {
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSellConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('immortal-token');
      if (!token) {
        throw new Error('No token found');
      }

      // Get API key from environment variables
      const apiKey = process.env.REACT_APP_API_KEY;
      if (!apiKey) {
        throw new Error('No API key found');
      }
      // Delete endpoint URL
      const deleteEndpoint = `http://localhost:5000/api/collection/${collectionId}`;

      // Sales endpoint URL
      const salesEndpoint = 'http://localhost:5000/api/sales';

      // Delete request to delete the collection
      const deleteResponse = await fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',// Replace with your bearer token
          'x-api-key': apiKey,
        },
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete collection');
      }

      // Sales request to add to sales
      const salesResponse = await fetch(salesEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          assetId,
          gameId,
        }),
      });

      if (!salesResponse.ok) {
        throw new Error('Failed to add to sales');
      }

      // Handle success
      setSnackbarMessage('Item sold successfully!');
      setSoldItem(!soldItem)
      setSnackbarOpen(true);
      // Your deleteAndSale function logic here
      // Ensure you set setShowModal(false) and setLoading(false) appropriately
    } catch (error) {
      console.error('Error:', error.message);
      setSnackbarMessage('Failed to sell item');
      setSnackbarOpen(true);
      
    }
    finally {
      // Finally block to ensure loading state is reset and modal is closed
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className={`card border-2 p-3`} style={{ width: '100%', borderColor: '#000', color: '#000', backgroundColor: color }}>
        <img src={image} className="card-img-top" alt={name} style={{ aspectRatio: 1, width: '100%', objectFit: 'cover' }} />
        <div className={`card-body`}>
          <h5 className="card-title" title={name}>
            {name}
          </h5>
          <p className="card-text ass">
            <strong className='assid'>Asset ID:</strong>{assetId}
          </p>
          <Button className='sellBtn' onClick={() => setShowModal(true)}>Sell</Button>
        </div>
      </div>

      {/* Bootstrap Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sell</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to sell?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSellConfirm} disabled={loading}>
            {loading ? 'Selling...' : 'Sell'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MUI Snackbar for alert */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default CollectionCard;
