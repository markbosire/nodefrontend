import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BackgroundImg from '../images/bg.jpg';
import infiniteLogo from '../images/logo.svg';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import '../index.css';

const defaultTheme = createTheme();

export default function AdminLogin() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const adminLogin = async (password) => {
    try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await fetch('http://localhost:5000/auth/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' ,  'x-api-key': apiKey, },
          body: JSON.stringify({ password }),
        });
  
      if (response.ok) {
        setMessage('Admin login successful!');
        setSuccess(true);
        setOpen(true);
        localStorage.setItem('isAdminLoggedInImmortal', true);
        setTimeout(() => {
          window.location.href = '/admin'; // Redirect to homepage after successful login
        }, 2000);
      } else {
        const data = await response.json();
        setMessage(`Admin login failed: ${data.error}`);
        setSuccess(false);
        setOpen(true);
      }
    } catch (error) {
      console.log('Error during admin login:', error);
      setMessage('An error occurred during admin login');
      setSuccess(false);
      setOpen(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');

    adminLogin(password);
  };

  return (
    <React.Fragment>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${BackgroundImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={infiniteLogo} style={{ height: '60px', width: '60px', objectFit: 'contain' }} />

            <Typography component="h1" variant="h5">
              Admin Login
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value="admin"
                readOnly
                autoFocus
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
               
              />

              <Button
                className="btnSignIn"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/Login" className="linkSign" variant="body2">
                    {"Looking for the User Login? Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} elevation={6} variant="filled" severity={success ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
