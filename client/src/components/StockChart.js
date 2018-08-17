import React, { Component } from 'react';
import {
    ListGroup,
    ListGroupItem,
    Button,
    Alert
} from 'reactstrap';
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import { connect } from 'react-redux';
import { getStocks, deleteStock, addStock } from '../actions/stockActions';
import PropTypes from 'prop-types';
import MyChart from './MyChart';
import Searchbar from './Searchbar';
import { parseData } from '../data/dataParser';
import {
    API_KEY
} from '../config/keys';
import axios from 'axios';

const key = API_KEY || process.env.API_KEY;

let Highcharts = MyChart;
let chart = null;
let seriesSize = 0;
let loadAllConfigs = true;

class StockChart extends Component {

    state = {
        color: [],
        loading: false,
        visible: false,
        alert: ''
    }

    // highchart configuration
    config = {
        rangeSelector: {
            selected: 2
        },
        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },
        series: []
    };

    componentDidMount() {
        chart = this.refs.chart.getChart();
    }

    componentWillMount() {
        this.props.getStocks();
    }


    addStockValidation = (code) => {
        const { stocks } = this.props.stock;
        const containsCode = stocks.filter(stock => (stock.code === code)).length;
        const res = 0;

        if (containsCode > 0) {
            this.setState({ alert : 'Stock already added.'})
            this.setState({ visible: true });
            return res;
        }
        else if (stocks.length >= 5) {
            this.setState({ alert : 'You can only track up to five stocks at this moment.'})
            this.setState({ visible: true });
            return res;
        }
        return 1;
    }

    addStockConfig = (code) => {
        this.onDismiss();
        if (!this.addStockValidation(code)) return;

        this.onLoading();

        const stockUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${code}.json?limit=30&collapse=weekly&api_key=${key}`;
        axios
            .get(stockUrl)
            .then(stockData => {


                let newStock = parseData(stockData);

                this.addNewStock(newStock);

            })
            .catch(err => {
                console.log(err);
            });
    }

    addNewStock = (newStock) => {
        this.props.addStock({
            code: newStock.code
        });
        this.loadSingleStockConfig(newStock);
    }

    loadAllStocksConfigs = (stocks) => {
        this.config.series = [];
        if (stocks.length > 0) {
            stocks.forEach((stock, i) => {

                const stockUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${stock.code}.json?limit=30&collapse=weekly&api_key=${key}`;
                axios
                    .get(stockUrl)
                    .then(stockData => {

                        let newStock = parseData(stockData);

                        let series = this.generateSeriesConfig(newStock.code, newStock.data, i);
                        seriesSize++;
                        this.config.series.push(series);
                        chart.addSeries(series);

                        loadAllConfigs = false;

                    })
                    .catch(err => {
                        console.log(err);
                    });
            });

        }
    }

    loadSingleStockConfig = (stock) => {
        let chart = this.refs.chart.getChart();
        if (stock) {
            let newSeries = this.generateSeriesConfig(stock.code, stock.data, seriesSize++);
            this.config.series.push(newSeries);
            chart.addSeries(newSeries);
            seriesSize++;
            this.doneLoading();
        }
    }

    removeStock = (_id, code) => {
        this.onLoading();
        this.props.deleteStock(_id);
        this.removeSingleStockConfig(code);
    }

    removeSingleStockConfig = (code) => {
        let chart = this.refs.chart.getChart();
        const stockIndex = this.config.series.findIndex(stock => stock.name === code);
        this.config.series.splice(stockIndex, 1);
        chart.series[stockIndex].remove(true);
        seriesSize--;
        this.doneLoading();
    }

    generateSeriesConfig = (code, data, i) => {
        const seriesColor = Highcharts.getOptions().colors[i];
        return {
            name: code,
            type: "areaspline",
            data: data,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0,
                        Highcharts.Color(seriesColor)
                            .setOpacity(0.4).get('rgba')],
                    [1,
                        Highcharts.Color(seriesColor)
                            .setOpacity(0).get('rgba')]
                ]
            }
        }
    }

    onLoading = () => {
        this.setState({
            loading: true
        });
    }

    doneLoading = () => {
        this.setState({
            loading: false
        });
    }

    onDismiss = () => {
        this.setState({ visible: false });
    }



    render() {
        const { stocks } = this.props.stock;
        const { loading } = this.state;

        if (loadAllConfigs && stocks) {
            this.loadAllStocksConfigs(stocks);
        }

        const display = (loading === true || this.props.stock.loading === true) ? 'block' : 'none';
        return (
            <div>

                <div id="loading" style={{ display: display }}></div>

                <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                   {this.state.alert}
                </Alert>

                <Searchbar addStockConfig={this.addStockConfig.bind(this)} />

                <div className="stock-chart">

                    <ListGroup id="stock-list">
                        <TransitionGroup className="shopping-list" >
                            {stocks.map((stock) => (

                                <CSSTransition key={stock._id}
                                    timeout={500}
                                    classNames="fade" >
                                    <ListGroupItem
                                        className="stock-item"
                                    >
                                        {stock.code}
                                        <Button className="remove-btn"
                                            outline
                                            size="sm"
                                            onClick={
                                                this.removeStock.bind(this, stock._id, stock.code)
                                            } >
                                            &times;
                                        </Button>

                                    </ListGroupItem>
                                </CSSTransition>

                            ))
                            }
                        </TransitionGroup>
                    </ListGroup>

                    <ReactHighstock id="stock-graph" neverReflow={true} ref="chart" config={this.config} />
                </div>


            </div>
        );
    }
}


StockChart.propTypes = {
    getStocks: PropTypes.func.isRequired,
    stock: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
    stock: state.stock
});

export default connect(mapStateToProps, { getStocks, deleteStock, addStock })(StockChart);
