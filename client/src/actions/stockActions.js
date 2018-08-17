import axios from 'axios';
import { GET_STOCKS, ADD_STOCK, DELETE_STOCK, STOCKS_LOADING } from './types';

export const getStocks = () => {
  return {
    type: GET_STOCKS
  }
};

export const addStock = (stock) => {
  return {
    type: ADD_STOCK,
    payload: stock
  }
};

export const deleteStock = (code) => {
  return {
    type: DELETE_STOCK,
    payload: code
  }
};

export const setStocksLoading = () => {
  return {
    type: STOCKS_LOADING
  };
};
