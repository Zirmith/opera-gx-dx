const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs').promises; // Use fs.promises for promise-based fs methods
const path = require('path');
const { promisify } = require('util');


const app = express();
const port = 3000;
const links = [];

app.use(bodyParser.json());

// Promisify fs.unlink for later use
const unlinkAsync = promisify(fs.unlink);

// Serve static files from the 'public' directory
app.use(express.static('public'));


app.get('/generate-links', async (req, res) => {
  try {
    // Extract the quantity from the query parameters or set a default value
    const quantity = Math.floor(Math.random() * 10) + 1;

    // Perform any advanced logic or processing here

    // Generate the specified number of links
    const links = await generateLinks(quantity);

    // Send the links as a response to the client
    res.status(200).json({ success: true, links: links });

  } catch (error) {
    console.error('Error generating links:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Serve static files (including the generated file for download)
app.use('/download', express.static('uploads'));


// Function to generate a random string
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate links
async function generateLinks(quantity) {
  
    for (let i = 0; i < quantity; i++) {
      // Generate a random string of length 64
    const partnerUserId = generateRandomString(64);
  
      // Make a request to the external API using axios
      const apiResponse = await axios.post('https://api.discord.gx.games/v1/direct-fulfillment', {
        partnerUserId,
      }, {
        headers: {
          'authority': 'api.discord.gx.games',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'origin': 'https://www.opera.com',
          'referer': 'https://www.opera.com/',
          'sec-ch-ua': '"Opera GX";v="105", "Chromium";v="119", "Not?A_Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0'
        },
      });
  
      // Handle the response from the external API
      const apiData = apiResponse.data;
      const link = `https://discord.com/billing/partner-promotions/118023171227438115/${apiData.token}`;
  
      // Add the link to the array
      links.push(link);
    }
  
    return links;
  }

// Redirect root URL to the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
