import React,{useEffect,useState}from 'react'
import { Chip, InputLabel, MenuItem, Select, Snackbar, Alert, TextField,Stack} from '@mui/material';
import { Button, Modal, Form} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from 'react-datepicker';

function ModalGames({showModal,setShowModal}) {
    const apiKey = process.env.REACT_APP_API_KEY;
  
    const [formData, setFormData] = useState({
      gameName: '',
      genre: '',
      gamePicBlob: '',
      onSale: false,
      developerIds: [],
      cost: 0,
      developerPercentage: 0,
      releaseDate: new Date(),
    });
    const [users, setUsers] = useState([]);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({
      gameName: '',
      genre: '',
      gamePicBlob: '',
      cost: '',
    });
    const handleModalClose = () => setShowModal(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
    validateField(name, val);
  };

  const handleDeveloperChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({ ...formData, developerIds: typeof value === 'string' ? value.split(',') : value });
  };

  const handleReleaseDate = (date) => {
    setFormData({ ...formData, releaseDate: date });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccessSnackbar(false);
    setShowErrorSnackbar(false);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'gameName':
        if (!value.trim()) {
          error = 'Game name cannot be empty';
        }
        break;
      case 'genre':
        if (!value.trim()) {
          error = 'Genre cannot be empty';
        }
        break;
      case 'gamePicBlob':
        if (!value.trim()) {
          error = 'Game picture blob cannot be empty';
        }
        break;
      case 'cost':
        if (value <= 0) {
          error = 'Cost must be greater than 0';
        }
        break;
      default:
        break;
    }
    setValidationErrors({ ...validationErrors, [name]: error });
  };

  const isFormValid = () => {
    const { gameName, genre, gamePicBlob, cost } = validationErrors;
    return !gameName && !genre && !gamePicBlob && !cost;
  };

  useEffect(() => {
    // Fetch users from the backend
    fetch('http://localhost:5000/auth/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    })
      .then(response => response.json())
      .then(data => {
        // Filter users by account type (case-insensitive)
        const filteredUsers = data.filter(user => user.accountType.toLowerCase() === 'developer');
        setUsers(filteredUsers);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [apiKey]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isFormValid()) {
      setSnackbarMessage('Please fix the errors in the form');
      setShowErrorSnackbar(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Game created successfully:', data.game);
        setSnackbarMessage('Game created successfully!');
        setShowSuccessSnackbar(true);
        handleModalClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to create game:', errorData.message);
        setSnackbarMessage(`Failed to create game: ${errorData.message}`);
        setShowErrorSnackbar(true);
      }
    } catch (error) {
      console.error('Error while creating game:', error.message);
      setSnackbarMessage(`Error while creating game: ${error.message}`);
      setShowErrorSnackbar(true);
    }
  };
  return (
    <div>
           <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for adding a game */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="gameName">
              <Form.Label>Game Name:</Form.Label>
              <Form.Control
                type="text"
                name="gameName"
                value={formData.gameName}
                onChange={handleChange}
                isInvalid={!!validationErrors.gameName}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.gameName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="genre">
              <Form.Label>Genre:</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                isInvalid={!!validationErrors.genre}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.genre}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="gamePicBlob">
              <Form.Label>Game Picture Blob:</Form.Label>
              <Form.Control
                type="text"
                name="gamePicBlob"
                value={formData.gamePicBlob}
                onChange={handleChange}
                isInvalid={!!validationErrors.gamePicBlob}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.gamePicBlob}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="onSale">
              <Form.Check 
                type="checkbox" 
                label="On Sale" 
                name="onSale" 
                checked={formData.onSale} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="developerIds">
              <InputLabel>Developers</InputLabel>
              <Select
                multiple
                value={formData.developerIds}
                onChange={handleDeveloperChange}
                renderValue={(selected) => (
                  <div>
                    {selected.length > 0 ? (
                      selected.map((value) => (
                        <Chip key={value} label={users.find((user) => user._id === value)?.username} />
                      ))
                    ) : (
                      <span>Select developers</span>
                    )}
                  </div>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="cost">
              <Form.Label>Cost:</Form.Label>
              <Form.Control
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                isInvalid={!!validationErrors.cost}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.cost}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="developerPercentage">
              <Form.Label>Developer Percentage:</Form.Label>
              <Form.Control type="number" name="developerPercentage" value={formData.developerPercentage} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="releaseDate">
              <Form.Label>Release Date:</Form.Label>
              <DatePicker
                name="releaseDate"
                selected={formData.releaseDate}
                onChange={handleReleaseDate}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!isFormValid()}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalGames