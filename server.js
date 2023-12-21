const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs').promises; // Use fs.promises for promise-based fs methods
const path = require('path');
const { promisify } = require('util');


const app = express();
const port = 3000;

app.use(bodyParser.json());

// Promisify fs.unlink for later use
const unlinkAsync = promisify(fs.unlink);

// Serve static files from the 'public' directory
app.use(express.static('public'));


app.post('/generate-links', async (req, res) => {
  try {
    const { quantity } = req.body;

    // Perform any advanced logic or processing here

    const uploadsDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate the specified number of links
    const links = await generateLinks(quantity);

    // Save the links to a file
    const filename = 'generated_links.txt';
    const filePath = path.join(uploadsDir, filename); // Use uploadsDir here
    await fs.writeFile(filePath, links.join('\n'));

    // Send the file path as a response to the client
    res.status(200).json({ success: true, fileUrl: `/download/${filename}` });

    // Delete the file after sending
  //  await unlinkAsync(filePath);
  } catch (error) {
    console.error('Error generating links:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
  
// Serve static files (including the generated file for download)
app.use('/download', express.static('uploads'));

// Function to generate links
async function generateLinks(quantity) {
    const links = [];
  
    for (let i = 0; i < quantity; i++) {
      const partnerUserId = '15ddc8b179e57bfc769afe550245833ef836bf303c076ca96947e0954f0766fe';
  
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
