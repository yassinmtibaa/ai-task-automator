require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
let fetch; // Declare fetch globally

// Dynamic import
import('node-fetch').then(module => {
  fetch = module.default;
  
  // Rest of your server code goes here
  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));

  app.post('/api/process-task', async (req, res) => {
    try {
      const { task } = req.body;
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HUGGING_FACE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: task }),
        }
      );
      const result = await response.json();
      res.json({ success: true, result: result[0]?.generated_text || "No response" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});