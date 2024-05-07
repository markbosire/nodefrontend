import React from 'react';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import logo from '../images/logo.png';
import "./Navbar.css"
import SearchAutocomplete from './SearchAutocomplete';

const userNavbar = ({ user,games }) => {
  const isBrowseInUrl = window.location.href.includes('/browse'); 
  const isCollectionInUrl = window.location.href.includes('/collection'); 
  const isUserSaleInUrl = window.location.href.includes('/usersale'); 
  const handleSelect = (selectedItem) => {
      console.log('Selected item:', selectedItem);
    };
    return (
      <div className="navbar-container"> 
      <Navbar className='navbar-custom' expand="lg">
        <Container>
          {/* Logo on the left */}
          <Navbar.Brand href="#home">
            <Image src={logo} alt="Logo" height="30" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='border-0 outline-0 shadow-0 rounded-0' />
      <Navbar.Collapse id="basic-navbar-nav">
  
   <SearchAutocomplete items={games.map((option) => option.gameName)} onSelect={handleSelect} placeholder="Search Games" />
 
        <span role="button" onClick={()=>{window.location.href = '/'; }}  className={`nav-link ms-4 ${!isBrowseInUrl&&!isCollectionInUrl&&!isUserSaleInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${!isBrowseInUrl&&!isCollectionInUrl&&!isUserSaleInUrl ? '#8300e7' : '#000'}`}}>Discover</span>
        <span role="button" onClick={()=>{window.location.href = '/browse'; }}  className={`nav-link ms-3 ${isBrowseInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${isBrowseInUrl ? '#8300e7' : '#000'}`}}>Browse</span>
        <span role="button" onClick={()=>{window.location.href = '/collection'; }}  className={`nav-link ms-3 ${isCollectionInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${isCollectionInUrl ? '#8300e7' : '#000'}`}}>Collection</span>
        <span role="button" onClick={()=>{window.location.href = '/usersale'; }}  className={`nav-link ms-3 ${isUserSaleInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${isUserSaleInUrl ? '#8300e7' : '#000'}`}}>User Sale</span>
  
        <Nav className="ms-auto">
              {user && (
                <Nav.Item>
                  <Nav.Link disabled>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Circular avatar */}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#8300e7',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: '10px',
                        }}
                      >
                        {/* Display user's initial */}
                        <span style={{ color: 'white', fontSize: '20px' }}>
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Display user's account type */}
                      <span>{user.accountType}</span>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
      </Navbar.Collapse>
          
        </Container>
      </Navbar>
       <hr className="navbar-divider" /> {/* Add the horizontal line */}
       </div>
    );
  };
  
  export default userNavbar;
  
