import Symbols from '../symbols';

// Example usage:
const symbols = new Symbols('YOUR_ACCESS_TOKEN');

// Suggest Symbols
symbols.suggestSymbols('AAPL', 5, 'Category eq \'Stock\'')
  .then(response => console.log('Suggested Symbols:', response.data))
  .catch(error => console.error('Error suggesting symbols:', error));

// Search Symbols
symbols.searchSymbols('N=AAPL&C=Stock&Cnt=US')
  .then(response => console.log('Symbol Search Response:', response.data))
  .catch(error => console.error('Error searching symbols:', error));

This Symbols class provides functions to suggest symbols based on partial input
