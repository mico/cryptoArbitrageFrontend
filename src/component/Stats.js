import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';
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
  render () {
    return (
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
        {[...this.props.pairs].map(([pair, data]) =>
          <Table.Row>
            <Table.Cell>{pair}</Table.Cell>
            <Table.Cell positive>{data.mean.toFixed(2)}%</Table.Cell>
            <Table.Cell positive>{data.max.toFixed(2)}%</Table.Cell>
            <Table.Cell>{moment.duration(data.count, "seconds").humanize()}</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    );
  }
};

Stats.propTypes = {
  pairs: PropTypes.array,
};

export default Stats;
