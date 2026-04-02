import axios from 'axios';

/**
 * Konfigurerad Axios-instans för API requests
 *
 * Den här modulen exporterar en förkonfigurerad Axios-instans för att göra HTTP-requests
 * till vårt backend-API. Konfigurationen ser till att:
 *
 * 1. Alla requests riktas till korrekt API-bas-URL
 * 2. Inloggningsuppgifter (cookies) ingår i varje request
 * 3. Korrekt headers är inställda
 *
 * Att använda denna förkonfigurerade instans hjälper till att upprätthålla konsistens överallt
 * alla API-förfrågningar i applikationen och centraliserar konfigurationen.
 */

/**
 * Configured Axios instance
 *
 * @property {string} baseURL - Base URL for all API requests
 * @property {boolean} withCredentials - Ensures cookies are sent with requests
 * @property {Object} headers - Default headers for all requests
 */


const api = axios.create({
  baseURL: 'https://hmybudget-production-0120.up.railway.app', // Ändra till din backend-URL
  withCredentials: true, // Inkludera cookies i varje request
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (response ) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. clear any local authentication state (e.g., tokens, user info)
      localStorage.removeItem('user'); // Exempel på att ta bort en token
      // 2. redirect to login page
      window.location.href = '/login'; // Ändra till din login-sida
    }
    return Promise.reject(error);
  }
);




export default api;

//