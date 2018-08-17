import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavbar from './components/AppNavbar';
import StockChart from './components/StockChart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <StockChart />
      </div>
    );
  }
}

export default App;
