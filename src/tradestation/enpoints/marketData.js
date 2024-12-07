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
const axios =require('axios');
const {currentESTTime, isSubStr, inArray}  =require('../../renderer/util');
const { ipcRenderer }  =require("electron");


class MarketData {
  constructor(accessToken) {
    this.ts = window.ts;
    this.baseUrl = 'https://api.tradestation.com/v3/marketdata';
    this.accessToken = accessToken;
    this.isRefreshingToken = false;
    // stream
    this.allStreams = {};
  }

  info(msg=""){
    console.log(`${currentESTTime()} MarketData [INFO] - ${msg}`)
  }

  error(msg=""){
    console.error(`${currentESTTime()} MarketData [ERROR] - ${msg}`)
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

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  localEpochToGMT(epoch){
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // -5 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
    return (epoch - timezoneOffset)/1000;
  }
  epoch_UTC2EST(epoch){
    return parseInt(new Date(epoch).getTime() + ((-5 * 60) * 60 * 1000));
  }

  timestamp_UTC2EST(timestamp){
    // Parse the input date string
  const date = new Date(timestamp);

  return date.toLocaleString();
    // return new Date(timestamp).toLocaleString("en-US", {timeZone: "America/New_York"});
  }



  formatBar(bar){
    return {
      time: bar.Epoch,
      open: bar.Open,
      high: bar.High,
      low: bar.Low,
      close: bar.Close,
      volume: bar.TotalVolume,
      // for volume bars
      value: bar.TotalVolume,
      color: bar.Close < bar.Open
            ? "rgba(114, 137, 218, .2)" // primary
            : "rgba(11, 150, 87, .2)" // success
    }
  }

  bars2Candles(bars){
    var newBars = [];
    bars.forEach((bar)=>{
      if (bar.Close !== 0){
        newBars.push(this.formatBar(bar));
      }
    });
    return newBars;
  }

  fixBar(bar){
    return {
      ...bar,
      Close: parseFloat(bar.Close),
      High: parseFloat(bar.High),
      Low: parseFloat(bar.Low),
      Open: parseFloat(bar.Open),
      TotalVolume: parseInt(bar.TotalVolume),
      Epoch: this.localEpochToGMT(bar.Epoch), // / 1000,
      TimeStamp: this.timestamp_UTC2EST(bar.TimeStamp),
    }
  }

  /**
   * Fetches marketdata bars for the given symbol, interval, and timeframe.
   * @param {string} symbol - The valid symbol string.
   * @param {string} [interval='1'] - Interval that each bar will consist of.
   * @param {string} [unit='Daily'] - Unit of time for each bar interval. Minute, Daily, Weekly, Monthly
   * @param {string} [barsback='1'] - Number of bars back to fetch.
   * @param {string} [firstdate] - The first date formatted as 'YYYY-MM-DD 2020-04-20T18:00:00Z'. - no default
   * @param {string} [lastdate] - The last date formatted as 'YYYY-MM-DD 2020-04-20T18:00:00Z'. - Defaults to current timestamp
   * @param {string} [sessiontemplate='Default'] - United States (US) stock market session templates. USEQPre, USEQPost, USEQPreAndPost, USEQ24Hour,Default.
   * @returns {Promise<object>} - Promise resolving to the fetched marketdata bars.
   */
  async getBars(symbol, params) {
    this.refreshToken();
    const interval = params?.interval || '1';
    const unit = params?.unit || 'Daily';
    const barsback = params?.barsback || '1';
    const firstdate = params?.firstdate || '';
    const lastdate = params?.lastdate || new Date().toISOString();
    const sessiontemplate = params?.sessiontemplate || 'Default';

    const url = `${this.baseUrl}/barcharts/${symbol}`;
    const options = {
      params: {
        interval,
        unit,
        barsback,
        // firstdate,
        // lastdate,
        sessiontemplate,
      },
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    try {
      const response = await axios.get(url, options);
      const bars = response.data.Bars;

      const newBars = bars.map((bar)=>{
        return this.fixBar(bar);
      });
      return newBars;
    } catch (error) {
      this.error(`getBars() - ${error}`);
      throw error;
    }
  }

  async getBarsByLastDate(symbol, params) {
    this.refreshToken();
    const url = `${this.baseUrl}/barcharts/${symbol}`;
    const options = {
      params: {
        interval: params?.interval || '1',
        unit: params?.unit || 'Daily',
        barsback: params?.barsback || '1',
        // firstdate,
        lastdate: params?.lastdate || new Date().toISOString(),
        sessiontemplate: params?.sessiontemplate || 'Default'
      },
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
    try {
      const response = await axios.get(url, options);
      const bars = response.data.Bars;

      const newBars = bars.map((bar)=>{
        return this.fixBar(bar);
      });
      return newBars;
    } catch (error) {
      this.error(`getBarsByLastDate() - ${error}`);
      throw error;
    }
  }

  setBars(setter, symbol, params){
    (async () => {
      try {
        const arr = await this.getBars(symbol, params);
        setter(arr);
      } catch (error) {
        this.error(`setBars() ${error}`);
      }
    })();
  }

  setCandles(setter, symbol, params){
    (async () => {
      try {
        const arr = await this.getBars(symbol, params);
        setter(this.bars2Candles(arr));
      } catch (error) {
        this.error(`setBars() ${error}`);
      }
    })();
  }

  /**
   * Streams marketdata bars for the given symbol, interval, and timeframe.
   * @param {string} symbol - The valid symbol string.
   * @param {string} [interval='1'] - Interval that each bar will consist of.
   * @param {string} [unit='Daily'] - Unit of time for each bar interval.
   * @param {string} [barsback='1'] - The bars back.
   * @param {string} [sessiontemplate] - United States (US) stock market session templates.
   * @returns {Promise<Stream>} - Promise resolving to the streamed marketdata bars.
   */

    updateVolume(ref, bar, upColor, downColor){
      ref.current?.update({
        time: bar.time,
        value: bar.volume,
        color:
          bar.open > bar.close
            ? downColor || '#7289DA'
            : upColor || 'rgb(87,242,135)',
      });
    }

    async streamBars(chart, streamIdPrefix, symbol, params){
      const streamId = `${streamIdPrefix}${symbol}`;
      if (!this.allStreams?.[streamId]) {
        this.refreshToken();
        try {
          const controller = new AbortController();
          const signal = controller.signal;

          const urlParams = new URLSearchParams(params).toString();

          const url = `${this.baseUrl}/stream/barcharts/${symbol}?${urlParams}`;
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
                  this.info(`Breaking stream for ${symbol}...`);
                  break;
                }
                const jsonString = new TextDecoder().decode(value);
                const jsonData = JSON.parse(jsonString.trim());
                const newBar = this.fixBar(jsonData);
                chart.setNextStreamBar(this.formatBar(newBar));

              } catch (error) {
                const msg = error.message.toLowerCase();
                if (isSubStr(msg, 'network')) {
                  this.info("Network Error");
                  await this.delay(1000 * 5);
                }else if (isSubStr(msg, 'whitespace')){
                  this.info("None-whitespace Error");
                } else {
                  this.error(`streamBars() while ${error}`);
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

  /**
 * Fetches all crypto Symbol Names information.
 * @returns {Promise<Array<string>>} - Promise resolving to an array of crypto symbol names.
 */
async getCryptoSymbolNames() {
  const url = `${this.baseUrl}/symbollists/cryptopairs/symbolnames`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data.SymbolNames;
  } catch (error) {
    throw new Error(`Error fetching crypto symbol names: ${error.message}`);
  }
}

/**
 * Fetches symbol details and formatting information for one or more symbols.
 * @param {string} symbols - List of valid symbols in comma-separated format (e.g., "MSFT,BTCUSD").
 * @returns {Promise<object>} - Promise resolving to the symbol details response.
 */
async getSymbolDetails(symbols) {
  this.refreshToken();
  const url = `${this.baseUrl}/symbols/${symbols}`;
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
  })
    .then(response => response.data.Symbols)
    .catch(error => {
      this.error(`getSymbolDetails() - ${error}`);
      throw error;
    });
}

setSymbolDetails(setter, symbols){
  (async () => {
    try {
      const arr = await this.getSymbolDetails(symbols);
      setter(arr);
      // console.log(arr);
    } catch (error) {
      this.error(`setSymbolDetails() ${error}`);
    }
  })();
}

/**
 * Get the available option contract expiration dates for the underlying symbol.
 * @param {string} underlying - The symbol for the underlying security.
 * @param {number} [strikePrice] - Strike price (optional).
 * @returns {Promise<Array<object>>} - Promise resolving to an array of option expirations.
 */
async getOptionExpirations(underlying, strikePrice = null) {
  const url = `${this.baseUrl}/options/expirations/${underlying}`;
  const params = strikePrice ? { strikePrice } : {};

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      params,
    });

    return response.data.Expirations;
  } catch (error) {
    throw new Error(`Error fetching option expirations: ${error.message}`);
  }
}

/**
 * Analyze the risk vs. reward of a potential option trade.
 * @param {object} riskRewardInput - Risk vs. reward analysis input.
 * @returns {Promise<object>} - Promise resolving to the risk vs. reward analysis result.
 */
async getOptionRiskReward(riskRewardInput) {
  const url = `${this.baseUrl}/options/riskreward`;

  try {
    const response = await axios.post(url, riskRewardInput, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error analyzing option risk vs. reward: ${error.message}`);
  }
}


/**
 * Get the available spread types for option chains.
 * @returns {Promise<Array<object>>} - Promise resolving to an array of option spread types.
 */
async getOptionSpreadTypes() {
  const url = `${this.baseUrl}/options/spreadtypes`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data.SpreadTypes;
  } catch (error) {
    throw new Error(`Error fetching option spread types: ${error.message}`);
  }
}

/**
 * Get the available strike prices for a spread type and expiration date.
 * @param {string} underlying - The symbol for the underlying security.
 * @param {string} [spreadType = "Single"] - The name of the spread type (optional, default is "Single").
 * @param {number} [strikeInterval = 1] - Specifies the desired interval between the strike prices (optional, default is 1).
 * @param {string} [expiration] - Date on which the option contract expires; must be a valid expiration date (optional).
 * @param {string} [expiration2] - Second contract expiration date required for Calendar and Diagonal spreads (optional).
 * @returns {Promise<object>} - Promise resolving to the option strikes for the specified parameters.
 */
async getOptionStrikes(underlying, spreadType = 'Single', strikeInterval = 1, expiration, expiration2) {
  const url = `${this.baseUrl}/options/strikes/${underlying}`;
  const params = {
    spreadType,
    strikeInterval,
    expiration,
    expiration2,
  };

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      params,
    });

    return {
      SpreadType: response.data.SpreadType,
      Strikes: response.data.Strikes,
    };
  } catch (error) {
    throw new Error(`Error fetching option strikes: ${error.message}`);
  }
}



  /**
   * Streams a chain of option spreads for a given underlying symbol, spread type, and expiration.
   * @param {string} underlying - The symbol for the underlying security on which the option contracts are based.
   * @param {string} [expiration] - Date on which the option contract expires; must be a valid expiration date. Defaults to the next contract expiration date.
   * @param {string} [expiration2] - Second contract expiration date required for Calendar and Diagonal spreads.
   * @param {number} [strikeProximity=5] - Specifies the number of spreads to display above and below the priceCenter.
   * @param {string} [spreadType='Single'] - Specifies the name of the spread type to use.
   * @param {number} [riskFreeRate] - The theoretical rate of return of an investment with zero risk. Defaults to the current quote for $IRX.X. The percentage rate should be specified as a decimal value.
   * @param {number} [priceCenter] - Specifies the strike price center. Defaults to the last quoted price for the underlying security.
   * @param {number} [strikeInterval=1] - Specifies the desired interval between the strike prices in a spread. It must be greater than or equal to 1. A value of 1 uses consecutive strikes; a value of 2 skips one between strikes; and so on.
   * @param {boolean} [enableGreeks=true] - Specifies whether or not greeks properties are returned.
   * @param {string} [strikeRange='All'] - If the filter is `ITM` (in-the-money), the chain includes only spreads that have an intrinsic value greater than zero. If the filter is `OTM` (out-of-the-money), the chain includes only spreads that have an intrinsic value equal to zero.
   * @param {string} [optionType='All'] - Filters the spreads by a specific option type. Valid values are `All`, `Call`, and `Put`.
   * @returns {Promise<Stream>} - Promise resolving to the streamed option chain.
   */
  streamOptionChain(underlying, expiration, expiration2, strikeProximity = 5, spreadType = 'Single', riskFreeRate, priceCenter, strikeInterval = 1, enableGreeks = true, strikeRange = 'All', optionType = 'All') {
    const url = `${this.baseUrl}/stream/options/chains/${underlying}`;
    const params = {
      expiration,
      expiration2,
      strikeProximity,
      spreadType,
      riskFreeRate,
      priceCenter,
      strikeInterval,
      enableGreeks,
      strikeRange,
      optionType
    };

    return axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/vnd.tradestation.streams.v2+json',
      },
      responseType: 'stream',
    });
  }

  /**
   * Streams price quotes and greeks for the specified option spread.
   * @param {string} legs_0_Symbol - Option contract symbol or underlying symbol to be traded for this leg.
   * @param {number} [legs_0_Ratio=1] - The number of option contracts or underlying shares for this leg, relative to the other legs. Use a positive number to represent a buy trade and a negative number to represent a sell trade.
   * @param {number} [riskFreeRate] - The theoretical rate of return of an investment with zero risk. Defaults to the current quote for $IRX.X. The percentage rate should be specified as a decimal value.
   * @param {boolean} [enableGreeks=true] - Specifies whether or not greeks properties are returned.
   * @returns {Promise<Stream>} - Promise resolving to the streamed option quotes.
   */
  streamOptionQuotes(legs_0_Symbol, legs_0_Ratio = 1, riskFreeRate, enableGreeks = true) {
    const url = `${this.baseUrl}/stream/options/quotes`;
    const params = {
      'legs[0].Symbol': legs_0_Symbol,
      'legs[0].Ratio': legs_0_Ratio,
      riskFreeRate,
      enableGreeks
    };

    return axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/vnd.tradestation.streams.v2+json',
      },
      responseType: 'stream',
    });
  }


  /**
   * Fetches a full snapshot of the latest Quote for the given Symbols.
   * @param {string} symbols - List of valid symbols in a comma-separated format.
   * @returns {Promise<Quotes>} - Promise resolving to the snapshot of the latest Quote.
   */
  async getQuoteSnapshots(symbols) {
    this.refreshToken();
    const url = `${this.baseUrl}/quotes/${symbols}`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
    .then(response => response.data.Quotes)
    .catch(error => {
      console.error('Error fetching account balances:', error);
      throw error;
    });
  }


  setQuoteSnapshots(setter, symbols){
    (async () => {
      try {
        const arr = await this.getQuoteSnapshots(symbols);
        this.info(`setQuoteSnapshots() hit`);
        setter(prev=>arr);
      } catch (error) {
        this.error(`setQuoteSnapshots() ${error}`);
      }
    })();
  }

  /**
   * Streams Quote changes for one or more symbols.
   * @param {string} symbols - List of valid symbols in a comma-separated format.
   * @returns {Promise<QuoteStream>} - Promise resolving to the streamed Quote changes.
   */


  async streamQuotes(cls, streamIdPrefix, symbols){
    const streamId = `${streamIdPrefix}${symbols}`;
    if (!this.allStreams?.[streamId]) {
      this.refreshToken();
      try {
        const controller = new AbortController();
        const signal = controller.signal;
        const url = `${this.baseUrl}/stream/quotes/${symbols}`;
        const response = await fetch(url,
          {
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
                this.info(`Break q_${symbols}!`);
                break;
              }
              const jsonString = new TextDecoder().decode(value);
              const q = JSON.parse(jsonString.trim());
              cls.setStreamQuote(q);

            } catch (error) {
              const msg = error.message.toLowerCase();
              if (isSubStr(msg, 'network')) {
                this.info("Network Error");
                await this.delay(1000 * 5);
              }else if (isSubStr(msg, 'whitespace')){
                // this.info("None-whitespace Error");
              } else {
                this.error(`streamQuotes() while ${error}`);
              }

            }
          }
        };
        if (this.allStreams?.[streamId]) {
          processChunks();
        }else{
          this.info(`Killed stream for ${streamIdPrefix}${symbols}.`)
        }
      } catch (error) {
        this.error(`streamQuotes() - ${error}`);
      }
    } else {
      this.info(`${streamIdPrefix}${symbols} is active.`)
    }
  }


  /**
   * Streams market depth quotes for equities, futures, and stock options.
   * A separate quote is returned for each price, side, and participant.
   * @param {string} symbol - A valid symbol for the security.
   * @param {number} [maxLevels=20] - The maximum number of market depth levels to return. Must be a positive integer. Defaults to 20 if omitted.
   * @returns {Promise<MarketDepthQuoteStream>} - Promise resolving to the streamed market depth quotes.
   */
  streamMarketDepthQuotes(symbol, maxLevels = 20) {
    const url = `${this.baseUrl}/stream/marketdepth/quotes/${symbol}`;
    const params = {
      maxlevels: maxLevels,
    };

    return axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/vnd.tradestation.streams.v2+json',
      },
      responseType: 'stream',
    });
  }

  /**
   * Streams aggregate market depth quotes for equities, futures, and stock options.
   * A separate quote is returned for each price and side, using aggregated data from the participants.
   * @param {string} symbol - A valid symbol for the security.
   * @param {number} [maxLevels=20] - The maximum number of market depth levels to return. Must be a positive integer. Defaults to 20 if omitted.
   * @returns {Promise<MarketDepthAggregateStream>} - Promise resolving to the streamed aggregate market depth quotes.
   */
  streamMarketDepthAggregates(symbol, maxLevels = 20) {
    const url = `${this.baseUrl}/stream/marketdepth/aggregates/${symbol}`;
    const params = {
      maxlevels: maxLevels,
    };

    return axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/vnd.tradestation.streams.v2+json',
      },
      responseType: 'stream',
    });
  }

  /**
   * Streams tick bars data for the regular session from a number of bars back,
   * each bar returned separated by interval number of ticks.
   * @param {string} symbol - A Symbol Name.
   * @param {number} interval - Interval for each bar returned (in ticks).
   * @param {number} barsBack - The number of bars to stream, going back from the current time.
   * @returns {Promise<Object>} - Promise resolving to the tick bar response.
   */
  streamTickBars(symbol, interval, barsBack) {
    const url = `https://api.tradestation.com/v2/stream/tickbars/${symbol}/${interval}/${barsBack}`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Error streaming tick bars:', error);
        throw error;
      });
  }

}

module.exports = {MarketData:MarketData}