/**
 * @fileoverview
 * This file contains the implementation of the Accounts class that interacts with the TradeStation API.
 * It utilizes the OpenAPI specification version 3.0.3.
 *
 * @description
 * # Authentication
 * For more information on authorization and gaining an access/refresh token,
 * please visit: [Authentication](/docs/fundamentals/authentication/auth-overview).
 * <SecurityDefinitions />
 *
 * @version V3
 *
 * @termsOfService
 * [TradeStation API Guidelines for Acceptance](http://elasticbeanstalk-us-east-1-525856068889.s3.amazonaws.com/wp-content/uploads/2014/03/Guidelines_For_Acceptance.pdf)
 *
 * @contact
 * - Name: TradeStation API Team
 * - Email: ClientServices@tradestation.com
 * - URL: [TradeStation API Developer Portal](https://developer.tradestation.com/webapi)
 *
 * @license
 * - Name: Services Agreement For Application Developers
 * - URL: [Agreement for WebAPI Developers](https://s3.amazonaws.com/elasticbeanstalk-us-east-1-525856068889/wp-content/uploads/2016/02/Agreement-for-WebAPI-Developers_v5C.pdf)
 *
 * @server
 * - URL: https://api.tradestation.com
 */
const axios = require('axios');
const {currentESTTime, isSubStr} = require('../renderer/util');
const { ipcRenderer } = require("electron");
class Accounts {
  constructor(accessToken) {
    this.baseUrl = 'https://api.tradestation.com/v3/brokerage';
    this.accessToken = accessToken;
    this.isRefreshingToken = false;
    // streams
    this.allStreams = {};
  }

  info(msg=""){
    console.log(`${currentESTTime()} Accounts [INFO] - ${msg}`)
  }

  error(msg=""){
    console.error(`${currentESTTime()} Accounts [ERROR] - ${msg}`)
  }

  timestamp_UTC2EST(timestamp){
    return new Date(timestamp).toLocaleString("en-US", {timeZone: "America/New_York"});
  }

  killAllStreams(){
    this.info("Killing All Open Streams In MarketData.")
    for (const key in this.allStreams) {
      if (this.allStreams?.[key]) {
        this.allStreams[key].abort();//.cancel();
        delete this.allStreams[key];
      }
    }
  }

  killAllStreamsById(id){
    this.info("Killing All Open Streams In MarketData.")
    for (const key in this.allStreams) {
      if (isSubStr(key, id)) {
        this.allStreams[key].abort();//.cancel();
        delete this.allStreams[key];
      }
    }
  }

  killStreamByKey(key) {
    if (this.allStreams?.[key]) {
      this.allStreams[key].abort();//.cancel();
      delete this.allStreams[key];
    }
  }

  async refreshToken(){
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      ipcRenderer.send('getRefreshToken');
      ipcRenderer.on('sendRefreshToken', (event, arg) => {
        const accessToken = arg.ts?.access_token;
        if (typeof accessToken === 'string'){
          if (this.accessToken !== accessToken) {
            this.info(`new refreshToken() length: ${accessToken.length}, Token: ${accessToken.slice(0, 5)}...${accessToken.slice(-5)})`);
          }
          this.accessToken = accessToken;
        }
        this.isRefreshingToken = false;
      });
    }
  }

  /**
   * Fetches the list of Brokerage Accounts available for the current user.
   * @returns {Promise<Array>} - Promise resolving to the list of brokerage accounts.
   */

  async getAccounts() {
    this.refreshToken();
    const url = `${this.baseUrl}/accounts`;
  
    return new Promise((resolve, reject) => {
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
      .then(response => {
        const accounts = response.data.Accounts;
        resolve(accounts);
      })
      .catch(error => {
        this.error(`getAccounts() - ${error}, ${this.accessToken}`);
        reject(error);
      });
    });
  }


/**
   * Fetches brokerage account balances for one or more given accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of account balances.
   */

