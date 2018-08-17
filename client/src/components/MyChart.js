import ReactHighstock from 'react-highcharts/ReactHighstock';
import setTheme from './theme';

let MyHighcharts = ReactHighstock.Highcharts;
setTheme(MyHighcharts);

export default MyHighcharts; 
