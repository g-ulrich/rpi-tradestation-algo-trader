# rpi-tradestation-algo-trader

An open-source algorithmic trading application built for Raspberry Pi, utilizing the Tradestation API and Lightweight Charts library.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Key Components](#key-components)
- [Setup and Usage](#setup-and-usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## About

This project aims to create an efficient algorithmic trading application specifically designed for Raspberry Pi devices. It leverages the power of Electron for cross-platform compatibility while utilizing the Tradestation API for live market data and order execution. The application also incorporates Lightweight Charts for real-time charting capabilities.

## Features

- Algorithmic trading engine optimized for low-resource environments
- Real-time market data streaming via Tradestation API
- Interactive charts with customizable indicators
- Strategy editor for creating and testing algorithms
- Cross-platform support (Electron-based, works on Raspberry Pi and desktop/laptop computers)
- Optimized for Raspberry Pi hardware limitations

## Technologies Used

- Frontend: Electron + React
- Backend: Node.js
- Charting: Lightweight Charts
- Trading API: Tradestation API
- Operating System: Raspberry Pi OS (Linux)

## Key Components

### Trading Engine
The core of our application, responsible for implementing custom trading algorithms and managing positions.

### Data Feeds
Retrieves real-time market data from the Tradestation API and processes incoming tick data.

### UI Components
- **Chart Component**: Utilizes Lightweight Charts for interactive and responsive visualizations
- **Strategy Editor**: Allows users to create and test their own trading strategies
- **Trade Execution Interface**: Provides a user-friendly interface for executing trades

### System Management
- Resource optimization for Raspberry Pi hardware
- Performance monitoring and logging system

## Setup and Usage

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rpi-tradestation-algo-trader.git
   cd rpi-tradestation-algo-trader
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables (API keys, etc.)

4. Build and run the application:
   ```
   npm start
   ```

## Configuration

To configure the application, you'll need to set up environment variables. Create a `.env` file in the root directory and add the following:

```
TRADESTATION_API_KEY=your_api_key_here
TRADESTATION_API_SECRET=your_api_secret_here
RPI_HOSTNAME=your_raspberry_pi_hostname_or_ip
```

Replace `your_api_key_here`, `your_api_secret_here`, and `your_raspberry_pi_hostname_or_ip` with your actual values.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Tradestation API documentation
- Lightweight Charts library
- Electron framework
- Raspberry Pi community resources

---

### Additional Resources

For more information about the technologies used in this project, please refer to their official documentation:

- [Electron](https://electronjs.org/docs)
- [Node.js](https://nodejs.org/en/docs/)
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [Tradestation API](https://www.tradestation.com/api-documentation)

If you encounter any issues or have suggestions for improvements, please don't hesitate to reach out!
