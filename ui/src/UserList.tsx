import { useQuery } from '@apollo/react-hooks';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { SortDirection } from '@material-ui/core/TableCell';
import gql from 'graphql-tag';
import React from 'react';
import './UserList.css';

const styles = createStyles(theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: 'auto',
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300,
  },
}));

const GET_USER = gql`
  query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_UserOrdering]
    $filter: _UserFilter
  ) {
    User(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
      avgStars
      numReviews
    }
  }
`;

function UserList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState<SortDirection>('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ usernameFilter: '' });

  const getFilter = () =>
    filterState.usernameFilter.length > 0
      ? { name_contains: filterState.usernameFilter }
      : {};

  const { loading, data, error } = useQuery(GET_USER, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: orderBy + '_' + order,
      filter: getFilter(),
    },
  });

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder: SortDirection = 'desc';

    if (orderBy === property && order === 'desc') {
      newOrder = 'asc';
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const handleFilterChange = filterName => event => {
    const val = event.target.value;

    setFilterState(oldFilterState => ({
      ...oldFilterState,
      [filterName]: val,
    }));
  };

  const direction = order || 'asc';

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        User List
      </Typography>
      <TextField
        id="search"
        label="User Name Contains"
        className={classes.textField}
        value={filterState.usernameFilter}
        onChange={handleFilterChange('usernameFilter')}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                key="name"
                sortDirection={orderBy === 'name' ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={direction}
                    onClick={() => handleSortRequest('name')}
                  >
                    Name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell
                key="avgStars"
                sortDirection={orderBy === 'avgStars' ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-end" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === 'avgStars'}
                    direction={direction}
                    onClick={() => handleSortRequest('avgStars')}
                  >
                    Average Stars
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell
                key="numReviews"
                sortDirection={orderBy === 'numReviews' ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === 'numReviews'}
                    direction={direction}
                    onClick={() => handleSortRequest('numReviews')}
                  >
                    Number of Reviews
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.User.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell>
                    {n.avgStars ? n.avgStars.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell>{n.numReviews}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(UserList);
