import * as ECharts from 'echarts/lib/echarts';
import Wrapper from './wrapper.jsx';

const IEcharts = Wrapper(ECharts);
IEcharts.__echarts__ = ECharts;
export default IEcharts;
