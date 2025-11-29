const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// =================================================================================
// Middleware Configuration
// =================================================================================

// IMPORTANT: In a real production environment, you must restrict the 'origin' 
// in CORS options to your specific frontend domain (e.g., https://app.yourcompany.com)
// to prevent unauthorized cross-origin requests.
app.use(cors());

// We increase the JSON payload limit to 10mb to accommodate the potentially large 
// object containing 200+ API keys and configuration strings.
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 4000;

// The path where the environment variables will be written.
// In a containerized environment (Docker), this might be a mounted volume path.
const envFilePath = path.resolve(process.cwd(), '.env.production');

// =================================================================================
// API Routes
// =================================================================================

/**
 * POST /api/save-keys
 * Receives a JSON object of API keys and writes them to a secure configuration file.
 */
app.post('/api/save-keys', (req, res) => {
  const keys = req.body;

  // ---------------------------------------------------------------------------
  // SECURITY NOTE: Authentication & Authorization
  // ---------------------------------------------------------------------------
  // In a production environment, this endpoint MUST be protected.
  // You should verify a session token or JWT in the headers before processing.
  // Example:
  // if (!req.user || !req.user.isAdmin) { 
  //   return res.status(403).json({ error: 'Forbidden: Admin access required.' }); 
  // }

  if (!keys || typeof keys !== 'object') {
    return res.status(400).json({ message: 'Invalid payload: Expected a JSON object of keys.' });
  }

  try {
    // 1. Filter out empty keys to keep the config file clean
    const filteredKeys = Object.fromEntries(
      Object.entries(keys).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );

    if (Object.keys(filteredKeys).length === 0) {
      return res.status(400).json({ message: 'No valid keys provided to save.' });
    }

    // 2. Format the keys into standard KEY="VALUE" .env format
    const envContent = Object.entries(filteredKeys)
      .map(([key, value]) => {
        // Basic validation: Keys should generally be uppercase alphanumeric with underscores
        if (!/^[A-Z0-9_]+$/.test(key)) {
          console.warn(`Warning: Key "${key}" does not match standard naming conventions.`);
        }
        
        // Escape double quotes in the value to prevent syntax errors in the .env file
        const escapedValue = String(value).replace(/"/g, '\\"');
        
        return `${key}="${escapedValue}"`;
      })
      .join('\n');

    // 3. Write to storage
    // =======================================================================================
    // PRODUCTION STRATEGY:
    // While writing to a file works for local dev or simple VPS setups, for high-scale 
    // production (AWS, GCP, Azure), you should replace this file write operation with 
    // an SDK call to a dedicated secrets manager:
    // 
    // - AWS Secrets Manager: client.updateSecret(...)
    // - Google Secret Manager: client.addSecretVersion(...)
    // - HashiCorp Vault: vault.write(...)
    // =======================================================================================
    
    // Add a timestamp header
    const fileContent = `# Auto-generated API Configuration\n# Updated: ${new Date().toISOString()}\n\n${envContent}\n`;
    
    fs.writeFileSync(envFilePath, fileContent, { encoding: 'utf8', mode: 0o600 }); // mode 600 ensures only owner can read/write

    console.log(`[SUCCESS] ${Object.keys(filteredKeys).length} API keys securely updated in ${envFilePath}`);
    
    res.status(200).json({
      success: true,
      message: 'Keys saved successfully. The server or application instance may need a restart to recognize new credentials.',
      count: Object.keys(filteredKeys).length
    });

  } catch (error) {
    console.error('[SERVER ERROR] Failed to save API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not persist configuration. Please check server logs.'
    });
  }
});

// =================================================================================
// Server Initialization
// =================================================================================

app.listen(PORT, () => {
  console.log(`\n🚀 Secure API Key Management Backend running on http://localhost:${PORT}`);
  console.log(`   - Environment file target: ${envFilePath}`);
  console.log(`   - CORS enabled`);
  console.log(`   - Ready to accept credentials for 200+ integrations\n`);
});