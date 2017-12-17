import React, { Component, PureComponent } from 'react';
import socketIOClient from "socket.io-client";
import './css/bootstrap.css';
import './css/core.css';
import './css/fonts.css';
import './css/responsive.css';
import ReactTimeAgo from 'react-time-ago'
import Moment from 'react-moment';
import moment from 'moment'

class SpreadRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_updates: true
    };
  }

  tick() {
    this.setState({has_updates: false});
    this.interval = clearInterval(this.interval);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props) && nextState === this.state) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps === this.props) {
      return;
    } else {
      if (this.interval === undefined) {
        this.setState({has_updates: true});
        this.interval = setInterval(() => this.tick(), 2000);
      }
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
      <tr className={this.state.has_updates ? 'data updated-flash' : 'data'}>
        <td className="data-currency">{this.props.pair}</td>
        <td className="spread-overview-spread-price mobile d-price d-price2">{this.props.spread.spreadLastPrice}%</td>
        <td className="mobile d-price2">{this.props.spread.spreadLastPriceMinExchange[0]}</td>
        <td className="data-exchange mobile d-price">{this.props.spread.spreadLastPriceMinExchange[1]}</td>
        <td className="mobile d-price2">{this.props.spread.spreadLastPriceMaxExchange[0]}</td>
        <td className="data-exchange mobile d-price">{this.props.spread.spreadLastPriceMaxExchange[1]}</td>
        <td className="spread-overview-ba mobile d-bid">{this.props.spread.spreadBidAskMin[0]}%</td>
        <td className="spread-overview-ba mobile d-bid">{this.props.spread.spreadBidAskMax[0]}%</td>
        <td className="data-pair mobile-d-all"><ReactTimeAgo locale="en-GB">{new Date(this.props.spread.lastUpdated*1000)}</ReactTimeAgo></td>
        <td className="data-pair mobile-d-all"><ReactTimeAgo locale="en-GB">{new Date(this.props.spread.timeFound*1000)}</ReactTimeAgo></td>
      </tr>
    )
  }
}

class StatusRow extends React.Component {
  constructor() {
    super();
    this.state = {
      has_updates: true
    };
  }

  tick() {
    this.setState({has_updates: false});
    this.interval = clearInterval(this.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps === this.props) {
      return;
    } else {
      if (this.interval === undefined) {
        this.setState({has_updates: true});
        this.interval = setInterval(() => this.tick(), 1000);
      }
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  render() {
    return (
      <tbody><tr><td colSpan="13" className={this.state.has_updates ? 'table-updated-at mobile-d-all updated-flash' : 'table-updated-at mobile-d-all'}>{this.props.updated}</td></tr>
      </tbody>
    )
  }

}

class ExchangeStatusRow extends React.Component {
  readableTime(time) {
    return new Date(time*1000).toTimeString().split('GMT')[0];
  }
  makeTime(time) {
    return new Date(time*1000);
  }

  render() {
    return (
      <div>
        <table className="d-price">
          <thead>
            <th className="mobile d-all" colSpan={Object.keys(this.props.lastExchangeUpdates).length}>Exchange last update received</th>
            <tr>
              {Object.entries(this.props.lastExchangeUpdates).map((exchange) =>
                <td className="data-exchange mobile d-price">{exchange[0]}: <ReactTimeAgo locale="en-GB">{new Date(exchange[1]*1000)}</ReactTimeAgo></td>
              )}
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}

class PairRow extends React.Component {
  constructor() {
    super();
    this.state = {
      has_updates: true,
      sortBy: 'pair',
      sortAsc: true,
    };
  }

  updateSort(sortBy) {
    if (this.state.sortBy === sortBy) {
      this.setState({sortAsc: !this.state.sortAsc})
    } else {
      this.setState({sortBy: sortBy})
    }
  }

  render() {
    return (
      <div>
        <table className="d-price">
          <thead>
            <tr>
            <th className="sortable" onClick={() => this.updateSort('pair')}><span className="glyphicon glyphicon-triangle-bottom"></span>Currency</th>
            <th className="mobile sortable d-price d-price2" onClick={() => this.updateSort('spread')}>Price Spread</th>
            <th className="mobile d-price2">Last Low Price</th>
            <th className="mobile d-price">Low Exchange</th>
            <th className="mobile d-price2">Last High Price</th>
            <th className="mobile d-price">High Exchange</th>
            <th className="mobile d-bid">Low Bid/Ask Spread</th>
            <th className="mobile d-bid">High Bid/Ask Spread</th>
            <th className="mobile-d-all">Last updated</th>
            <th className="mobile-d-all">Time found</th>
            </tr>
          </thead>
          {Object.entries(this.props.spreads).filter(pair => pair[1].spreadLastPrice > 0).sort(
            (pairA, pairB) => {
              if (this.state.sortBy === 'pair') {
                return this.state.sortAsc ? pairA[0][0] > pairB[0][0] : pairA[0][0] < pairB[0][0];
              } else {
                return this.state.sortAsc ? pairA[1].spreadLastPrice > pairB[1].spreadLastPrice : pairA[1].spreadLastPrice < pairB[1].spreadLastPrice;
              }
            }
          ).map((pair) =>
            <SpreadRow key={pair[0]} pair={pair[0]} spread={pair[1]} />
          )}
        </table>
      </div>
    );
  }
}

class HistoryRow extends React.Component {
  render() {
    return (
      <div>
        <table className="d-price">
          <thead>
            <tr><td colSpan="13" className="table-updated-at mobile-d-all">History</td></tr>
          </thead>
          <thead>
            <tr>
            <th className="sortable" onClick={() => this.updateSort('pair')}><span className="glyphicon glyphicon-triangle-bottom"></span>Currency</th>
            <th className="mobile sortable d-price d-price2" onClick={() => this.updateSort('spread')}>Last Price Spread</th>
            <th className="mobile sortable d-price d-price2" onClick={() => this.updateSort('spread')}>Average Price Spread</th>
            <th className="mobile d-price2">Last Low Price</th>
            <th className="mobile d-price">Low Exchange</th>
            <th className="mobile d-price2">Last High Price</th>
            <th className="mobile d-price">High Exchange</th>
            <th className="mobile-d-all">Time found</th>
            <th className="mobile-d-all">Was alive</th>
            </tr>
          </thead>
          {this.props.history.map((data) =>
            <tr className='data'>
              <td className="data-currency">{data.pair}</td>
              <td className="spread-overview-spread-price mobile d-price d-price2">{data.arbitrage.spread_percent.toFixed(2)}%</td>
              <td className="spread-overview-spread-price mobile d-price d-price2">{data.average_spread.toFixed(2)}%</td>
              <td className="mobile d-price2">{data.arbitrage.lowestAskPrice.toFixed(8)}</td>
              <td className="data-exchange mobile d-price">{data.arbitrage.lowestAskExchange}</td>
              <td className="mobile d-price2">{data.arbitrage.highestBidPrice.toFixed(8)}</td>
              <td className="data-exchange mobile d-price">{data.arbitrage.highestBidExchange}</td>
              <td className="data-pair mobile-d-all"><Moment date={new Date(data.time_found*1000)} format="h:mm:ss"/></td>
              <td className="data-pair mobile-d-all">{moment.duration(data.finished-data.time_found, "seconds").humanize()}</td>
            </tr>
          )}
        </table>
      </div>
    );
  }
}


class App extends Component {
  constructor() {
    super();
    var endpoint = "http://localhost:8081/chat";
    if (process.env.NODE_ENV === 'production') {
      endpoint = "http://107.170.61.147:8081/chat";
    }
    this.state = {
      lastTimestamp: false,
      endpoint: endpoint,
      history: [],
      last_exchange_updates: []
    };
    this.lastTimestamp = null;
    this.pair = null;
    this.response = false;
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("publicView", data => this.parseData(data));
    socket.on("status", data => this.parseStatus(data));
    socket.on("history", data => this.parseHistory(data));
  }

  parseData(data) {
    // this.setState({ response: data })
    for (var timestamp in data['data'][0]) {
        this.setState({lastTimestamp: timestamp,
                       spreads: data['data'][0][timestamp].spreads.pairs})
    }
  }

  parseStatus(data) {
    this.setState({last_exchange_updates: data.lastExchangeUpdates})
  }

  parseHistory(data) {
    this.state.history.unshift(data)
    this.state.history = this.state.history.slice(0, 29)
    this.setState({history: this.state.history})
  }

  render() {
    this.response = this.state['lastTimestamp'];
    //this.state['lastTimestamp'].spreads.pairs
    var history = this.state.history;
    //history.reverse();
    return (
      <div className="App">
        <div className="App-intro">
          {this.state.last_exchange_updates ?
            <ExchangeStatusRow lastExchangeUpdates={this.state.last_exchange_updates}/> :
            <p></p>
          }
          {this.response
            ? <div>
              <PairRow updated={new Date(this.response*1000).toString()} spreads={this.state.spreads}/>
            </div>
            : <p className="loading"> Waiting for spreads data... </p> }
          {this.state.history.length > 0 ?
            <HistoryRow history={history}/> :
            <p></p>
          }
        </div>
      </div>
    );
  }
}

export default App;
