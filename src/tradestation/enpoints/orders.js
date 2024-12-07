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
const { ipcRenderer } =require("electron");

class Orders {
  constructor(accessToken) {
    this.baseUrl = 'https://api.tradestation.com/v3/orderexecution'; // Update with the correct base URL
    this.accessToken = accessToken;
    this.isRefreshingToken = false;
  }

  info(msg=""){
    console.log(`${currentESTTime()} Orders [INFO] - ${msg}`)
  }

  error(msg=""){
    console.error(`${currentESTTime()} Orders [ERROR] - ${msg}`)
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
   * Confirm an order without placing it.
   * @param {Object} order - The order details.
   * @returns {Promise<Array>} - Promise resolving to the order confirmations.
   */
  confirmOrder(order) {
    const url = `${this.baseUrl}/orderconfirm`;

    return axios.post(url, order, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.data.Confirmations)
      .catch(error => {
        console.error('Error confirming order:', error);
        throw error;
      });
  }


/**
   * Confirm a group order.
   * @param {Object} groupOrder - The group order details.
   * @returns {Promise<Array>} - Promise resolving to the order confirmations.
   */
confirmGroupOrder(groupOrder) {
  const url = `${this.baseUrl}/ordergroupconfirm`;

  return axios.post(url, groupOrder, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.data.OrderConfirmResponses)
    .catch(error => {
      console.error('Error confirming group order:', error);
      throw error;
    });
}


/**
   * Place a group order.
   * @param {Object} groupOrder - The group order details.
   * @returns {Promise<Array>} - Promise resolving to the order responses.
   */
placeGroupOrder(groupOrder) {
  const url = `${this.baseUrl}/ordergroups`;

  return axios.post(url, groupOrder, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.data.Orders)
    .catch(error => {
      console.error('Error placing group order:', error);
      throw error;
    });
}

/**
   * Place a general order.
   * @param {Object} order - The order details.
   * @returns {Promise<Array>} - Promise resolving to the order responses.
   */

_simple(accountId, orderType, quantity, symbol, timeInForce, action){
  if (
    accountId === undefined ||
    orderType === undefined ||
    quantity === undefined ||
    symbol === undefined ||
    timeInForce === undefined ||
    action === undefined
    ) {
    return null;
  }else{
    const order = {
      AccountID: accountId,
      Symbol: symbol,
      Quantity: quantity.toString(),
      OrderType: orderType,
      TradeAction: action.toUpperCase(),
      TimeInForce:
      {
          Duration: timeInForce
      },
      // "Route": "Intelligent"
    }
    console.log("Order blob", order);
    return order;
  }
}

placeOrder(order) {
  this.refreshToken();
  try {
    const url = `${this.baseUrl}/orders`;
    return axios.post(url, order, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.data.Orders)
      .catch(error => {
        console.error('Error placing order:', error);
        throw error;
      });
  } catch (error) {
    this.error(`placeOrder() - ${error}`)
  }
}

/**
   * Replace an active order with a modified version of that order.
   * @param {string} orderID - The OrderID for the order to replace.
   * @param {Object} replacementOrder - The modified order details.
   * @returns {Promise<Object>} - Promise resolving to the order response.
   */
replaceOrder(orderID, replacementOrder) {
  const url = `${this.baseUrl}/orders/${orderID}`;

  return axios.put(url, replacementOrder, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error replacing order:', error);
      throw error;
    });
}

/**
   * Get activation triggers for placing orders.
   * @returns {Promise<Array>} - Promise resolving to the activation triggers.
   */
getActivationTriggers() {
  const url = `${this.baseUrl}/activationtriggers`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  })
    .then(response => response.data.ActivationTriggers)
    .catch(error => {
      console.error('Error getting activation triggers:', error);
      throw error;
    });
}

 /**
   * Get a list of valid routes that a client can specify when posting an order.
   * @returns {Promise<Array>} - Promise resolving to the list of routes.
   */
 getRoutes() {
  const url = `${this.baseUrl}/routes`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  })
    .then(response => response.data.Routes)
    .catch(error => {
      console.error('Error getting routes:', error);
      throw error;
    });
}



}

module.exports = {Orders:Orders}