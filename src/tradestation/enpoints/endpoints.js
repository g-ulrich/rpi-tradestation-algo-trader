

class TSEndpoints {
    constructor() {
      // Base URL for TradeStation API
      this.baseURL = 'https://api.tradestation.com/v2/';
      this.signinURL = 'https://signin.tradestation.com/';
      this.apiURL = 'https://api.tradestation.com';
      this.callbackURL = 'http://localhost';
      this.tokenBaseURL = `${this.signinURL}oauth/token`;
    }

    getAuth(clientId){
        // for redirect
        // https://api.tradestation.com/docs/fundamentals/authentication/auth-code
        const scope = "openid offline_access profile MarketData ReadAccount Trade Crypto Matrix OptionSpreads";
        return `${this.signinURL}authorize?response_type=code&client_id=${clientId}&redirect_uri=${this.callbackURL}&audience=${this.apiURL}&scope=${scope}`;
    }

    // Method to get market data endpoint
    getMarketData(symbol, timeframe) {
      // Example market data endpoint with parameters
      return `${this.baseURL}marketdata/symbols?symbol=${symbol || 'AAPL'}&timeframe=${timeframe || '1d'}`;
    }

    // Method to get account information endpoint
    getAccountInformation() {
      return `${this.baseURL}accounts`;
    }

    // Method to get position information endpoint
    getPositionInformation(accountId) {
      return `${this.baseURL}accounts/${accountId}/positions`;
    }

    // Method to get orders information endpoint
    getOrdersInformation(accountId) {
      return `${this.baseURL}accounts/${accountId}/orders`;
    }

    // Method to get trades information endpoint
    getTradesInformation(accountId) {
      return `${this.baseURL}accounts/${accountId}/trades`;
    }

    // Method to get crypto information endpoint
    getCryptoInformation(accountId) {
      return `${this.baseURL}accounts/${accountId}/crypto`;
    }

    // Add more methods for other common endpoints as needed
   }

module.exports = {TSEndpoints:TSEndpoints}
