const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.static('public'));

// Serve main page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            text-align: center;
        }
        
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        
        .input-group {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        input {
            flex: 1;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
        }
        
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
        }
        
        button:hover {
            background: #45a049;
        }
        
        .quick-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin-top: 30px;
        }
        
        .quick-link {
            background: #f0f0f0;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
        }
        
        .quick-link:hover {
            background: #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Web Gateway</h1>
        
        <div class="input-group">
            <input type="text" id="url" placeholder="https://example.com" autofocus>
            <button onclick="go()">Browse</button>
        </div>
        
        <div class="quick-links">
            <div class="quick-link" onclick="setUrl('wikipedia.org')">Wikipedia</div>
            <div class="quick-link" onclick="setUrl('github.com')">GitHub</div>
            <div class="quick-link" onclick="setUrl('stackoverflow.com')">StackOverflow</div>
            <div class="quick-link" onclick="setUrl('archive.org')">Archive.org</div>
        </div>
        
        <script>
            function setUrl(site) {
                document.getElementById('url').value = site;
            }
            
            function go() {
                let url = document.getElementById('url').value.trim();
                if (!url) return alert('Please enter a URL');
                
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                }
                
                // Open in new tab using CORS proxy
                const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
                window.open(proxyUrl, '_blank');
            }
            
            // Enter key support
            document.getElementById('url').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') go();
            });
        </script>
    </div>
</body>
</html>
  `);
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('No URL provided');
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    res.send(html);
  } catch (error) {
    res.status(500).send('Error fetching URL');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
