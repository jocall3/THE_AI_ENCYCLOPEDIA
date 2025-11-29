const express = require('express');
const cors = require('cors');
// Using AWS Secrets Manager as per the refined architectural approach
const { SecretsManagerClient, CreateSecretCommand, UpdateSecretCommand } = require("@aws-sdk/client-secrets-manager");

const app = express();
// In production, restrict the CORS origin to your frontend's URL for security
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// IMPORTANT: In a real production environment, credentials and region should be configured
// securely, for example, through IAM roles for the service running this code.
// The region should be set via environment variables.
const secretsManagerClient = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });

app.post('/api/save-keys', async (req, res) => {
    const keys = req.body;

    // SECURITY NOTE: This is a critical endpoint. Implement robust authentication and
    // authorization to ensure only permitted users/roles can update secrets.
    // Example: if (!req.user || !req.user.isAdmin) { return res.status(403).send('Forbidden'); }

    let savedCount = 0;
    const errors = [];

    for (const [key, value] of Object.entries(keys)) {
        // Process only keys that have a non-empty string value
        if (value && typeof value === 'string' && value.trim() !== '') {
            const secretName = `api_keys/${key}`;
            try {
                // Attempt to create the secret first
                const createCommand = new CreateSecretCommand({
                    Name: secretName,
                    SecretString: value,
                    Description: `API credential for ${key}`,
                });
                await secretsManagerClient.send(createCommand);
                savedCount++;
            } catch (error) {
                // If the secret already exists, update it instead
                if (error.name === 'ResourceExistsException') {
                    try {
                        const updateCommand = new UpdateSecretCommand({
                            SecretId: secretName,
                            SecretString: value,
                        });
                        await secretsManagerClient.send(updateCommand);
                        savedCount++;
                    } catch (updateError) {
                        console.error(`SERVER ERROR: Failed to update secret ${secretName}.`, updateError);
                        errors.push(`Failed to update ${key}`);
                    }
                } else {
                    console.error(`SERVER ERROR: Failed to create secret ${secretName}.`, error);
                    errors.push(`Failed to create ${key}`);
                }
            }
        }
    }

    if (errors.length > 0) {
        return res.status(500).json({
            message: `Server error: Saved ${savedCount} keys, but failed on: ${errors.join(', ')}. Check server logs for details.`,
            savedCount,
            errors,
        });
    }

    if (savedCount === 0) {
        return res.status(200).json({
            message: 'No new keys were provided to save.'
        });
    }

    res.status(200).json({
        message: `Successfully saved ${savedCount} keys to AWS Secrets Manager!`
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Secure backend for API key management running on http://localhost:${PORT}`);
});