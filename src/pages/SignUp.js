import * as React from 'react';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import '../index.css';

const defaultTheme = createTheme();

export default function SignUp() {
  const [accountType, setAccountType] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [success, setSuccess] = React.useState(true);

  const handleChange = (event) => {
    setAccountType(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
    return strongPasswordRegex.test(password);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setSuccess(false);
      setOpen(true);
      return;
    }

    if (!isStrongPassword(password)) {
      setMessage('Password must be at least 8 characters long and contain a number, a lowercase letter and an uppercase letter, and at least one of the following special characters: @ $ ! % * ? & # . -');
      setSuccess(false);
      setOpen(true);
      return;
    }

    try {
        const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ username, password, accountType }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('immortal-token', data.token);
        setMessage('Signup successful!');
        setSuccess(true);
        setOpen(true);
        setTimeout(() => {
          window.location.href = '/'; // Redirect to homepage after successful signup
        }, 2000);
      } else {
        const data = await response.json();
        setMessage(`Signup failed because of ${data.error}`);
        setSuccess(false);
        setOpen(true);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('An error occurred while signing up.');
      setSuccess(false);
      setOpen(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
              />
              <FormControl fullWidth required>
                <InputLabel id="account-type-label">Account Type</InputLabel>
                <Select
                  labelId="account-type-label"
                  id="account-type"
                  value={accountType}
                  label="Account Type"
                  onChange={handleChange}
                >
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Gamer">Gamer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
              />

              <Button
                className="btnSignIn"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/login" className="linkSign" variant="body2">
                    Already have an account? Login
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
        <Alert onClose={handleClose} severity={success ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
