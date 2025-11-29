const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// IMPORTANT: In production, restrict the CORS origin to your frontend's URL
app.use(cors());
// Use a larger limit to accommodate the large JSON object with all keys
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 4000;
// Use a secure, writable path for the .env file. In production, this might be outside the code directory.
const envFilePath = path.resolve(process.cwd(), '.env.production');

app.post('/api/save-keys', (req, res) => {
  const keys = req.body;

  // For robust security, add authentication/authorization here.
  // Ensure only an authenticated admin user can access this endpoint.
  // For example: if (!req.user || !req.user.isAdmin) { return res.status(403).send('Forbidden'); }

  try {
    // Filter out any keys that the user left empty
    const filteredKeys = Object.fromEntries(
      Object.entries(keys).filter(([_, value]) => value !== '' && value !== null)
    );
      
    // Format the keys into the standard KEY="VALUE" format for a .env file
    const envContent = Object.entries(filteredKeys)
      .map(([key, value]) => {
        // Simple validation to ensure key names are safe
        if (!/^[A-Z0-9_]+$/.test(key)) {
          throw new Error(`Invalid key format: ${key}`);
        }
        // Escape any special characters in the value string
        const escapedValue = String(value).replace(/"/g, '\\"');
        return `${key}="${escapedValue}"`;
      })
      .join('\n');

    // =======================================================================================
    // DANGER ZONE: This writes to a local file. In a real cloud production environment,
    // you would instead use an SDK to update a secret manager service like:
    // - AWS Secrets Manager
    // - Google Cloud Secret Manager
    // - HashiCorp Vault
    // =======================================================================================
    fs.writeFileSync(envFilePath, envContent);

    console.log(`SUCCESS: ${Object.keys(filteredKeys).length} API keys were saved to ${envFilePath}`);
    
    res.status(200).json({
      message: 'Keys saved successfully! A server restart is required to apply the new credentials.'
    });

  } catch (error) {
    console.error('SERVER ERROR: Failed to write keys to file.', error);
    res.status(500).json({
      message: 'Server error: Could not save the keys. Check server logs.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Secure backend for API key management running on http://localhost:${PORT}`);
});