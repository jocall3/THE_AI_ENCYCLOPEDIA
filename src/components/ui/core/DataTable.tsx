
import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import SearchIcon from '@mui/icons-material/Search';
import { alpha } from '@mui/material/styles';
import {
  useTheme,
  createStyles,
  makeStyles,
  Theme,
  SxProps,
} from '@mui/styles';

interface DataTableProps<T> {
  columns: {
    id: keyof T;
    label: string;
    numeric?: boolean;
    render?: (row: T) => React.ReactNode;
  }[];
  data: T[];
  onRowClick?: (row: T) => void;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  getRowId?: (row: T) => React.Key;
  searchableColumns?: (keyof T)[];
  sx?: SxProps<Theme>;
}

interface EnhancedTableProps<T> extends DataTableProps<T> {
  order: 'asc' | 'desc';
  orderBy: keyof T | null;
  onRequestSort: (property: keyof T) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredData: T[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T>(order: 'asc' | 'desc', orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useEnhancedTableHeadStyles = makeStyles((theme: Theme) =>
  createStyles({
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

function EnhancedTableHead<T>(props: {
  columns: {
    id: keyof T;
    label: string;
    numeric?: boolean;
    render?: (row: T) => React.ReactNode;
  }[];
  order: 'asc' | 'desc';
  orderBy: keyof T | null;
  onRequestSort: (property: keyof T) => void;
}) {
  const { order, orderBy, onRequestSort, columns } = props;
  const classes = useEnhancedTableHeadStyles();
  const createSortHandler =
    (property: keyof any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(property);
    };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useEnhancedTableToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.mode === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: alpha(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.background.paper, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.25),
      },
      marginRight: theme.spacing(2),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  })
);

function EnhancedTableToolbar<T>(props: {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
}) {
  const classes = useEnhancedTableToolbarStyles();

  return (
    <div className={classes.root}>
      <TextField
        placeholder="Search"
        value={props.searchText}
        onChange={props.handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        className={classes.search}
      />
    </div>
  );
}

function DataTable<T>(props: DataTableProps<T>) {
  const {
    columns,
    data,
    onRowClick,
    pageSizeOptions = [5, 10, 25],
    defaultPageSize = 10,
    getRowId = (row: T) => (row as any).id,
    searchableColumns = [],
    sx,
  } = props;
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [searchText, setSearchText] = useState('');

  const handleRequestSort = useCallback(
    (property: keyof T) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const filteredData = useMemo(() => {
    if (!searchText) {
      return data;
    }

    const lowerCaseSearchText = searchText.toLowerCase();

    return data.filter((row) => {
      return searchableColumns.some((column) => {
        const value = String((row as any)[column]).toLowerCase();
        return value.includes(lowerCaseSearchText);
      });
    });
  }, [data, searchText, searchableColumns]);

  const sortedData = useMemo(() => {
    if (!orderBy) {
      return filteredData;
    }
    return stableSort(filteredData, getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage);

  const theme = useTheme();
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }));
  const classes = useStyles();

  return (
    <div className={classes.root} style={sx}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          searchText={searchText}
          handleSearchChange={handleSearchChange}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              columns={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const rowId = getRowId(row);
                  const isItemSelected = false; // Implement selection logic if needed

                  return (
                    <TableRow
                      hover
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={rowId}
                      selected={isItemSelected}
                    >
                      {columns.map((column) => (
                        <TableCell key={`${rowId}-${column.id}`} align={column.numeric ? 'right' : 'left'}>
                          {column.render ? column.render(row) : (row as any)[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={columns.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default DataTable;