getAccountBalancesAJAX(accountIDs){
  return {
    url: `${this.baseUrl}/accounts/${accountIDs}/balances`,
    dataSrc: 'Balances',
    type: 'GET',
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    }
  }
}

async getAccountBalances(accounts) {
  this.refreshToken();
  const url = `${this.baseUrl}/accounts/${accounts}/balances`;

  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
    .then(response => {
      const bal = response.data.Balances;
      resolve(bal);
    })
    .catch(error => {
      this.error(`getAccountBalances() - ${error}, ${this.accessToken}`);
      reject(error);
    });
  });
}

configBalances(arr){
  var newBalances = [];
  arr.forEach((obj)=>{
    newBalances.push(
      {
        ...obj,
        CashBalance: parseFloat(obj?.CashBalance),
        BuyingPower: parseFloat(obj?.BuyingPower),
        Equity: parseFloat(obj?.Equity),
        MarketValue: parseFloat(obj?.MarketValue),
        TodaysProfitLoss: parseFloat(obj?.TodaysProfitLoss),
        UnclearedDeposit: parseFloat(obj?.UnclearedDeposit),
        Commission: parseFloat(obj?.Commission),
      }
    );
  });
  return newBalances;
}

setAllAccountBalances(setter, accountIds){
  if (accountIds !== null || typeof accountIds !== 'undefined') {
    (async () => {
      try {
        const arr = await this.getAccountBalances(accountIds);
        setter(this.configBalances(arr));
      } catch (error) {
        this.error(`setAccountBalances() ${error}`);
      }
    })();
  }
}


setAccountBalances(setter, accountIds, type='Cash'){
  if (accountIds !== null || typeof accountIds !== 'undefined') {
    (async () => {
      try {
        const arr = await this.getAccountBalances(accountIds);
        if (type === '') {
          setter(arr[0]);
        } else {
          if (arr) {
            arr.forEach((obj, index)=>{
              if (obj.AccountType === type) {
                setter(obj);
                // break;
              }
            });
          } else {
            // setter(arr);
          }
        }
      } catch (error) {
        this.error(`setAccountBalances() ${error}`);
      }
    })();
  }
}

  /**
   * Fetches the Beginning of Day Balances for the given Accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of Beginning of Day Balances.
   */
  getBalancesBOD(accountIds) {
    const url = `${this.baseUrl}/accounts/${accountIds}/bodbalances`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then(response => response.data.BODBalances)
      .catch(error => {
        this.error(`getBalancesBOD() ${error}`);
      });
  }


 /**
   * Fetches Historical Orders for the given Accounts except open orders, sorted in descending order of time closed.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in a comma-separated format.
   * @param {string} since - Historical orders since date (format: "YYYY-MM-DD").
   * @param {number} pageSize - The number of requests returned per page when paginating responses (optional).
   * @param {string} nextToken - An encrypted token with a lifetime of 1 hour for use with paginated order responses (optional).
   * @returns {Promise<Object>} - Promise resolving to the historical orders.
   */
 getHistoricalOrders(accounts, since, pageSize, nextToken) {
  this.refreshToken();
  const url = `${this.baseUrl}/accounts/${accounts}/historicalorders`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
    params: {
      since,
      pageSize,
      nextToken,
    },
  })
    .then(response => response.data.Orders)
    .catch(error => {
      this.error(`getHistoricalOrders - ${error}`);
    });
}

formatHistoricalOrders(arr){
  var newArr = [];
  if (arr !== null) {
    arr.forEach((obj) => {
      const legs = obj?.Legs;
      newArr.push({
        ...obj,
        OpenedDateTime: this.timestamp_UTC2EST(obj?.OpenedDateTime),
        Symbol: legs ? legs[0].Symbol : ' - ',
        QuantityOrdered: legs ? legs[0].QuantityOrdered : '0',
        BuyOrSell: legs ? legs[0].BuyOrSell : ' - '
      });
    });
  } else {
    newArr = [];
  }
  newArr.sort((a, b) => parseInt(a.OrderID) - parseInt(b.OrderID))
  newArr.reverse();
  return newArr;
}

