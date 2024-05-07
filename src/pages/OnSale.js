import React,{useEffect,useState} from 'react'
import UserNavbar from '../components/userNavbar';
import axios from 'axios';
import UserSalesCard from '../components/userSalesCard';
import { Container,Row,Col } from 'react-bootstrap';

function OnSale() {
    const [userData, setUserData] = useState(null);
    const [soldItem, setSoldItem] = useState(false);
    const [sales,setSales]=useState([])

    useEffect(() => {
      // Fetch user details when component mounts
      fetchUserDetails();
    }, []);
    const fetchSellerName = async (userId)=>{
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        if (!apiKey) {
          throw new Error('No API key found');
        }
  
        // Fetch user details from the backend
        const response = await fetch(`http://localhost:5000/auth/seller/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          
            'x-api-key': apiKey,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
  
        // Parse the response
        const userData = await response.json();
        return userData
      } catch (error) {
        console.log(error)
      }
    }

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
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user details:', error.message);
        }
      };
      const [games, setGames] = useState([]);


  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesResponse= await Promise(
          axios.get('http://localhost:5000/api/game', {
            headers: {
              'x-api-key': apiKey,
            },
          }));
      

        setGames(gamesResponse.data);
        
     
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, [apiKey]);
  useEffect(()=>{
    async function seller() {
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
        fetch(`http://localhost:5000/auth/seller/${userData._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          
            'x-api-key': apiKey,
          },
        }).then(response => response.json()),
        fetch('http://localhost:5000/api/sales', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
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
      .then(([sellerData,salesData, gameDetails]) => {

        console.log(sellerData)

        const filteredSales = salesData.filter(salesItem => salesItem.sellerUserId !== userData._id);

        // Combine data
        const newData = filteredSales.map((salesItem) => {
          //const sellerName = await fetchSellerName(salesItem.sellerUserId)
          const game = gameDetails.find(gameItem => gameItem._id === salesItem.gameId);
        
  
          return {
            salesId: salesItem._id,
            sellerName: sellerData.username,
            assetId: salesItem.assetId,
            userId: userData._id,
            userName: userData.username,
            gameName: game ? game.gameName : null,
            gameColor: game ? game.color : null,
            gameImage: game ? game.gamePicBlob : null,
            gameId:  game ? game._id : null,
            gamePrice:  game ? game.cost : null,
            gameGenre:  game ? game.genre : null,
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
  },[])
  return (
    <div>

            
      {userData ? (
        <React.Fragment>
              <UserNavbar user={userData} games={games}/>
              <Container>
              <Row>
              {sales.map((item, index) =>{ 
               
                return (
                <Col key={index} xs={12} md={6} lg={3} className="my-3">
                  <UserSalesCard

                      key={item.salesId}
                      image={item.gameImage}
                      name={item.gameName}
                      username={item.userName}
                      userId={item.userId}
                      color={item.gameColor}
                      price={item.gamePrice}
                      gameId={item.gameId}
                      genre={item.gameGenre}
                      assetId={item.assetId}
                      sellerName={item.sellerName}              
                      salesId={item.salesId}
                      setSoldItem={setSoldItem}
                      soldItem={soldItem}
                    />
                </Col>
                
              )})}
            </Row>
              </Container>
     
        </React.Fragment>
   
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  )
}

export default OnSale