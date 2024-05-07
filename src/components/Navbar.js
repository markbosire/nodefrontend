import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Navbar.css"
import logo from '../images/logo.png'; // Import your logo image here

const NavigationBar = () => {
  return (
    <div className="navbar-container">  {/* Wrap navbar in a container */}
      <Navbar className="navbar-custom" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              height="30"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <div className="login-button" onClick={() => {
              window.location.href = '/Login';
            }}>Login</div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr className="navbar-divider" /> {/* Add the horizontal line */}
    </div>
  );
};

export default NavigationBar;
