import React from 'react';
import ReactDOM from 'react-dom';
import _isEqual from 'lodash.isequal';
import ResizeEvent from 'element-resize-event';

function wrapECharts(ECharts) {
  class IECharts extends React.Component {
    constructor(props) {
      // console.log('constructor', props);
      super(props);
      this.state = {
        // init: true
        instance: null
      };
      this._init = this._init.bind(this);
      this._update = this._update.bind(this);
      this._resize = this._resize.bind(this);
      this._getInstance = this._getInstance.bind(this);
    }
    _init() {
      const that = this;
      // console.log('_init');
      // let instance = that._getInstance();
      // if (!instance) {
      if (!that.state.instance) {
        const dom = ReactDOM.findDOMNode(that);
        let instance = ECharts.getInstanceByDom(dom);
        if (!instance) {
          instance = ECharts.init(dom);
        }
        that.setState({
          // init: false
          instance: instance
        });
        ResizeEvent(dom, that._resize);
      }
    }
    _update() {
      const that = this;
      // console.log('_update');
      that.state.instance.setOption(that.props.option);
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.setOption(that.props.option);
      // }
    }
    _resize() {
      const that = this;
      // console.log('_resize');
      that.state.instance.resize();
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.resize();
      // }
    }
    _getInstance() {
      const that = this;
      // console.log('_getInstance');
      return ECharts.getInstanceByDom(ReactDOM.findDOMNode(that));
    }
    componentWillMount() {
      const that = this;
      // console.log('componentWillMount');
    }
    componentDidMount() {
      const that = this;
      // console.log('componentDidMount');
      that._init();
    }
    componentWillReceiveProps(nextProps) {
      const that = this;
      // console.log('componentWillReceiveProps', that.props, nextProps);
    }
    shouldComponentUpdate(nextProps, nextState) {
      const that = this;
      // console.log('shouldComponentUpdate', that.props, nextProps, that.state, nextState);
      return (!that.state.instance || !_isEqual(nextProps.option, that.props.option));
      // return (that.state.init || !_isEqual(nextProps.option, that.props.option));
    }
    componentWillUpdate(nextProps, nextState) {
      const that = this;
      // console.log('componentWillUpdate', that.props, nextProps, that.state, nextState);
    }
    componentDidUpdate(prevProps, prevState) {
      const that = this;
      // console.log('componentDidUpdate', prevProps, that.props, prevState, that.state);
      if (that.props.option) {
        that._update();
        that._resize();
      }
    }
    componentWillUnmount() {
      const that = this;
      // console.log('componentWillUnmount');
      that.state.instance.dispose(ReactDOM.findDOMNode(that));
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.dispose(ReactDOM.findDOMNode(that));
      // }
    }
    render() {
      const that = this;
      // console.log('render');
      return (
        <div style={that.props.style}></div>
      );
    }
  }

  IECharts.propTypes = {
    option: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  IECharts.defaultProps = {
    style: { width: '100%', height: '100%' }
  };

  return IECharts;
}

export default wrapECharts;
