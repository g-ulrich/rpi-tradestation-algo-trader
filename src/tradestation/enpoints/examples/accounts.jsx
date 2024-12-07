import {Accounts} from '../accounts';


// Example usage:
const accounts = new Accounts('YOUR_ACCESS_TOKEN');

// Fetch brokerage accounts
accounts.getAccounts()
  .then(accounts => {
    console.log('Brokerage Accounts:', accounts);
  })
  .catch(error => console.error('Error fetching accounts:', error));



// Fetch account balances for specified account IDs
const accountIds = '61999124,68910124';
accounts.getAccountBalances(accountIds)
  .then(balances => {
    console.log('Account Balances:', balances);
  })
  .catch(error => console.error('Error fetching account balances:', error));


// Fetch Beginning of Day Balances
accounts.getBalancesBOD('61999124,68910124')


// Fetch historical orders
orders.getHistoricalOrders('61999124,68910124', '2006-01-13')
  .then(historicalOrders => {
    console.log('Historical Orders:', historicalOrders);
  })
  .catch(error => console.error('Error fetching historical orders:', error));



// Fetch historical orders by order IDs
orders.getHistoricalOrdersByOrderID('61999124,68910124', '123456789,6B29FC40-CA47-1067-B31D-00DD010662DA', '2006-01-13')
.then(historicalOrders => {
  console.log('Historical Orders:', historicalOrders);
})
.catch(error => console.error('Error fetching historical orders:', error));

Please replace 'YOUR_ACCESS_TOKEN' with your actual access token when creating



// Fetch today's orders and open orders
accounts.getOrders('61999124,68910124')
  .then(orders => {
    console.log('Orders:', orders);
  })
  .catch(error => console.error('Error fetching orders:', error));




// Fetch orders by order ID
accounts.getOrdersByOrderID('61999124,68910124', '123456789,6B29FC40-CA47-1067-B31D-00DD010662DA')
.then(orders => {
  console.log('Orders:', orders);
})
.catch(error => console.error('Error fetching orders:', error));



// Fetch positions for specific accounts
accounts.getPositions('61999124,68910124')
  .then(positions => {
    console.log('Positions:', positions);
  })
  .catch(error => console.error('Error fetching positions:', error));



// Fetch wallet information for a crypto account
accounts.getWallets('61999124C')
  .then(wallets => {
    console.log('Wallet Information:', wallets);
  })
  .catch(error => console.error('Error fetching wallets:', error));



// Stream wallet information
const cryptoAccount = '61999124C';
accounts.streamWallets(cryptoAccount)
  .then(stream => {
    // Handle the stream data
    stream.on('data', data => {
      console.log(data.toString());
    });
  })
  .catch(error => console.error('Error streaming wallets:', error));



// Stream orders
const accountIds = '61999124,68910124'; // Replace with your account IDs
accounts.streamOrders(accountIds)
  .catch(error => console.error('Error streaming orders:', error));



// Stream orders by account and order IDs
accounts.streamOrdersByOrderId('61999124,68910124', '812767578,812941051')
.then(orders => {
  console.log('Streamed Orders:', orders);
})
.catch(error => console.error('Error streaming orders by order ID:', error));


// Example usage of streaming positions
const accountIds = '61999124,68910124';
accounts.streamPositions(accountIds, true)
  .then(positions => {
    console.log('Streamed Positions:', positions);
  })
  .catch(error => console.error('Error streaming positions:', error));
