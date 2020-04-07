import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Resize from 'element-resize-detector';

function wrapECharts(ECharts) {
  class IEcharts extends React.Component {
    constructor(props) {
      // console.log('constructor', props);
      super(props);
      this.state = {
        // init: true
        fnResize: null,
        resize: null,
        instance: null
      };
    }
    // componentWillMount() {
      // const that = this;
      // console.log('componentWillMount', that.props, that.state);
    // }
    componentDidMount() {
      const that = this;
      // console.log('componentDidMount', that.props, that.state);
      that._init();
    }
    componentWillReceiveProps(nextProps) {
      const that = this;
      // console.log('componentWillReceiveProps', that.props, nextProps);
      if (that.state.instance && (that.props.loading !== nextProps.loading)) {
        if (nextProps.loading) {
          that.state.instance.showLoading('default', that.props.optsLoading);
        } else {
          that.state.instance.hideLoading();
        }
      }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //   const that = this;
    //   // console.log('shouldComponentUpdate', that.props, nextProps, that.state, nextState);
    //   return (!that.state.instance
    //     || (nextProps.group !== that.props.group)
    //   );
    //   // return (that.state.init || !_isEqual(nextProps.option, that.props.option));
    // }
    // componentWillUpdate(nextProps, nextState) {
      // const that = this;
      // console.log('componentWillUpdate', that.props, nextProps, that.state, nextState);
    // }
    componentDidUpdate(prevProps, prevState) {
      const that = this;
      // console.log('componentDidUpdate', prevProps, that.props, prevState, that.state);
      if (that.props.option) {
        that._update();
        // that._resize();
      }
    }
    componentWillUnmount() {
      const that = this;
      // console.log('componentWillUnmount', that.props, that.state);
      if (that.state.resize && that.state.resize.uninstall) {
        const dom = ReactDOM.findDOMNode(that);
        that.state.resize.uninstall(dom);
      }
      if (that.state.fnResize && that.state.fnResize.cancel) {
        that.state.fnResize.cancel();
      }
      if (that.state.instance) {
        that.state.instance.dispose();
      }
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.dispose();
      // }
    }
    _init = () => {
      const that = this;
      // console.log('_init');
      // let instance = that._getInstance();
      // if (!instance) {
      if (!that.state.instance) {
        const dom = ReactDOM.findDOMNode(that);
        let instance = ECharts.getInstanceByDom(dom);
        if (!instance) {
          instance = ECharts.init(dom, that.props.theme, that.props.initOpts);
        }
        if (that.props.loading) {
          instance.showLoading('default', that.props.optsLoading);
        } else {
          instance.hideLoading();
        }
        instance.group = that.props.group;
        that._bind(instance);
        let resize = null;
        let fnResize = that.state.fnResize || _.throttle(that._resize, 250, {
          leading: true,
          trailing: true
        });
        if (that.props.resizable) {
          resize = that.state.resize || Resize({
            strategy: 'scroll' // <- For ultra performance.
          });
          resize.listenTo(dom, function(element) {
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            // that._resize();
            fnResize({
              width,
              height,
              silent: false
            });
          });
        }
        that.props.onReady(instance, ECharts);
        that.setState({
          // init: false
          resize: resize,
          fnResize: fnResize,
          instance: instance
        });
      }
    }
    _update = () => {
      const that = this;
      // console.log('_update');
      that.state.instance.setOption(that.props.option, that.props.notMerge, that.props.lazyUpdate);
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.setOption(that.props.option, that.props.notMerge, that.props.lazyUpdate);
      // }
    }
    _resize = (opts) => {
      const that = this;
      // console.log('_resize');
      const width = opts && opts.width;
      const height = opts && opts.height;
      that.props.onResize(width, height);
      if (that.state.instance){
        that.state.instance.resize(opts);
      }
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.resize(opts);
      // }
    }
    _getInstance = () => {
      const that = this;
      // console.log('_getInstance');
      return ECharts.getInstanceByDom(ReactDOM.findDOMNode(that));
    }
    _bind = (instance) => {
      const that = this;
      // console.log('_bind');
      const _on = function(name, func) {
        if (typeof func === 'function') {
          func = func.bind(instance);
          instance.off(name, func);
          instance.on(name, func);
        }
      };
      for (let e in that.props.onEvents) {
        if (Array.hasOwnProperty.call(that.props.onEvents, e)) {
          _on(e.toLowerCase(), that.props.onEvents[e]);
        }
      }
    }
    render() {
      const that = this;
      // console.log('render');
      const {
        className, style
      } = that.props;

      return (
        <div className={className} style={style} />
      );
    }
  }

  IEcharts.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    theme: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    group: PropTypes.string,
    option: PropTypes.object.isRequired,
    initOpts: PropTypes.object,
    notMerge: PropTypes.bool,
    lazyUpdate: PropTypes.bool,
    loading: PropTypes.bool,
    optsLoading: PropTypes.object,
    onReady: PropTypes.func,
    onResize: PropTypes.func,
    resizable: PropTypes.bool,
    onEvents: PropTypes.object
  };

  IEcharts.defaultProps = {
    className: 'react-echarts',
    style: {
      width: '100%',
      height: '100%'
    },
    notMerge: false,
    lazyUpdate: false,
    onReady: function(instance, ECharts) {},
    onResize: function(width, height) {},
    loading: false,
    resizable: false,
    onEvents: {}
  };

  return IEcharts;
}

export default wrapECharts;
