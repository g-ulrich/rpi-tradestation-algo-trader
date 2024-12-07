
/**
 * Enums class containing symbol-related enumerations.
 */
class Enums {
  /**
   * Bar Units for time interval
   * @enum {string}
   */
  static BarUnits = {
    MINUTE: 'minute',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    SECOND: 'second', // Only Crypto
  }

  /**
   * Crpyto Bar Intervals
   * @enum {string}
   */
  static CrytpoBarIntervals = {
    ONE: '1',
    FIVE: '5',
    FIFTEEN: '15',
    THIRTY: '30',
    SIXTY: '60',
    TWOHUNDREDFORTY: '240',
    FOURHUNDREDEIGHTY: '480'
  }

  /**
   * Bar session templates
   * @enum {string}
   */
  static SessionTemplate = {
    QPRE: 'USEQPre',
    QPOST: 'USEQPost',
    QPREANDPOST: 'USEQPreAndPost',
    Q24HOUR: 'USEQ24Hour',
    DEFAULT: 'Default'
  }

  /**
   * Enumeration for symbol categories.
   * @enum {string}
   */
  static SymbolCategory = {
    STOCK: 'stock',
    INDEX: 'index',
    MUTUAL_FUND: 'mutual fund',
    // Add more categories as needed
  };

  /**
   * Enumeration for symbol countries.
   * @enum {string}
   */
  static SymbolCountry = {
    US: 'US', // United States
    DE: 'DE', // Germany
    CA: 'CA', // Canada
  };

  /**
   * Enumeration for symbol currencies.
   * @enum {string}
   */
  static SymbolCurrency = {
    USD: 'USD', // United States Dollar
    AUD: 'AUD', // Australian Dollar
    CAD: 'CAD', // Canadian Dollar
    CHF: 'CHF', // Swiss Franc
    DKK: 'DKK', // Danish Krone
    EUR: 'EUR', // Euro
    GBP: 'GBP', // British Pound Sterling
    HKD: 'HKD', // Hong Kong Dollar
    JPY: 'JPY', // Japanese Yen
    NOK: 'NOK', // Norwegian Krone
    NZD: 'NZD', // New Zealand Dollar
    SEK: 'SEK', // Swedish Krona
    SGD: 'SGD', // Singapore Dollar
};

  /**
   * Enumeration for market activation rule types.
   * @enum {string}
   */
  static RuleType = {
    PRICE: 'Price',
    // Add more types as needed
  };

  /**
   * Enumeration for market activation rule predicates.
   * @enum {string}
   */
  static MarketActivationRulePredicate = {
    LT: 'Lt', // Less than
    LTE: 'Lte', // Less than or equal
    GT: 'Gt', // Greater than
    GTE: 'Gte', // Greater than or equal
  };

