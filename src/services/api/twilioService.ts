import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Twilio credentials or phone number are not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
}

const client = twilio(accountSid, authToken);

export const sendSms = async (to: string, body: string): Promise<void> => {
  try {
    await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
    console.log(`SMS sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending SMS to ${to}:`, error);
    throw error;
  }
};

export const getCallLogs = async (): Promise<twilio.Rest.Api.V2010.Account.CallInstance[]> => {
  try {
    const calls = await client.calls.list();
    return calls;
  } catch (error) {
    console.error('Error fetching call logs:', error);
    throw error;
  }
};

export const initiateCall = async (to: string, url: string): Promise<void> => {
  try {
    await client.calls.create({
      to,
      from: twilioPhoneNumber,
      url,
    });
    console.log(`Call initiated to ${to}`);
  } catch (error) {
    console.error(`Error initiating call to ${to}:`, error);
    throw error;
  }
};

// Add more Twilio API interactions as needed for communication features