const express = require('express');
const cors = require('cors');
// Example with AWS Secrets Manager. Ensure @aws-sdk/client-secrets-manager is in package.json
const { SecretsManagerClient, CreateSecretCommand, UpdateSecretCommand } = require("@aws-sdk/client-secrets-manager");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// IMPORTANT: In a real production environment, credentials and region should be configured
// securely, for example, through IAM roles for the service running this code.
const secretsManagerClient = new SecretsManagerClient({ region: "your-aws-region" });

app.post('/api/save-keys', async (req, res) => {
    const keys = req.body;

    // SECURITY NOTE: This is a critical endpoint. Add robust authentication and 
    // authorization here to ensure only permitted users/roles can update secrets.
    // For example: if (!req.user || !req.user.isAdmin) { return res.status(403).send('Forbidden'); }

    try {
        for (const [key, value] of Object.entries(keys)) {
            if (value && typeof value === 'string' && value.trim() !== '') {
                const secretName = `api_keys/${key}`;
                try {
                    // Attempt to create the secret
                    const createCommand = new CreateSecretCommand({
                        Name: secretName,
                        SecretString: value,
                        Description: `API credential for ${key}`,
                    });
                    await secretsManagerClient.send(createCommand);
                } catch (error) {
                    if (error.name === 'ResourceExistsException') {
                        // If the secret already exists, update its value
                        const updateCommand = new UpdateSecretCommand({
                            SecretId: secretName,
                            SecretString: value,
                        });
                        await secretsManagerClient.send(updateCommand);
                    } else {
                        // For other errors, re-throw to be caught by the outer catch block
                        throw error;
                    }
                }
            }
        }

        res.status(200).json({
            message: 'Keys saved successfully to Secrets Manager!'
        });

    } catch (error) {
        console.error('SERVER ERROR: Failed to save keys to Secrets Manager.', error);
        res.status(500).json({
            message: 'Server error: Could not save the keys.'
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Secure backend for API key management running on http://localhost:${PORT}`);
});