import {Orders} from '../orders';

// Example usage:
const orders = new Orders('YOUR_ACCESS_TOKEN');

// Example order for market buy
const marketOrder = {
  AccountID: '123456782',
  Symbol: 'MSFT',
  Quantity: '10',
  OrderType: 'Market',
  TradeAction: 'BUY',
  TimeInForce: {
    Duration: 'DAY',
  },
  Route: 'Intelligent',
};

// Confirm the market order
orders.confirmOrder(marketOrder)
  .then(confirmations => {
    console.log('Order Confirmations:', confirmations);
  })
  .catch(error => console.error('Error confirming order:', error));




// Example group order
const groupOrder = {
  Type: 'OCO',
  Orders: [
    {
      AccountID: '123456782',
      StopPrice: '337',
      OrderType: 'StopMarket',
      Quantity: '10',
      Route: 'Intelligent',
      Symbol: 'MSFT',
      TimeInForce: {
        Duration: 'GTC',
      },
      TradeAction: 'Buy',
    },
    {
      AccountID: '123456782',
      StopPrice: '333',
      OrderType: 'StopMarket',
      Quantity: '10',
      Route: 'Intelligent',
      Symbol: 'MSFT',
      TimeInForce: {
        Duration: 'GTC',
      },
      TradeAction: 'SellShort',
    },
  ],
};

// Confirm the group order
orders.confirmGroupOrder(groupOrder)
  .then(confirmations => {
    console.log('Group Order Confirmations:', confirmations);
  })
  .catch(error => console.error('Error confirming group order:', error));



// Example group order to place
const groupOrderToPlace = {
  Type: 'OCO',
  Orders: [
    {
      AccountID: '123456782',
      StopPrice: '337',
      OrderType: 'StopMarket',
      Quantity: '10',
      Route: 'Intelligent',
      Symbol: 'MSFT',
      TimeInForce: {
        Duration: 'GTC',
      },
      TradeAction: 'Buy',
    },
    {
      AccountID: '123456782',
      StopPrice: '333',
      OrderType: 'StopMarket',
      Quantity: '10',
      Route: 'Intelligent',
      Symbol: 'MSFT',
      TimeInForce: {
        Duration: 'GTC',
      },
      TradeAction: 'SellShort',
    },
  ],
};

// Place the group order
orders.placeGroupOrder(groupOrderToPlace)
  .then(orderResponses => {
    console.log('Group Order Responses:', orderResponses);
  })
  .catch(error => console.error('Error placing group order:', error));



// Example order to place
const orderToPlace = {
  "AccountID": "123456782",
  "Symbol": "MSFT",
  "Quantity": "10",
  "OrderType": "Market",
  "TradeAction": "BUY",
  "TimeInForce": {
    "Duration": "DAY"
  },
  "Route": "Intelligent"
};

// Place the general order
orders.placeOrder(orderToPlace)
  .then(orderResponses => {
    console.log('Order Responses:', orderResponses);
  })
  .catch(error => console.error('Error placing order:', error));


  const orderIDToReplace = '123456789';

// Example replacement order
const replacementOrder = {
  "Quantity": "10",
  "LimitPrice": "135.00"
};

// Replace the order
orders.replaceOrder(orderIDToReplace, replacementOrder)
  .then(orderResponse => {
    console.log('Order Replacement Response:', orderResponse);
  })
  .catch(error => console.error('Error replacing order:', error));



// Get activation triggers
orders.getActivationTriggers()
.then(activationTriggers => {
  console.log('Activation Triggers:', activationTriggers);
})
.catch(error => console.error('Error getting activation triggers:', error));



// Get routes
orders.getRoutes()
  .then(routes => {
    console.log('Routes:', routes);
  })
  .catch(error => console.error('Error getting routes:', error));
