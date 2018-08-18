# StockTracker

> A full stack MERN app for tracking real-time stock using redux for state management and one addition feature allows to fetch latest financial news.

#### Features

* graph displaying the recent trend lines for each added stock
* real time changes when any other user adds or removes a stock

![stocktracker](https://user-images.githubusercontent.com/22216684/44283202-9e6c6f00-a22b-11e8-92ab-4a73e407aad9.PNG)

## Prerequisite

Replace the mongoURI with your own database url in ```config/keys```

## Installation

Install all dependencies

```bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

```

## Usage

```bash
# Server runs on port 5000 and client on 3000 by default
# Run server and client concurrently
npm run dev

# Run backend server only
npm start

# Run backend server with nodemon (automatically restarting the node application)
npm run server

# Run client only
npm run client

```

## Built With

* MERN
* [redux](https://redux.js.org/) - frontend state manager
* [axios](https://github.com/axios/axios) - HTTP client
* frontend component library
    * [bootstrap](https://getbootstrap.com/)
    * [reactstrap](https://reactstrap.github.io/)
* displaying stock charts
    * [highcharts](https://www.highcharts.com/)
    * [react-highcharts](https://github.com/kirjs/react-highcharts)
* icon
    * [font-fontawesome](https://fontawesome.com/)

## APIs

* [Quandl API](https://www.quandl.com/tools/api) - stock data
* [News API](https://newsapi.org/) - financial news
* [Alpha Vantage](https://www.alphavantage.co) - currency exchange rate

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
