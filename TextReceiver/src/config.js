// Configuration manager for the application
require('dotenv').config();

const config = {
  // Default to offline mode if not specified
  mode: process.env.MODE || 'offline',
  
  // Twilio configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  }
};

/**
 * Set the API mode to online or offline
 * @param {string} mode - 'online' or 'offline'
 */
const setMode = (mode) => {
  if (mode !== 'online' && mode !== 'offline') {
    throw new Error('Mode must be either "online" or "offline"');
  }
  config.mode = mode;
  console.log(`API mode set to: ${mode}`);
  return config.mode;
};

/**
 * Get the current API mode
 * @returns {string} The current mode ('online' or 'offline')
 */
const getMode = () => {
  return config.mode;
};

/**
 * Check if the API is in online mode
 * @returns {boolean} True if online, false if offline
 */
const isOnline = () => {
  return config.mode === 'online';
};

module.exports = {
  config,
  setMode,
  getMode,
  isOnline
};