import {
	GET_STOCKS,
	ADD_STOCK,
	DELETE_STOCK,
	STOCKS_LOADING
} from '../actions/types';

const initialState = {
	//stocks: [],
	stocks: [],
	loading: false
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_STOCKS:
			return {
				// ...state
				...state,
				stocks: action.payload,
				loading: false
			};
		case DELETE_STOCK:
			return {
				...state,
				stocks: state.stocks.filter(stock => stock._id !== action.payload)
			};
		case ADD_STOCK:
			return {
				...state,
				stocks: [action.payload, ...state.stocks]
			};
		case STOCKS_LOADING:
			return {
				...state,
				loading: true
			};
		default:
			return state;
	}
}
