import React,{useState,useEffect} from 'react'
import { Button, Modal } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert'; 
import axios from 'axios';

function UserSalesCard({name,sellerName,price,image,color,genre,username,assetId,gameId,userId,soldItem,setSoldItem}) {


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

      const assetsResponse = await fetch("http://localhost:4000/assets")
      const assetData = await assetsResponse.json()
      console.log(assetData.data)
      const asset = JSON.parse(assetData.data)
      const singleAsset = asset.find(assetItem => assetItem.id == assetId);
      const collectionEndpoint = 'http://localhost:5000/api/collection';

      console.log(singleAsset)
      // Remove request to remove the sale
      const assetResponse = await axios.put(`http://localhost:4000/Assets/update-Asset/${assetId}`, {
      
      
        "GameName": singleAsset.game_name,
        "GameValue": singleAsset.game_value,
        "ID": singleAsset.id,
        "Owner": username,
        "OwnerType": singleAsset.owner_type
      
      
      });

      if (assetResponse.status!=200) {
        throw new Error('Failed to buy');
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
        throw new Error('Failed to buy');
      }
      // Handle success
      setSnackbarMessage('Purchase successfull!');
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
    <div
        className={`card border-2 p-3 sales`}
        style={{ width: '100%', borderColor: '#000', color: '#000', backgroundColor: color }}
      
      >
        <img src={image} className="card-img-top" alt={name} style={{ aspectRatio: 1, width: '100%', objectFit: 'cover' }} />
        <div className={`card-body`}>
          <h5 className="card-title" title={name}>
            {name}
          </h5>
        
          <p className="card-text">
            <strong>{price === 0 ? 'Free' : `$${price}`}</strong>
          </p>
          <p className="card-text">{genre}</p>
          <p className="card-text" style={{color:"#fff"}}><strong style={{color:"#000"}}>Seller Name:</strong>{` ${sellerName}`}</p>
          <Button className='sellBtn' onClick={() => setShowModal(true)}>Buy</Button>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Buy?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSellConfirm} disabled={loading}>
            {loading ? 'Buying...' : 'Buy'}
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
  )
}

export default UserSalesCard