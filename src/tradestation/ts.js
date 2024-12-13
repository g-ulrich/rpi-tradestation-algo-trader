const {TSEndpoints} = require('./endpoints');
const { currentESTDatetime } = require('../renderer/util');
const {Accounts} = require('./accounts');
const {MarketData} = require('./marketData');
const {Orders} = require('./orders');
const {Symbols} = require('./symbols');
const { ipcRenderer } = require("electron");

class TS {
  constructor() {
    this.endpoints = new TSEndpoints();
    // this.refreshToken();
    this.token = null;
    // Nested Classes
    this.account = null;
    this.marketData = null;
    this.order = null;
    this.symbol = null;
  }

  info(msg=""){
    console.log(`${currentESTDatetime()} TS [INFO] - ${msg}`)
  }

  error(msg=""){
    console.error(`${currentESTDatetime()} TS [ERROR] - ${msg}`)
  }

  refreshClasses(accessToken){
    this.info(`TS Classes (token: ${typeof accessToken === 'string' ? 'success': 'failure'}, length: ${accessToken?.length}, Token: ${accessToken?.slice(0, 5)}...${accessToken?.slice(-5)})`);
    if (this.account === null) {
      this.account = new Accounts(accessToken);
      this.marketData = new MarketData(accessToken);
      this.order = new Orders(accessToken);
      this.symbol = new Symbols(accessToken);
    } else {
      this.account.accessToken = accessToken;
      this.marketData.accessToken = accessToken;
      this.order.accessToken = accessToken;
      this.symbol.accessToken = accessToken;
    }
  }

//   async refreshToken(){
//     ipcRenderer.send('getRefreshToken');
//     ipcRenderer.on('sendRefreshToken', (event, arg) => {
//        this.token = arg.ts;
//       this.refreshClasses(this.token?.access_token)
//     });
//   }
async refreshToken() {
  try {
    // Wait for the refresh token to be received
    const refreshToken = await new Promise((resolve, reject) => {
      ipcRenderer.once('sendRefreshToken', (event, arg) => {
        if (arg && arg.ts) {
          resolve(arg.ts); // Resolve the promise with the token
        } else {
          reject(new Error("Failed to receive a valid token"));
        }
      });

      // Send the request to get the refresh token
      ipcRenderer.send('getRefreshToken');
    });

    // Now that the token is received, update the token and refresh classes
    this.token = refreshToken;
    this.refreshClasses(this.token?.access_token);
  } catch (error) {
    this.error(`Error in refreshToken: ${error.message}`);
  }
}

}

module.exports = {
  TS:TS
}
