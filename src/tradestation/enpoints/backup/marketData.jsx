import axios from 'axios';

class marketData {
  constructor() {
    this.endpoints = new TSEndpoints();
  }

  validateInterval(interval, unit) {
    const validIntervals = ['1', '5', '15', '30', '60', '240', '480'];

    if (unit !== 'Minute' && interval !== '1') {
      throw new Error(`For bar units other than Minute, interval must be 1. For Minute unit, the max allowed interval is 1440.`);
    }

    if (!validIntervals.includes(interval)) {
      throw new Error(`Invalid interval: ${interval}. Valid intervals are ${validIntervals.join(', ')}.`);
    }
  }

  validateBarsBack(barsback) {
    const maxIntradayBarsBack = 57600; // Maximum number of intraday bars back

    if (isNaN(barsback) || barsback <= 0 || barsback > maxIntradayBarsBack) {
      throw new Error(`Invalid barsback value: ${barsback}. It should be a positive number less than or equal to ${maxIntradayBarsBack}.`);
    }
  }

  validateUnit(unit) {
    const validUnits = ['Minute', 'Daily', 'Weekly', 'Monthly'];

    if (!validUnits.includes(unit)) {
      throw new Error(`Invalid unit: ${unit}. Valid units are ${validUnits.join(', ')}.`);
    }
  }

  validateDate(date, paramName) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

    if (!dateRegex.test(date)) {
      throw new Error(`Invalid ${paramName} value: ${date}. It should be formatted as YYYY-MM-DDTHH:mm:ssZ.`);
    }
  }

  validateSessionTemplate(sessiontemplate) {
    const validSessionTemplates = ['USEQPre', 'USEQPost', 'USEQPreAndPost', 'USEQ24Hour', 'Default'];

    if (sessiontemplate && !validSessionTemplates.includes(sessiontemplate)) {
      throw new Error(`Invalid sessiontemplate: ${sessiontemplate}. Valid values are ${validSessionTemplates.join(', ')}.`);
    }
  }

  async fetchMarketData(symbol, interval = '1', unit = 'Daily', barsback = '1', firstdate, lastdate, sessiontemplate) {
    this.validateInterval(interval, unit);
    this.validateBarsBack(barsback);
    this.validateUnit(unit);

    if (firstdate) {
      this.validateDate(firstdate, 'firstdate');
    }

    if (lastdate) {
      this.validateDate(lastdate, 'lastdate');
    }

    this.validateSessionTemplate(sessiontemplate);

    const url = `https://api.tradestation.com/v3/marketdata/barcharts/${symbol}`;
    const token = 'Bearer TOKEN';

    const params = {
      interval,
      unit,
      barsback,
      firstdate,
      lastdate,
      sessiontemplate,
    };

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error.message);
      throw error;
    }
  }
}

// Example usage:
const marketDataInstance = new marketData();

// Example with invalid date format
try {
  marketDataInstance.fetchMarketData('MSFT', '1', 'Daily', '5', '2020-12-05', '2020-12-06T21:00:00Z', 'USEQPreAndPost');
} catch (error) {
  console.error(error.message);
}
