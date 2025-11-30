const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { SecretsManagerClient, CreateSecretCommand, UpdateSecretCommand } = require("@aws-sdk/client-secrets-manager");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Determine if running in development
const isDev = process.env.NODE_ENV !== 'production';

// Initialize AWS Secrets Manager Client
// Credentials and region should be configured securely, e.g., via environment variables or IAM roles.
const secretsManagerClient = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Use a preload script to securely expose Node.js functionality to the renderer process
            preload: path.join(__dirname, 'preload.js'),
            // It's recommended to keep contextIsolation true for security
            contextIsolation: true,
            // It's recommended to keep nodeIntegration false for security
            nodeIntegration: false,
        },
    });

    // and load the index.html of the app.
    const startUrl = isDev
        ? 'http://localhost:3000' // URL for the React dev server
        : url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true,
        });

    mainWindow.loadURL(startUrl);

    // Open the DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// --- IPC Handlers ---

// Handle 'save-keys' event from the renderer process
ipcMain.handle('save-keys', async (event, keys) => {
    // Filter out empty/invalid keys before processing
    const validKeys = Object.entries(keys).filter(([, value]) =>
        value && typeof value === 'string' && value.trim() !== ''
    );

    if (validKeys.length === 0) {
        return {
            message: 'No new keys were provided to save.',
            savedCount: 0,
        };
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
                    console.error(`MAIN PROCESS ERROR: Failed to update secret ${secretName}.`, updateError);
                    throw { key, error: `Failed to update secret. Reason: ${updateError.message}` };
                }
            } else {
                console.error(`MAIN PROCESS ERROR: Failed to create secret ${secretName}.`, error);
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
            failedSaves.push(result.reason);
        }
    });

    if (failedSaves.length > 0) {
        return {
            message: `Completed with ${failedSaves.length} error(s). Successfully saved ${successfulSaves.length} key(s).`,
            savedCount: successfulSaves.length,
            successfulKeys: successfulSaves,
            errors: failedSaves,
        };
    }

    return {
        message: `Successfully saved ${successfulSaves.length} keys to AWS Secrets Manager!`,
        savedCount: successfulSaves.length,
    };
});

// Handle 'get-insights' event from the renderer process
ipcMain.handle('get-insights', async (event, { code, openAIApiKey }) => {
    if (!code || !openAIApiKey) {
        return { error: 'Code and OpenAI API Key are required.' };
    }

    try {
        // This is where you would integrate with an AI service like OpenAI.
        // You would need to install the 'openai' package: npm install openai
        //
        // Example implementation:
        // const { OpenAI } = require("openai");
        // const openai = new OpenAI({ apiKey: openAIApiKey });
        // const completion = await openai.chat.completions.create({
        //     model: "gpt-4",
        //     messages: [
        //         { role: "system", content: "You are a helpful assistant that analyzes code and provides insights." },
        //         { role: "user", content: `Analyze the following code and provide insights:\n\n${code}` }
        //     ],
        // });
        // return { insights: completion.choices[0].message.content };

        // For now, returning a mock response after a short delay.
        console.log('Received code for analysis. Using provided API key.');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        return {
            insights: "This is a mock insight. The provided code seems to follow best practices for its language. Consider adding more detailed unit tests for the edge cases in the `processData` function to improve robustness."
        };

    } catch (error) {
        console.error('MAIN PROCESS ERROR: Failed to get insights.', error);
        // In a real implementation, you would parse the error from the AI service
        return { error: `Failed to get insights from AI service. Reason: ${error.message}` };
    }
});