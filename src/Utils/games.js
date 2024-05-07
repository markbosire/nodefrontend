
import axios from 'axios';



    
    const apiKey = process.env.REACT_APP_API_KEY;
    
        const gamesData = async () => {
          try {
            const gamesResponse = await axios.get('http://localhost:5000/api/game', {
                headers: {
                  'x-api-key': apiKey,
                },
              })
    
            return gamesResponse.data;
         
           
          } catch (error) {
            console.error(`Error fetching data: ${error.message}`);
          }
        };
    
  
    



export {gamesData}



    

