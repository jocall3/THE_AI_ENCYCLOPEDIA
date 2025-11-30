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

    // Filter out empty/invalid keys before processing
    const validKeys = Object.entries(keys).filter(([, value]) =>
        value && typeof value === 'string' && value.trim() !== ''
    );

    if (validKeys.length === 0) {
        return res.status(200).json({
            message: 'No new keys were provided to save.'
        });
    }

    // Process all valid keys in parallel
    const savePromises = validKeys.map(async ([key, value]) => {
        const secretName = `api_keys/${key}`;
        try {
            // Attempt to create the secret first
            const createCommand = new CreateSecretCommand({
                Name: secretName,
                SecretString: value,
                Description: `API credential for ${key}`,
            });
            await secretsManagerClient.send(createCommand);
            return { key, status: 'created' };
        } catch (error) {
            // If the secret already exists, update it instead
            if (error.name === 'ResourceExistsException') {
                try {
                    const updateCommand = new UpdateSecretCommand({
                        SecretId: secretName,
                        SecretString: value,
                    });
                    await secretsManagerClient.send(updateCommand);
                    return { key, status: 'updated' };
                } catch (updateError) {
                    console.error(`SERVER ERROR: Failed to update secret ${secretName}.`, updateError);
                    // Throw a structured error for Promise.allSettled to catch
                    throw { key, error: `Failed to update secret. Reason: ${updateError.message}` };
                }
            } else {
                console.error(`SERVER ERROR: Failed to create secret ${secretName}.`, error);
                // Throw a structured error for Promise.allSettled to catch
                throw { key, error: `Failed to create secret. Reason: ${error.message}` };
            }
        }
    });

    const results = await Promise.allSettled(savePromises);

    const successfulSaves = [];
    const failedSaves = [];

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            successfulSaves.push(result.value.key);
        } else {
            // result.reason will contain our structured error object
            failedSaves.push(result.reason);
        }
    });

    if (failedSaves.length > 0) {
        return res.status(500).json({
            message: `Completed with ${failedSaves.length} error(s). Successfully saved ${successfulSaves.length} key(s).`,
            savedCount: successfulSaves.length,
            successfulKeys: successfulSaves,
            errors: failedSaves, // This will be an array of { key, error } objects
        });
    }

    res.status(200).json({
        message: `Successfully saved ${successfulSaves.length} keys to AWS Secrets Manager!`,
        savedCount: successfulSaves.length,
    });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Secure backend for API key management running on http://localhost:${PORT}`);
});