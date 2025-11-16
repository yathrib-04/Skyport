import axios from "axios";

const BASE_URL = "https://api.textbee.dev/api/v1";

export const sendSms = async (phone, message) => {
  try {
    await axios.post(
      `${BASE_URL}/gateway/devices/${process.env.TEXTBEE_DEVICE_ID}/send-sms`,
      {
        recipients: [phone],
        message: message,
      },
      {
        headers: {
          "x-api-key": process.env.TEXTBEE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ SMS sent successfully to ${phone}`);
    return true;
  } catch (error) {
    console.error(
      "❌ Error sending SMS via TextBee:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};
