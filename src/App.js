import React, { Component, PureComponent } from 'react';
import socketIOClient from "socket.io-client";
import './css/bootstrap.css';
import './css/core.css';
import './css/fonts.css';
import './css/responsive.css';

class SpreadRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      has_updates: true
    };
  }

  tick() {
    this.setState({has_updates: false});
    clearInterval(this.interval);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps) == JSON.stringify(this.props) && nextState == this.state) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps == this.props) {
      return;
    } else {
      this.setState({has_updates: true});
      this.interval = setInterval(() => this.tick(), 2000);
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 2000);
  }

  readableTime(time) {
    return new Date(time*1000).toTimeString().split('GMT')[0];
  }

  render() {
    return (
      <tr class={this.state.has_updates ? 'data updated-flash' : 'data'}>
        <td class="data-currency">{this.props.pair}</td>
        <td class="data-pair mobile-d-all">{this.props.pair}</td>
        <td class="spread-overview-spread-price mobile d-price d-price2">{this.props.spread.spreadLastPrice}%</td>
        <td class="mobile d-price2">{this.props.spread.spreadLastPriceMinExchange[0]}</td>
        <td class="data-exchange mobile d-price">{this.props.spread.spreadLastPriceMinExchange[1]}</td>
        <td class="mobile d-price2">{this.props.spread.spreadLastPriceMaxExchange[0]}</td>
        <td class="data-exchange mobile d-price">{this.props.spread.spreadLastPriceMaxExchange[1]}</td>
        <td class="spread-overview-ba mobile d-bid">{this.props.spread.spreadBidAskMin[0]}%</td>
        <td class="data-exchange mobile d-bid">{this.props.spread.spreadBidAskMin[1]}</td>
        <td class="spread-overview-ba mobile d-bid">{this.props.spread.spreadBidAskMax[0]}%</td>
        <td class="data-exchange mobile d-bid">{this.props.spread.spreadBidAskMax[1]}</td>
        <td class="data-pair mobile-d-all">{this.readableTime(this.props.spread.lastUpdated)}</td>
        <td class="data-pair mobile-d-all">{this.readableTime(this.props.spread.timeFound)}</td>
      </tr>
    )
  }
}

class PairRow extends React.Component {
  constructor() {
    super();
    this.state = {
      has_updates: true
    };
  }

  tick() {
    this.setState({has_updates: false});
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps == this.props) {
      return;
    } else {
      this.setState({has_updates: true});
      this.interval = setInterval(() => this.tick(), 1000);
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  render() {
    return (
      <div>
        <table class="d-price">
          <thead>
            <tr>
            <th>Currency</th>
            <th class="mobile-d-all">Pair</th>
            <th class="mobile d-price d-price2">Price Spread</th>
            <th class="mobile d-price2">Last Low Price</th>
            <th class="mobile d-price">Low Exchange</th>
            <th class="mobile d-price2">Last High Price</th>
            <th class="mobile d-price">High Exchange</th>
            <th class="mobile d-bid">Low Bid/Ask Spread</th>
            <th class="mobile d-bid">Low B/A Exchange</th>
            <th class="mobile d-bid">High Bid/Ask Spread</th>
            <th class="mobile d-bid">High B/A Exchange</th>
            <th class="mobile-d-all">Last updated</th>
            <th class="mobile-d-all">Time found</th>
            </tr>
          </thead>
          <tbody><tr><td colspan="13" class={this.state.has_updates ? 'table-updated-at mobile-d-all updated-flash' : 'table-updated-at mobile-d-all'}>{this.props.updated}</td></tr>
          </tbody>
          {Object.entries(this.props.spreads).filter(pair => pair[1].spreadLastPrice > 0).map((pair) =>
            <SpreadRow key={pair[0]} pair={pair[0]} spread={pair[1]} />
          )}
        </table>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      lastTimestamp: false,
      endpoint: "http://localhost:8080/chat"
    };
    this.lastTimestamp = null;
    this.pair = null;
    this.response = false;
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("publicView", data => this.parseData(data));
  }

  parseData(data) {
    // this.setState({ response: data })
    for (var timestamp in data['data'][0]) {
        this.setState({lastTimestamp: timestamp, spreads: data['data'][0][timestamp].spreads.pairs})
    }
  }

  render() {
    this.response = this.state['lastTimestamp'];
    //this.state['lastTimestamp'].spreads.pairs
    return (
      <div className="App">
        <p className="App-intro">
          {this.response
            ? <PairRow updated={new Date(this.response*1000).toString()} spreads={this.state.spreads}/>
            : <p class="loading"> Waiting for data... </p> }
        </p>
      </div>
    );
  }
}

export default App;
