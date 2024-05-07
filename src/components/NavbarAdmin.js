import React,{useState} from 'react'
import { Button, Navbar, Container, Nav, Image } from 'react-bootstrap';
import SearchAutocomplete from './SearchAutocomplete';
import logo from '../images/logo.png'; 
import ModalGames from './ModalGames';
import "../components/Navbar.css"


function NavbarAdmin({games}) {
    const [showModal, setShowModal] = useState(false);
    const handleModalShow = () => setShowModal(true);
    const isBrowseInUrl = window.location.href.includes('/browse'); 
    const isCollectionInUrl = window.location.href.includes('/collection'); 
    const isUserSaleInUrl = window.location.href.includes('/usersale'); 
    const handleSelect = (selectedItem) => {
        console.log('Selected item:', selectedItem);
      };
  return (
    <div className="navbar-container"> 
    <ModalGames showModal={showModal} setShowModal={setShowModal}/>

    <Navbar className='navbar-custom navbar-admin' expand="lg">
    <Container>
      {/* Logo on the left */}
      <Navbar.Brand href="#home">
        <Image src={logo} alt="Logo" height="30" />
      </Navbar.Brand>
      {/* Autocomplete search input */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" className='border-0 outline-0 shadow-0 rounded-0' />
      <Navbar.Collapse id="basic-navbar-nav">
  
   <SearchAutocomplete items={games.map((option) => option.gameName)} onSelect={handleSelect} placeholder="Search Games" />
 
  
   <span role="button" onClick={()=>{window.location.href = '/'; }}  className={`nav-link ms-4 ${!isBrowseInUrl&&!isCollectionInUrl&&!isUserSaleInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${!isBrowseInUrl&&!isCollectionInUrl&&!isUserSaleInUrl ? '#8300e7' : '#000'}`}}>Discover</span>
        <span role="button" onClick={()=>{window.location.href = '/browse'; }}  className={`nav-link ms-3 ${isBrowseInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${isBrowseInUrl ? '#8300e7' : '#000'}`}}>Browse</span>
        <span role="button" onClick={()=>{window.location.href = '/collection'; }}  className={`nav-link ms-3 ${isCollectionInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${isCollectionInUrl ? '#8300e7' : '#000'}`}}>Collection</span>
        <span role="button" onClick={()=>{window.location.href = '/usersale'; }}  className={`nav-link ms-3 ${isUserSaleInUrl ? 'fw-bolder' : ''} spanBtn`} style={{color:`${isUserSaleInUrl ? '#8300e7' : '#000'}`}}>User Sale</span>
  
        <Nav className="ms-auto">
          <Button variant="primary" className='btnGame' onClick={handleModalShow}>Add Game</Button>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  </div>
  )
}

export default NavbarAdmin