setHistoricalOrders(setter, accounts, since, pageSize, nextToken){
  if (accounts !== null) {
    (async () => {
      try {
        const past = await this.getHistoricalOrders(accounts, since, pageSize, nextToken);
        const today = await this.getOrders(accounts, pageSize, nextToken);
        const array = [...past, ...today];
        setter(this.formatHistoricalOrders(array));
      } catch (error) {
        this.error(`setHistoricalOrders() ${error}`);
      }
    })();
  }
}

setHistoricalOrdersBySymbol(setter, symbol, accounts, since, pageSize, nextToken){
  (async () => {
    try {
      const arr = await this.getHistoricalOrders(accounts, since, pageSize, nextToken);
      var filteredOrders = [];
      arr.forEach((obj)=>{
        const legSymbol = obj.Legs[0]?.Symbol;
        if (symbol === legSymbol){
          filteredOrders.push(obj);
        }
      });
      setter(arr);
    } catch (error) {
      this.error(`setHistoricalOrdersBySymbol() ${error}`);
    }
  })();
}

/**
   * Fetches Historical Orders for the given Accounts except open orders,
   * filtered by given Order IDs prior to the current date, sorted in descending order of time closed.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in a comma-separated format.
   * @param {string} orderIds - List of valid Order IDs for the authenticated user for given accounts in a comma-separated format.
   * @param {string} since - Historical orders since date.
   * @returns {Promise<Object>} - Promise resolving to the historical orders.
   */
  getHistoricalOrdersByOrderID(accounts, orderIds, since) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accounts}/historicalorders/${orderIds}?since=${since}`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching historical orders:', error);
        throw error;
      });
  }

  /**
   * Fetches today's orders and open orders for the given Accounts, sorted in descending order of time placed for open and time executed for closed.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in comma-separated format; for example "61999124,68910124".
   * @param {number} [pageSize=600] - The number of requests returned per page when paginating responses.
   * @param {string} [nextToken] - An encrypted token with a lifetime of 1 hour for use with paginated order responses.
   * @returns {Promise<Object>} - Promise resolving to the list of orders.
   */
  getOrders(accounts, pageSize, nextToken) {
    this.refreshToken();
    if (accounts !== null) {
      const url = `${this.baseUrl}/accounts/${accounts}/orders`;
      const params = {
        
        pageSize,
        nextToken,
      };
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params,
      })
        .then(response => response.data.Orders)
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
    }
  }

  setOrders(setter, accounts, pageSize, nextToken){
    if (accounts !== null) {
      (async () => {
        try {
          const arr = await this.getOrders(accounts, pageSize, nextToken);
          setter(this.formatHistoricalOrders(arr));
        } catch (error) {
          this.error(`setOrdersBySymbol() ${error}`);
        }
      })();
    }
  }

  setOrdersBySymbol(setter, symbol, accounts, pageSize, nextToken){
    if (accounts !== null) {
      (async () => {
        try {
          const arr = await this.getOrders(accounts, pageSize, nextToken);
          var filteredOrders = [];
          arr.forEach((obj)=>{
            const legSymbol = obj.Legs[0]?.Symbol;
            if (symbol === legSymbol){
              filteredOrders.push(obj);
            }
          });
          setter(filteredOrders);
        } catch (error) {
          this.error(`setOrdersBySymbol() ${error}`);
        }
      })();
    }
  }

 /**
   * Fetches today's orders and open orders for the given Accounts, filtered by given Order IDs.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @param {string} orderIds - List of valid Order IDs for the authenticated user for given accounts in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of orders.
   */
 getOrdersByOrderID(accountIds, orderIds) {
  const url = `${this.baseUrl}/accounts/${accountIds}/orders/${orderIds}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  })
    .then(response => response.data.Orders)
    .catch(error => {
      console.error('Error fetching orders:', error);
      throw error;
    });
}


  /**
   * Fetches positions for the given Accounts.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in a comma-separated format.
   * @param {string} [symbol] - List of valid symbols in a comma-separated format for filtering positions.
   * @returns {Promise<Array>} - Promise resolving to the list of positions.
   */

  getPositionsAJAX(accountIDs){
    return {
      url: `${this.baseUrl}/accounts/${accountIDs}/positions`,
      dataSrc: 'Positions',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
    }
  }

  async getPositions(accounts) {
    this.refreshToken();
    const url = `${this.baseUrl}/accounts/${accounts}/positions`;
  
    return new Promise((resolve, reject) => {
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
      .then(response => {
        const pos = response.data.Positions;
        resolve(pos);
      })
      .catch(error => {
        this.error(`getPositions() - ${error}, ${this.accessToken}`);
        reject(error);
      });
    });
  }


  setPostions(setter, accounts){
    (async () => {
      try {
        const arr = await this.getPositions(accounts);
        setter(arr);
      } catch (error) {
        this.error(`setPostions() ${error}`);
      }
    })();
  }

   /**
   * Fetches wallet information for a specific crypto account.
   * @param {string} accountID - The ID of the crypto account.
   * @returns {Promise<Array>} - Promise resolving to the list of wallets for the specified crypto account.
   */
   getWallets(accountID) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accountID}/wallets`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then(response => response.data.Wallets)
      .catch(error => {
        console.error('Error fetching wallets:', error);
        throw error;
      });
  }

  /**
   * Streams wallet information for the specified crypto account.
   * @param {string} account - A valid crypto Account ID for the authenticated user.
   * @returns {Promise<Stream>} - Promise resolving to the stream of wallet information.
   */
  streamWallets(account) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/stream/accounts/${account}/wallets`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/vnd.tradestation.streams.v2+json',
      },
      responseType: 'stream',
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Error streaming wallets:', error);
        throw error;
      });
  }

   /**
   * Streams orders for the given accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the streamed orders.
   */
  //  streamOrders(accountIds) {
  //   const url = `${this.baseUrl}/stream/accounts/${accountIds}/orders`;

  //   return axios.get(url, {
  //     headers: {
  //       Authorization: `Bearer ${this.accessToken}`,
  //     },
  //     responseType: 'stream', // To handle streaming response
  //   })
  //     .then(response => {
  //       // Handle the streamed data here
  //       response.data.on('data', data => {
  //         console.log(data.toString());
  //         // Process the streamed data as needed
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error streaming orders:', error);
  //       throw error;
  //     });
  // }



  async streamOrders(setter, streamIdPrefix, accountIds){
    const streamId = `${streamIdPrefix}${accountIds}`;
    console.log("in order stream func", streamId);

    if (!this.allStreams?.[streamId]) {
      this.refreshToken();
      try {
        const controller = new AbortController();
        const signal = controller.signal;
        const url = `${this.baseUrl}/stream/accounts/${accountIds}/orders`;
        const response = await fetch(url, {
          method: 'get',
          signal: signal,
          headers: {
            Authorization: `Bearer ${this.accessToken}`, // Replace with your actual access token
          },
        });
        const reader = response.body.getReader();
        this.allStreams[streamId] = controller;
        // Process the streaming data
        const processChunks = async () => {
          while (this.allStreams?.[streamId]) {
            try {
              const { done, value } = await reader.read();
              if (done || !this.allStreams?.[streamId]) {
                this.info(`Break ${streamIdPrefix}${accountIds}!`);
                break;
              }
              const jsonString = new TextDecoder().decode(value);
              const jsonData = JSON.parse(jsonString.trim());
              console.log("jsonData", typeof jsonData, jsonData);

              // setter(jsonData);
            } catch (error) {
              const msg = error.message.toLowerCase();
              if (isSubStr(msg, 'network')) {
                this.info("Network Error");
              }else if (isSubStr(msg, 'whitespace')){
                this.info("None-whitespace Error");
              } else {
                this.error(`streamOrders() while ${error}`);
              }
            }
          }
        };
        if (this.allStreams?.[streamId]) {
          processChunks();
        }else{
          this.info(`Killed stream for ${streamIdPrefix}${accountIds}.`)
        }
      } catch (error) {
        this.error(`streamOrders() - ${error}`);
      }
    } else {
      this.info(`${streamIdPrefix}${accountIds} is active.`)
    }
  }


   /**
   * Streams orders for the given accounts and orders.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @param {string} ordersIds - List of valid Order IDs for the account IDs in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of streamed orders.
   */
   streamOrdersByOrderId(accountIds, ordersIds) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/stream/accounts/${accountIds}/orders/${ordersIds}`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then(response => response.data.Orders)
      .catch(error => {
        console.error('Error streaming orders by order ID:', error);
        throw error;
      });
  }


  /**
   * Streams positions for the given accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma separated format.
   * @param {boolean} [changes=false] - A boolean value that specifies whether or not position updates are streamed as changes.
   * @returns {Promise<Array>} - Promise resolving to the streamed positions.
   */
  async streamPositions(tableCls, positionsArray, streamIdPrefix, accountIds, changes = false) {
    const streamId = `${streamIdPrefix}${accountIds}`;
    let positions = positionsArray; // initial Array containing the data.
    if (!this.allStreams?.[streamId]) {
      this.refreshToken();
      try {
        const controller = new AbortController();
        const signal = controller.signal;

        const params = new URLSearchParams({
          changes: String(changes),
        }).toString();

        const url = `${this.baseUrl}/stream/accounts/${accountIds}/positions?${params}`;
        const response = await fetch(url, {
          method: 'get',
          signal: signal,
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

          const reader = response.body.getReader();
          this.allStreams[streamId] = controller;
          const processChunks = async () => {
            while (this.allStreams?.[streamId]) {
              try {
                const { done, value } = await reader.read();
                if (done || !this.allStreams?.[streamId]) {
                  this.info(`Breaking stream for ${streamId}...`);
                  break;
                }
                const jsonString = new TextDecoder().decode(value);
                const jsonData = JSON.parse(jsonString.trim());
                if (jsonData?.Symbol) {
                  // If it isnt in positions add it and return
                  let symbolInPositions = false;
                  positions.forEach((pos)=>{
                    if (pos?.Symbol === jsonData?.Symbol) {
                      symbolInPositions = true;
                    }
                  });
                  if (!symbolInPositions) {
                    positions.push(jsonData);
                  }else{
                    // if the symbol is in positions replace.
                    let newPositions = [];
                    positions.forEach((pos, i)=>{
                      if (pos?.Symbol != jsonData?.Symbol) {
                        newPositions.push(pos);
                      }
                    });
                    newPositions.push(jsonData);
                    positions = newPositions;
                  }
                  tableCls.setStreamData(tableCls, positions);
                }
                
              } catch (error) {
                const msg = error.message.toLowerCase();
                if (isSubStr(msg, 'network')) {
                  this.info("Network Error");
                  await this.delay(1000 * 5);
                }else if (isSubStr(msg, 'whitespace')){
                  this.info("None-whitespace Error");
                }else if (isSubStr(msg, 'syntaxerror')) {
                  this.info("SyntaxError");
                } else {
                  this.error(`streamPositions() while ${error}`);
                }
              }
            }
          };

          if (this.allStreams?.[streamId]) {
            processChunks();
          }else{
            this.info(`Killed stream for ${symbol}.`)
          }
      } catch (error) {
        this.error(`streamBars() - ${error}`);
      }
    } else {
      this.info(`${symbol} stream already active.`)
    }
  }


}

module.exports = {Accounts: Accounts}
