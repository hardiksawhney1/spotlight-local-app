const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// Setup WebSocket server
const wss = new WebSocket.Server({ port: 5001 });
console.log("WebSocket server started.");

// Helper function to broadcast data to all connected WebSocket clients
function broadcastData(data, type) {
  const payload = { type, data };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

// Watch data.json for changes
fs.watchFile('./data.json', () => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (!err) {
      // Send updated data with type 'data'
      broadcastData(JSON.parse(data), 'data');
    }
  });
});

// Watch announcement.json for changes
fs.watchFile('./announcement.json', () => {
  fs.readFile('./announcement.json', 'utf8', (err, data) => {
    if (!err) {
      // Send updated data with type 'announcement'
      broadcastData(JSON.parse(data), 'announcement');
    }
  });
});

// Endpoint to get data
app.get('/api/data', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint to get announcement data
app.get('/api/announcement', (req, res) => {
  fs.readFile('./announcement.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading announcement');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Save changes API
app.post('/api/savechanges', (req, res) => {
  const newArray = req.body;

  // Ensure the received data is an array
  if (!Array.isArray(newArray)) {
    return res.status(400).send('Invalid data format: Expected an array.');
  }

  fs.writeFile('./data.json', JSON.stringify(newArray, null, 2), (err) => {
    if (err) {
      res.status(500).send('Error saving data');
    } else {
      res.json({ message: 'Data successfully replaced', data: newArray });

      // Broadcast the updated data
      broadcastData(newArray, 'data');
    }
  });
});

// Endpoint to save data
app.post('/api/data', (req, res) => {
  const newData = req.body;
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data');
    } else {
      const json = JSON.parse(data);
      json.push(newData);
      fs.writeFile('./data.json', JSON.stringify(json, null, 2), err => {
        if (err) {
          res.status(500).send('Error saving data');
        } else {
          res.json(newData);
          // Broadcast new data with type 'data'
          broadcastData(json, 'data');
        }
      });
    }
  });
});

// Endpoint to update announcement.json
app.post('/api/announcement', (req, res) => {
  const updatedAnnouncement = req.body;

  // Read the existing announcement.json file
  fs.readFile('./announcement.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading announcement data');
    } else {
      const json = JSON.parse(data);

      // Update the fields with the provided values
      json.text = updatedAnnouncement.text || json.text;
      json.read = typeof updatedAnnouncement.read === 'boolean' ? updatedAnnouncement.read : json.read;

      // Write the updated data back to announcement.json
      fs.writeFile('./announcement.json', JSON.stringify(json, null, 2), err => {
        if (err) {
          res.status(500).send('Error saving announcement data');
        } else {
          res.json(json);

          // Broadcast updated announcement with type 'announcement'
          broadcastData({ type: 'announcement', data: json });
        }
      });
    }
  });
});

// Endpoint to toggle the checkbox
app.post('/api/toggleCheckbox', (req, res) => {
  const { id } = req.body;
  console.log("Hello id is : ",req.body);
  if (id === undefined) {
    return res.status(400).send('ID is required');
  }

  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).send('Error reading data');
    }

    let json = JSON.parse(data);
    const entryIndex = json.findIndex(item => item.id === id);

    if (entryIndex === -1) {
      return res.status(404).send('Entry not found');
    }

    // Toggle the `checked` field
    json[entryIndex].checked = !json[entryIndex].checked;

    fs.writeFile('./data.json', JSON.stringify(json, null, 2), err => {
      if (err) {
        console.error('Error saving data:', err);
        return res.status(500).send('Error saving data');
      }

      res.json(json[entryIndex]); // Respond with the updated object

      // Optionally, broadcast updated data via WebSocket
      broadcastData(json, 'data');
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:5001`);
});
