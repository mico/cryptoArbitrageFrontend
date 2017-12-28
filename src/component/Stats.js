import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Menu } from 'semantic-ui-react';
import Moment from 'react-moment';
import moment from 'moment';

class StatsPair extends React.Component {
  handleClick = () => {
    //this.props.clickHandler(this.props.name);
  }

  render() {
    return (<Button>{this.props.name}</Button>);
  }
};

class Stats extends React.Component {
  constructor() {
    super();
    this.state = {
      period: '24h',
      selected: '',
    }
  }
  render () {
    return (
      <div>
      <Menu secondary>
        <Menu.Item name='24h' active={this.state.period == '24h'} onClick={() => this.setState({period: '24h'})} />
        <Menu.Item name='week' active={this.state.period == 'week'} onClick={() => this.setState({period: 'week'})} />
        <Menu.Item name='month' active={this.state.period == 'month'} onClick={() => this.setState({period: 'month'})} />
        <p>(Not working yet)</p>
      </Menu>
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Average Spread</Table.HeaderCell>
            <Table.HeaderCell>Maximum Spread</Table.HeaderCell>
            <Table.HeaderCell>Was active last 24h</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {[...Object.entries(this.props.pairs.general)].map(([pair, data]) =>
          [<Table.Row key={pair} data-id={pair} onClick={(event) => this.setState({selected: event.currentTarget.dataset.id})}>
            <Table.Cell>{pair}</Table.Cell>
            <Table.Cell positive>{data.mean.toFixed(2)}%</Table.Cell>
            <Table.Cell positive>{data.max.toFixed(2)}%</Table.Cell>
            <Table.Cell>{moment.duration(data.count, "seconds").humanize()}</Table.Cell>
          </Table.Row>,
          pair === this.state.selected ?
            <Table.Row>
            <Table.Cell colSpan="5" width="100%">
              <Table compact>
              <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Low Exchange</Table.HeaderCell>
                <Table.HeaderCell>High Exchange</Table.HeaderCell>
                <Table.HeaderCell>Average Spread</Table.HeaderCell>
                <Table.HeaderCell>Was active last 24h</Table.HeaderCell>
              </Table.Row>
              </Table.Header>

              <Table.Body>
              {this.props.pairs.pairs.map((data) =>
                data.pair === pair ?
                <Table.Row>
                  <Table.Cell>{data.lowExchange}</Table.Cell>
                  <Table.Cell>{data.highExchange}</Table.Cell>
                  <Table.Cell positive>{data.mean.toFixed(2)}%</Table.Cell>
                  <Table.Cell>{moment.duration(data.count, "seconds").humanize()}</Table.Cell>
                </Table.Row> : ""
              )}
              </Table.Body>
              </Table>
            </Table.Cell>
            </Table.Row> : ""]
        )}
        </Table.Body>
      </Table>
      </div>
    );
  }
};

Stats.propTypes = {
  pairs: PropTypes.array,
};

export default Stats;
