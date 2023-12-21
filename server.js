const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to handle the POST request
app.post('/direct-fulfillment', async (req, res) => {
  try {
    const partnerUserId = req.body.partnerUserId;

    // Perform any advanced logic or processing here

    // Make a request to the external API using axios
    const apiResponse = await axios.post('https://api.discord.gx.games/v1/direct-fulfillment', {
      partnerUserId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'sec-ch-ua': '"Opera GX";v="105", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'Referer': 'https://www.opera.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });

    // Handle the response from the external API
    const apiData = apiResponse.data;
    const link = `https://discord.com/billing/partner-promotions/118023171227438115/${apiData.token}`

    // Perform additional processing of the API response if needed

    // Send a custom response to the client
    res.status(200).json({ success: true, data: link });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Redirect root URL to the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