  /**
   * Enumeration for market activation rule trigger keys.
   * @enum {string}
   */
  static ActivationTriggerKey = {
    SingleTrade: 'STT', // Single Trade Tick - One trade tick must print within your stop price to trigger your stop.
    SingleTradeNBBO: 'STTN', // Single Trade Tick Within NBBO - One trade tick within the National Best Bid or Offer must print within your stop price to trigger your stop.
    SingleBidAsk: 'SBA', // Single Bid/Ask Tick - Buy/Cover Orders: One Ask tick must print within your stop price to trigger your stop. Sell/Short Orders: One Bid tick must print within your stop price to trigger your stop.
    SingleAskBid: 'SAB', // Single Ask/Bid Tick - Buy/Cover Orders: One Bid tick must print within your stop price to trigger your stop. Sell/Short Orders: One Ask tick must print within your stop price to trigger your stop.
    DoubleTrade: 'DTT', // Double Trade Tick - Two consecutive trade ticks must print within your stop price to trigger your stop.
    DoubleTradeNBBO: 'DTTN', // Double Trade Tick Within NBBO  - Two consecutive trade ticks within the National Best Bid or Offer must print within your stop price to trigger your stop.
    DoubleBidAsk: 'DBA', // Double Bid/Ask Tick - Buy/Cover Orders: Two consecutive Ask ticks must print within your stop price to trigger your stop. Sell/Short Orders: Two consecutive Bid ticks must print within your stop price to trigger your stop.
    DoubleAskBid: 'DAB', // Double Ask/Bid Tick - Buy/Cover Orders: Two consecutive Bid ticks must print within your stop price to trigger your stop. Sell/Short Orders: Two consecutive Ask ticks must print within your stop price to trigger your stop.
    TwiceTrade: 'TTT', // Twice Trade Tick - Two trade ticks must print within your stop price to trigger your stop.
    TwiceTradeNBBO: 'TTTN', // Twice Trade Tick Within NBBO - Two trade ticks within the National Best Bid or Offer must print within your stop price to trigger your stop.
    TwiceBidAsk: 'TBA', // Twice Bid/Ask Tick - Buy/Cover Orders: Two Ask ticks must print within your stop price to trigger your stop. Sell/Short Orders: Two Bid ticks must print within your stop price to trigger your stop.
    TwiceAskBid: 'TAB', // Twice Ask/Bid Tick - Buy/Cover Orders: Two Bid ticks must print within your stop price to trigger your stop. Sell/Short Orders: Two Ask ticks must print within your stop price to trigger your stop.
  };

  /**
   * Enumeration for market activation rule logic operators.
   * @enum {string}
   */
  static LogicOperator = {
    AND: 'And',
    OR: 'Or',
  };

  /**
   * Enumeration for order asset types.
   * @enum {string}
   */
  static OrderAssetType = {
    EQUITY: 'EQ',
    FUTURE: 'FU',
    OPTION: 'OP',
    // Add more types as needed
  };

  /**
   * Enumeration for order durations.
   * @enum {string}
   */
  static OrderDuration = {
    DAY: 'DAY',
    DAYPLUS: 'DYP',
    GOODTILLCANCEL: 'GTC',
    GOODTILLCANCELPLUS: 'GCP',
    GOODTHROUGHDATE: 'GTD',
    GOODTHROUGHDATEPLUS: 'GDP',
    GOODATOPENING: 'OPG',
    GOODATCLOSE: 'CLO',
    IMMEDIATEORCANCEL: 'IOC', // Partial fills accepted
    FILLORKILL: 'FOK', // No Partial fills
    EXPIRES1MIN: '1 MIN',
    EXPIRES3MIN: '3 MIN',
    EXPIRES5MIN: '5 MIN',
  };

  /**
   * Enumeration for order types.
   * @enum {string}
   */
  static OrderType = {
    LIMIT: 'Limit',
    MARKET: 'Market',
    STOPLIMIT: 'StopLimit',
    STOPMARKET: 'StopMarket',
    // Add more types as needed
  };

  /**
   * Enumeration for order trade actions.
   * @enum {string}
   */
  static OrderTradeAction = {
    BUY: 'BUY',
    SELL: 'SELL',
    BUYTOCOVER: 'BUYTOCOVER',
    SELLSHORT: 'SELLSHORT',
    BUYTOOPEN: 'BUYTOOPEN',
    BUYTOCLOSE: 'BUYTOCLOSE',
    SELLTOOPEN: 'SELLTOOPEN',
    SELLTOCLOSE: 'SELLTOCLOSE',
    // Add more actions as needed
  };

  /**
   * Enumeration for OSO Types (One Sends Others). Advanced order
   * @enum {string}
   */
  static OSOType = {
    NORMAL: 'NORMAL',
    BRK: 'BRK',
    OCO: 'OCO',
  };

  /**
   * Enumeration for Asset Types.
   * @enum {string}
   */
  static AssetType = {
    UNKNOWN: 'UNKNOWN',
    STOCK: 'STOCK',
    STOCKOPTION: 'STOCKOPTION',
    FUTURE: 'FUTURE',
    FUTUREOPTION: 'FUTUREOPTION',
    FOREX: 'FOREX',
    CURRENCYOPTION: 'CURRENCYOPTION',
    INDEX: 'INDEX',
    INDEXOPTION: 'INDEXOPTION',
    MUTUALFUND: 'MUTUALFUND',
    MONEYMARKETFUND: 'MONEYMARKETFUND',
    BOND: 'BOND',
    CRYPTO: 'CRYPTO',
  };

