import React,{useEffect,useState} from 'react'
import UserNavbar from '../components/userNavbar';
import axios from 'axios';
import { Container,Row,Col } from 'react-bootstrap';
import CollectionCard from '../components/CollectionCard';
import SalesCard from '../components/SalesCard';

function Collection() {
    const [userData, setUserData] = useState(null);
    const [collectionData, setCollectionData] = useState(null);
    const [soldItem, setSoldItem] = useState(false);
    useEffect(() => {
      // Fetch user details when component mounts
      fetchUserDetails();
    
    }, []);

    const fetchUserDetails = async () => {
        try {
          // Get token from localStorage
          const token = localStorage.getItem('immortal-token');
          if (!token) {
            throw new Error('No token found');
          }
    
          // Get API key from environment variables
          const apiKey = process.env.REACT_APP_API_KEY;
          if (!apiKey) {
            throw new Error('No API key found');
          }
    
          // Fetch user details from the backend
          const response = await fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-api-key': apiKey,
            },
          });
       
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
        
    
          // Parse the response
          const userData = await response.json();
           const collectionResponse = await fetch(`http://localhost:5000/api/collections/${userData._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-api-key': apiKey,
            },
          });
          if (!collectionResponse.ok) {
            throw new Error('Failed to fetch user details');
          }
          const collectionData = await collectionResponse.json();
          setUserData(userData);
          setCollectionData(collectionData);
          console.log(collectionData)
        
        } catch (error) {
          console.error('Error fetching user details:', error.message);
        }
      };
      const [games, setGames] = useState([]);


  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesResponse= await
          axios.get('http://localhost:5000/api/game', {
            headers: {
              'x-api-key': apiKey,
            },
          });
      

        setGames(gamesResponse.data);
        
     
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, [apiKey]);
  const [combinedData, setCombinedData] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeSection, setActiveSection] = useState('library'); // 'library' or 'sales'


  useEffect(() => {
    // Fetch data from three APIs
    const token = localStorage.getItem('immortal-token');
    
    async function collector() {
      const response = await fetch('http://localhost:5000/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': apiKey,
        },
      });
   
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
    

      // Parse the response
      const userData = await response.json();
      Promise.all([
        fetch("http://localhost:4000/assets").then(response => response.json()),
        fetch(`http://localhost:5000/api/collections/${userData._id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-api-key': apiKey,
              },
            }).then(response => response.json()),
        fetch('http://localhost:5000/api/game', {
          method:"GET",
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
        }).then(response => response.json())
      ])
      .then(([assetData, collectionData, gameDetails]) => {
        // Combine data
        const newData = collectionData.map(collectionItem => {
         
          const game = gameDetails.find(gameItem => gameItem._id === collectionItem.gameId);
         const assets=JSON.parse(assetData.data)
       
          const asset = assets.find(assetItem => assetItem.game_name === game.gameName);
  
          return {
            collectionId: collectionItem._id,
            userId: collectionItem.userId,
            assetId: asset ? asset.id : null,
            gameName: game ? game.gameName : null,
            gameColor: game ? game.color : null,
            gameImage: game ? game.gamePicBlob : null,
            gameId:  game ? game._id : null
          };
        });
  
        // Set combined data
        console.log(newData)
        setCombinedData(newData);
        setSoldItem(false)
      })
      .catch(error => console.error('Error fetching data:', error));
    }
    
    async function seller() {
      const response = await fetch('http://localhost:5000/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': apiKey,
        },
      });
   
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
    

      // Parse the response
      const userData = await response.json();
      Promise.all([
     
        fetch(`http://localhost:5000/api/sales/${userData._id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-api-key': apiKey,
              },
            }).then(response => response.json()),
        fetch('http://localhost:5000/api/game', {
          method:"GET",
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
        }).then(response => response.json())
      ])
      .then(([salesData, gameDetails]) => {
        // Combine data
        const newData = salesData.map(salesItem => {
         
          const game = gameDetails.find(gameItem => gameItem._id === salesItem.gameId);
        
  
          return {
            salesId: salesItem._id,
            userId: salesItem.sellerUserId,
            status: salesItem.buyerUserId ? "Sold" : "Pending",
            gameName: game ? game.gameName : null,
            gameColor: game ? game.color : null,
            gameImage: game ? game.gamePicBlob : null,
            gameId:  game ? game._id : null
          };
        });
       console.log(newData)
        // Set combined data
        setSales(newData);
        setSoldItem(false)
      })
      .catch(error => console.error('Error fetching data:', error));
    }
    seller()
    collector()
  }, [soldItem]);

  return (
    <div>
      {userData ? (
        <React.Fragment>
          <UserNavbar user={userData} games={games}/>
          <Container style={{paddingTop:"15px"}}>
            <Col>
              {/* Navigation spans */}
              <span
               role='button'
                className={activeSection === 'library' ? 'active' : ''}
                style={{marginRight:"10px",borderBottom:`${activeSection === 'library'?"2px solid #000":"none"}`,padding:"5px",fontSize:"1.25rem",fontWeight:`${activeSection === 'library'?"bold":"normal"}`}}
                onClick={() => setActiveSection('library')}
              >
                Library
              </span>
              <span
               role='button'
                className={activeSection === 'sales' ? 'active' : ''}
                style={{marginRight:"10px",borderBottom:`${activeSection === "sales" ? "2px solid #000":"none"}`,padding:"5px",fontSize:"1.25rem",fontWeight:`${activeSection === 'sales'?"bold":"normal"}`}}
                onClick={() => setActiveSection('sales')}
              >
                Your Sales
              </span>
            </Col>
               {/* Render content based on active section */}
            {activeSection === 'library' ? (
              <Row>
                {combinedData.map((item, index) => (
                  <Col key={index} xs={12} md={6} lg={3} className="my-3">
                 <CollectionCard
                    key={item.collectionId}
                    image={item.gameImage}
                    name={item.gameName}
                    color={item.gameColor}
                    user={item.userId}
                    gameId={item.gameId}
                    assetId={item.assetId}
                    collectionId={item.collectionId}
                    setSoldItem={setSoldItem}
                    soldItem={soldItem}
                  />
                  </Col>
                ))}
              </Row>
            ) : (
              <Row>
              {sales.map((item, index) =>{ 
               
                return (
                <Col key={index} xs={12} md={6} lg={3} className="my-3">
                  <SalesCard

                      key={item.salesId}
                      image={item.gameImage}
                      name={item.gameName}
                      color={item.gameColor}
                      userId={item.userId}
                      gameId={item.gameId}
                      status={item.status}                  
                      salesId={item.salesId}
                      setSoldItem={setSoldItem}
                      soldItem={soldItem}
                    />
                </Col>
                
              )})}
            </Row>
            )}
          </Container>
        </React.Fragment>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  )
}

export default Collection