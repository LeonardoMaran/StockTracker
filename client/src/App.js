import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavbar from './components/AppNavbar';
import StockChart from './components/StockChart';

import { Provider } from 'react-redux';
import store from './store';
import StockNews from './components/StockNews';
import CurrencyExchanger from './components/CurrencyExchanger';

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<div className="App">
					<header className="App-header">
						<AppNavbar />
					</header>
					<section className="stock-panel">
						<StockChart />
						<section className="info-section">
							<StockNews />
							<CurrencyExchanger />
						</section>
					</section>
				</div>
			</Provider>
		);
	}
}

export default App;