  /**
   * Enumeration for Order Asset Categories.
   * @enum {string}
   */
  static OrderAssetCategory = {
    EQUITY: 'EQUITY',
    STOCKOPTION: 'STOCKOPTION',
    FUTURE: 'FUTURE',
    CRYPTO: 'CRYPTO',
  };

  /**
   * Enumeration for Order Asset Direction.
   * @enum {string}
   */
  static PositionDirection = {
    LONG: 'Long',
    SHORT: 'Short',
  };

  /**
   * Enumeration for Price Formats.
   * @enum {string}
   */
  static PriceFormat = {
    DECIMAL: 'Decimal',
    FRACTION: 'Fraction',
    SUBFRACTION: 'SubFraction',
  };


  /**
   * Enumeration for Increment Styles.
   * @enum {string}
   */
  static IncrementStyle = {
    SIMPLE: 'Simple',
    SCHEDULE: 'Schedule',
  };

  /**
   * Enumeration for Account Types.
   * @enum {string}
   */
  static AccountType = {
    CASH: 'CASH',
    MARGIN: 'MARGIN',
    FUTURES: 'FUTURES',
    CRYPTO: 'CRYPTO',
    DVP: 'DVP',
  };

  /**
 * Enumeration for Order Status.
 * @enum {string}
 */
static Status = {
  RECEIVED: 'ACK', // Received
  OPTIONASSIGNMENT: 'ASS', // Option Assignment
  BRACKETCANCELED: 'BRC', // Bracket Canceled
  BRACKETFILLED: 'BRF', // Bracket Filled
  BROKEN: 'BRO', // Broken
  CHANGE: 'CHG', // Change
  CONDITIONMET: 'CND', // Condition Met
  FILLCORRECTED: 'COR', // Fill Corrected
  CANCELSENT: 'CSN', // Cancel Sent
  DISPATCHED: 'DIS', // Dispatched
  DEAD: 'DOA', // Dead
  QUEUED: 'DON', // Queued
  EXPIRATIONCANCELREQUEST: 'ECN', // Expiration Cancel Request
  OPTIONEXERCISE: 'EXE', // Option Exercise
  PARTIALFILLALIVE: 'FPR', // Partial Fill (Alive)
  TOOLATETOCANCEL: 'LAT', // Too Late to Cancel
  SENT: 'OPN', // Sent
  OSOORDER: 'OSO', // OSO Order
  NOTMAPPED: 'OTHER', // OrderStatus not mapped
  SENDING: 'PLA', // Sending
  BIGBROTHERRECALLREQUEST: 'REC', // Big Brother Recall Request
  CANCELREQUESTREJECTED: 'RJC', // Cancel Request Rejected
  REPLACEPENDING: 'RPD', // Replace Pending
  REPLACESENT: 'RSN', // Replace Sent
  STOPHIT: 'STP', // Stop Hit
  ORDERSTATUSMESSAGE: 'STT', // OrderStatus Message
  SUSPENDED: 'SUS', // Suspended
  CANCELSENT: 'UCN', // Cancel Sent
  CANCELED: 'CAN', // Canceled
  EXPIRED: 'EXP', // Expired
  UROUT: 'OUT', // UROut
  CHANGEREQUESTREJECTED: 'RJR', // Change Request Rejected
  BIGBROTHERRECALL: 'SCN', // Big Brother Recall
  TRADESERVERCANCELED: 'TSC', // Trade Server Canceled
  REPLACED: 'UCH', // Replaced
  REJECTED: 'REJ', // Rejected
  FILLED: 'FLL', // Filled
  PARTIALFILL: 'FLP', // Partial Fill (UROut)
};

}
