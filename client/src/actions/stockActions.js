import axios from 'axios';
import { GET_STOCKS, ADD_STOCK, DELETE_STOCK, STOCKS_LOADING } from './types';

export const getStocks = () => dispatch => {
  dispatch(setStocksLoading());
  axios.get('/api/stocks').then(res =>
    dispatch({
      type: GET_STOCKS,
      payload: res.data
    })
  );
};

export const addStock = (stock) => dispatch => {
  axios.post('/api/stocks', stock).then(res =>
    dispatch({
      type: ADD_STOCK,
      payload: res.data
    })
  );
};

export const deleteStock = (_id) => dispatch => {
  axios.delete(`/api/stocks/${_id}`).then(res =>
    dispatch({
      type: DELETE_STOCK,
      payload: _id
    })
  );
};

export const setStocksLoading = () => {
  return {
    type: STOCKS_LOADING
  };
};
