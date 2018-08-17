import React, { Component } from 'react';
import {
    ListGroup,
    ListGroupItem,
    Button,
    Container
} from 'reactstrap';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import {
    API_KEY
} from '../config/keys';
import axios from 'axios';
import MyChart from './MyChart';

const key = API_KEY || process.env.API_KEY;

let Highcharts = MyChart;
let chart = null;
let seriesSize = 0;
let loadAllConfigs = true;

class StockChart extends Component {
    state = {
        stocks: [],
        hasUpdated: false
    }

    config = {
        rangeSelector: {
            selected: 2
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
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
        const { stocks } = this.state;
        //   if (this.state.hasUpdated){
        if (stocks.size > 0) {
            chart = this.refs.chart.getChart();
        }
    }

    addStock = (code) => {
        const containsCode = this.state.stocks.filter(stock => (stock.code === code)).length;

        if (containsCode > 0) {
            alert("already existed");
            return;
        }

        const pList = [];
        const stockUrl = "https://www.quandl.com/api/v3/datasets/WIKI/";
        const access = ".json?limit=30&collapse=weekly&api_key=";
        axios
            .get(stockUrl + code + access + key)
            .then(stock => {

                const dataList = stock.data.dataset.data;

                dataList.forEach(data => {
                    pList.unshift([parseInt(new Date(data[0]).getTime(), 10), data[4]]);
                })

                let newStock = {
                    code: stock.data.dataset.dataset_code,
                    description: stock.data.dataset.name,
                    pList: pList
                }

                this.setState(state => ({
                    stocks: [...state.stocks, newStock]
                }));

                this.loadSingleStockConfig(newStock);

            })
            .catch(err => {
                console.log(err);
            });

    }

    onDeleteClick = (code) => {
        this.props.deleteStock(code);

    }

    removeStock = (code) => {
        this.setState(state => ({
            stocks: state.stocks.filter(stock => stock.code !== code)
        }));
        this.removeSingleStockConfig(code);
    }

    removeAllStocks = () => {
        this.setState(state => ({
            stocks: []
        }));
        this.removeSingleStockConfig();
    }


    generateSeriesConfig = (code, data, i) => {
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
                        Highcharts.Color(Highcharts.getOptions().colors[i])
                            .setOpacity(0.4).get('rgba')],
                    [1,
                        Highcharts.Color(Highcharts.getOptions().colors[i])
                            .setOpacity(0).get('rgba')]
                ]
            }
        }
    }

    loadAllStocksConfigs = () => {
        this.config.series = [];
        let chart = this.refs.chart.getChart();
        if (this.state.stocks.length > 0) {
            console.log("Event: loadALLStocks");
            this.state.stocks.forEach((stock, i) => {
                let series = this.generateSeriesConfig(stock.code, stock.pList, i);
                seriesSize++;
                console.log(series);
                this.config.series.push(series);
                chart.addSeries(series);
            });
        }
    }

    loadSingleStockConfig = (stock) => {
        let chart = this.refs.chart.getChart();
        if (stock) {
            let newSeries = this.generateSeriesConfig(stock.code, stock.pList, seriesSize++);
            this.config.series.push(newSeries);
            chart.addSeries(newSeries);
            seriesSize++;
        }
    }

    removeSingleStockConfig = (code) => {
        let chart = this.refs.chart.getChart();
        const stockIndex = this.config.series.findIndex(stock => stock.name === code);
        this.config.series.splice(stockIndex, 1);
        chart.series[stockIndex].remove(true);
        seriesSize--;
    }

    removeAllStockConfigs = (code) => {
        this.config.series = []
        for (var i = chart.series.length - 1; i >= 0; i--) {
            chart.series[i].remove(false);
        }
        seriesSize = 0;
    }


    render() {
        return (

            <div id="stock-chart" >

                <Button color="dark"
                    className="m-2"
                    onClick={
                        () => {
                            const code = prompt('Enter code');
                            // TODO verify code
                            this.addStock(code);
                        }
                    } >
                    Add Stock Code </Button>

                <ListGroup >
                    {
                        this.state.stocks.map(({ code }) => (
                            <ListGroupItem key={code}>
                                <Button className="remove-btn"
                                    color="danger"
                                    size="sm"
                                    onClick={
                                        () => {
                                            this.removeStock(code);
                                        }
                                    } >
                                    &times;
                                    </Button> {code} </ListGroupItem>
                        ))
                    }
                </ListGroup>
                <ReactHighstock ref="chart" config={this.config} />;
            </div>
        );
    }
}

export default StockChart;
