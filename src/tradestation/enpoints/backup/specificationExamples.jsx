const request = require('request');

function suggestSymbols(text="AAPL", top=5, filter="Category eq 'Stock'", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v2/data/symbols/suggest/${text}`;
    const headers = { Authorization: `Bearer ${token}` };
    const params = { $top: top, $filter: filter };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
        qs: params,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}

function searchSymbols(criteria="N=AAPL&C=Stock&Cnt=US", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v2/data/symbols/search/${criteria}`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}


function streamTickBars(symbol="AAPL", interval=5, barsBack=10, token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v2/stream/tickbars/${symbol}/${interval}/${barsBack}`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    const req = request(options);

    req.on('data', function (data) {
        console.log(data.toString());
    });

    req.on('error', function (err) {
        console.error(err);
    });
}



function getBrokerageAccounts(token="YOUR_ACCESS_TOKEN") {
    const url = 'https://api.tradestation.com/v3/brokerage/accounts';
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}


function getBalancesForAccounts(accountIds="61999124,68910124", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/balances`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}


function getBODBalancesForAccounts(accountIds="61999124,68910124", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/bodbalances`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}


function getHistoricalOrdersForAccounts(accountIds="61999124,68910124", sinceDate="2006-01-13", pageSize = 600, nextToken = null, token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/historicalorders`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        qs: {
            since: sinceDate,
            pageSize: pageSize,
            nextToken: nextToken
        },
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}




function getHistoricalOrdersByOrderId(accountIds="61999124,68910124", orderIds="123456789,6B29FC40-CA47-1067-B31D-00DD010662DA", sinceDate="2006-01-13", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/historicalorders/${orderIds}`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        qs: {
            since: sinceDate
        },
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}


function getOrders(accountIds="61999124,68910124", pageSize = 600, nextToken = null, token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/orders`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        qs: {
            pageSize: pageSize,
            nextToken: nextToken,
        },
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}




function getOrdersByOrderId(accountIds="61999124,68910124", orderIds="123456789,6B29FC40-CA47-1067-B31D-00DD010662DA", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/orders/${orderIds}`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}




function getPositions(accountIds="61999124,68910124", symbols = "AAPL,MSFT", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountIds}/positions`;
    const headers = { Authorization: `Bearer ${token}` };
    const queryParams = symbols ? `?symbol=${symbols}` : "";

    const options = {
        method: 'GET',
        url: `${url}${queryParams}`,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}




function getWallets(accountId="61999124C", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/accounts/${accountId}/wallets`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode === 200) {
            console.log(JSON.parse(body));
        } else {
            console.error(`Error: ${response.statusCode} - ${body}`);
        }
    });
}



function streamWallets(accountId="61999124C", token="YOUR_ACCESS_TOKEN") {
    const url = `https://api.tradestation.com/v3/brokerage/stream/accounts/${accountId}/wallets`;
    const headers = { Authorization: `Bearer ${token}` };

    const options = {
        method: 'GET',
        url: url,
        headers: headers,
    };

    request(options)
        .on('data', function (data) {
            // Process the streamed data
            console.log(data.toString());
        })
        .on('error', function (err) {
            console.error(err);
        });
}




function confirmOrder(orderDetails_="") {
    // Example usage:
  const orderDetails = {
    "AccountID": "123456782",
    "Symbol": "MSFT",
    "Quantity": "10",
    "OrderType": "Market",
    "TradeAction": "BUY",
    "TimeInForce": {"Duration": "DAY"},
    "Route": "Intelligent"
  };
  const options = {
    method: 'POST',
    url: 'https://api.tradestation.com/v3/orderexecution/orderconfirm',
    headers: {'content-type': 'application/json', Authorization: 'Bearer TOKEN'},
    body: orderDetails,
    json: true
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}



