
import {MarketData} from '../marketData';

// Example usage:
const marketData = new MarketData('YOUR_ACCESS_TOKEN');

// Fetch Bars
marketData.getBars('MSFT', '1', 'Daily', '5')
  .then(response => console.log('Bars:', response))
  .catch(error => console.error('Error fetching bars:', error));

// Stream Bars
marketData.streamBars('MSFT', '1', 'Daily', '5')
  .then(response => {
    response.data.on('data', chunk => console.log('Streamed Bar:', chunk.toString()));
  })
  .catch(error => console.error('Error streaming bars:', error));


// Fetch Crypto Symbol Names
marketData.getCryptoSymbolNames()
.then(symbolNames => console.log('Crypto Symbol Names:', symbolNames))
.catch(error => console.error('Error fetching crypto symbol names:', error));

// Fetch Symbol Details
marketData.getSymbolDetails('MSFT,BTCUSD')
.then(symbolDetails => console.log('Symbol Details:', symbolDetails))
.catch(error => console.error('Error fetching symbol details:', error));



// Get Option Expirations
marketData.getOptionExpirations('AAPL', 150)
  .then(expirations => console.log('Option Expirations:', expirations))
  .catch(error => console.error('Error fetching option expirations:', error));

// Get Option Risk Reward
const riskRewardInput = {
  SpreadPrice: 0.24,
  Legs: [
    { Symbol: 'AAPL 211217C150', Quantity: 1, TradeAction: 'BUY' },
    { Symbol: 'AAPL 211217C152.5', Quantity: 1, TradeAction: 'SELL' },
    { Symbol: 'AAPL 211217C155', Quantity: 1, TradeAction: 'SELL' },
    { Symbol: 'AAPL 211217C157.5', Quantity: 1, TradeAction: 'BUY' },
  ],
};

marketData.getOptionRiskReward(riskRewardInput)
  .then(riskRewardResult => console.log('Option Risk vs. Reward Analysis:', riskRewardResult))
  .catch(error => console.error('Error analyzing option risk vs. reward:', error));



// Get Option Spread Types
marketData.getOptionSpreadTypes()
  .then(spreadTypes => console.log('Option Spread Types:', spreadTypes))
  .catch(error => console.error('Error fetching option spread types:', error));

// Get Option Strikes
marketData.getOptionStrikes('AAPL', 'Butterfly', 2, '12-17-2021', '12-18-2021')
  .then(optionStrikes => console.log('Option Strikes:', optionStrikes))
  .catch(error => console.error('Error fetching option strikes:', error));


// Stream Option Chain
marketData.streamOptionChain('AAPL', '2021-12-17')
.then(response => {
  response.data.on('data', chunk => console.log('Streamed Option Chain:', chunk.toString()));
})
.catch(error => console.error('Error streaming option chain:', error));

// Stream Option Quotes
marketData.streamOptionQuotes('MSFT 220916C305')
.then(response => {
  response.data.on('data', chunk => console.log('Streamed Option Quotes:', chunk.toString()));
})
.catch(error => console.error('Error streaming option quotes:', error));



// Get Quote Snapshots
marketData.getQuoteSnapshots('MSFT,BTCUSD')
  .then(response => console.log('Quote Snapshots:', response.data))
  .catch(error => console.error('Error getting quote snapshots:', error));

// Stream Quote Changes
marketData.streamQuoteChanges('MSFT,BTCUSD')
  .then(response => {
    response.data.on('data', chunk => console.log('Streamed Quote Changes:', chunk.toString()));
  })
  .catch(error => console.error('Error streaming quote changes:', error));



// Stream Market Depth Quotes
marketData.streamMarketDepthQuotes('AAPL')
.then(response => {
  response.data.on('data', chunk => console.log('Streamed Market Depth Quotes:', chunk.toString()));
})
.catch(error => console.error('Error streaming market depth quotes:', error));

// Stream Market Depth Aggregates
marketData.streamMarketDepthAggregates('AAPL')
.then(response => {
  response.data.on('data', chunk => console.log('Streamed Market Depth Aggregates:', chunk.toString()));
})
.catch(error => console.error('Error streaming market depth aggregates:', error));
