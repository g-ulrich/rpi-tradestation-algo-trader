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
const { ipcRenderer } =require("electron");
const $ =require('jquery');

class Symbols {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.isRefreshingToken = false;
    this.baseUrl = 'https://api.tradestation.com/v2/data/symbols';
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
   * Suggests symbols semantically based upon partial input of symbol name,
   * company name, or description. Does not return Options symbols.
   * @param {string} text - Symbol text for suggestion. Partial input of a symbol name, company name, or description.
   * @param {number} [top] - The top number of results to return.
   * @param {string} [filter] - An OData filter to apply to the results.
   * @returns {Promise<SymbolSuggestDefinition>} - Promise resolving to the suggested symbols.
   */
  async suggestSymbols(text, top, filter) {
    this.refreshToken();
    const url = `${this.baseUrl}/suggest/${text}`;
    const params = {
      $top: top,
      $filter: filter,
    };

    const response = axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(response => response)
    .catch(error => {
      this.error(`getAccounts() - ${error}, ${this.accessToken}`);
      throw error;
    });
    return response;
  }

  _setFullSymbolName(symbol){
    this.suggestSymbols(symbol).then(arr => {
        var detailsArray = arr.data;
            detailsArray.forEach((sym)=>{
              var cat = sym?.Category.toLowerCase();
                if (sym?.Name == symbol){
                    var title = `${sym?.Exchange}:${symbol} · ${sym?.Description}`;
                    // $(`#${id}`).text(title);
                    $(`.fullSymbolName`).empty();
                    $(`.fullSymbolName`).append(
                      `${sym?.Exchange}:${symbol} ·
                      <span class="text-muted">${sym?.Description}</span>`
                    );
                    document.title = `${sym?.Exchange} : ${symbol} · ${sym?.Description}`
                }
            });
        
    }).catch(error => {
        // console.log("[ERROR] _setSymbolDescrptionForId",error);
    });
  }

  _setSymbolDataToPositions(posArray){
   
    posArray.forEach((pos)=>{
        this.suggestSymbols(pos?.Symbol).then(arr => {
                var detailsArray = arr.data;
                    detailsArray.forEach((sym)=>{
                      var cat = sym?.Category.toLowerCase();
                      var type = pos?.AssetType.toLowerCase();
                        if (cat == type && sym?.Name == pos?.Symbol){
                            $(`#positions_table_${pos?.Symbol}_exchange`).text(sym?.Exchange + ":");
                            $(`#positions_table_${pos?.Symbol}_desc`).text(sym?.Description)
                        }
                    });
                
            }).catch(error => {
                console.log("[ERROR] suggestSymbols",error);
            });
    });
}

  /**
   * Searches symbols based upon input criteria including Name, Category, and Country.
   * @param {string} criteria - Criteria represented as Key/value pairs (`&` separated).
   * @returns {Promise<SymbolSearchDefinition>} - Promise resolving to the symbol search response.
   */
  async searchSymbols(criteria) {
    this.refreshToken();
    const url = `${this.baseUrl}/search/${criteria}`;

    const response = axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(response => response)
    .catch(error => {
      this.error(`getAccounts() - ${error}, ${this.accessToken}`);
      throw error;
    });
    return response;;
  }
}

module.exports = {Symbols:Symbols}