import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function SalesCard({ name, image, status, color, salesId, userId, gameId,setSoldItem, soldItem }) {
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveConfirm = async () => {
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

      // Remove endpoint URL
      const removeEndpoint = `http://localhost:5000/api/sales/${salesId}`;
      const collectionEndpoint = 'http://localhost:5000/api/collection';

      // Remove request to remove the sale
      const removeResponse = await fetch(removeEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
          'x-api-key': apiKey,
        },
      });

      if (!removeResponse.ok) {
        throw new Error('Failed to remove sale');
      }
      const collectionResponse = await fetch(collectionEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          userId,
          gameId,
        }),
      });

      if (!collectionResponse.ok) {
        throw new Error('Failed to add to sales');
      }
      // Handle success
      setSnackbarMessage('Sale removed successfully!');
      setSoldItem(!soldItem);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error:', error.message);
      setSnackbarMessage('Failed to remove sale');
      setSnackbarOpen(true);
    } finally {
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
          <p className="card-text">Status: {status}</p>
          <Button className='removeBtn' onClick={() => setShowModal(true)}>Remove</Button>
        </div>
      </div>

      {/* Bootstrap Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this sale?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleRemoveConfirm} disabled={loading}>
            {loading ? 'Removing...' : 'Remove'}
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
}

export default SalesCard;
