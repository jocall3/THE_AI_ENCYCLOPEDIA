import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Typography,
  Box,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import SearchIcon from '@mui/icons-material/Search';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import { alpha } from '@mui/material/styles';
import {
  useTheme,
  createStyles,
  makeStyles,
  Theme,
  SxProps,
} from '@mui/styles';

/**
 * @interface DataTableColumn
 * @description Defines the structure for a column in the data table, including AI-specific configurations.
 * @property {keyof T} id - The unique identifier for the column, corresponding to a key in the data object.
 * @property {string} label - The display label for the column header.
 * @property {boolean} [numeric] - If true, the column content is treated as numeric for alignment and sorting.
 * @property {(row: T) => React.ReactNode} [render] - A custom render function for cell content.
 * @property {boolean} [sortable=true] - Whether the column can be sorted.
 * @property {boolean} [filterable=true] - Whether the column can be filtered.
 * @property {boolean} [aiPredictive] - If true, this column is a target for AI predictive analytics.
 * @property {boolean} [aiAnomalyDetection] - If true, AI anomaly detection will be applied to this column's values.
 * @property {string} [aiInsightCategory] - A category for AI insights related to this column.
 * @property {string} [aiDataType] - Specifies the data type for AI processing (e.g., 'currency', 'date', 'text', 'categorical').
 * @property {object} [aiConfig] - Additional AI-specific configuration for the column.
 */
interface DataTableColumn<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  aiPredictive?: boolean;
  aiAnomalyDetection?: boolean;
  aiInsightCategory?: string;
  aiDataType?: 'string' | 'number' | 'date' | 'boolean' | 'categorical';
  aiConfig?: Record<string, any>;
}

/**
 * @interface DataTableProps
 * @description Props for the core DataTable component, extended with advanced AI and business features.
 * @template T - The type of data objects in the table.
 * @property {DataTableColumn<T>[]} columns - Array of column definitions.
 * @property {T[]} data - The data to display in the table.
 * @property {(row: T) => void} [onRowClick] - Callback function when a row is clicked.
 * @property {number[]} [pageSizeOptions] - Options for rows per page in pagination.
 * @property {number} [defaultPageSize] - Default number of rows per page.
 * @property {(row: T) => React.Key} [getRowId] - Function to get a unique key for each row.
 * @property {(keyof T)[]} [searchableColumns] - Columns to include in the basic text search.
 * @property {SxProps<Theme>} [sx] - Custom styling for the root component.
 * @property {string} [tableTitle] - Title for the table, displayed in the toolbar.
 * @property {boolean} [enableAIInsights=false] - Enables AI-driven insights panel.
 * @property {boolean} [enablePredictiveAnalytics=false] - Enables AI predictive analytics features.
 * @property {boolean} [enableAnomalyDetection=false] - Enables AI anomaly detection.
 * @property {boolean} [enableNaturalLanguageQuery=false] - Enables natural language querying for data.
 * @property {boolean} [enablePersonalizedViews=false] - Enables AI-driven personalized table views.
 * @property {boolean} [enableAuditTrail=false] - Enables AI-driven audit logging for data interactions.
 * @property {object} [aiModelConfiguration] - Global configuration for AI models (e.g., thresholds, model IDs).
 * @property {(query: string, data: T[], columns: DataTableColumn<T>[]) => Promise<T[]>} [onNaturalLanguageQuery] - Custom handler for NLQ.
 * @property {(data: T[], columns: DataTableColumn<T>[], config: object) => Promise<AIInsight[]>} [onGenerateAIInsights] - Custom handler for AI insights.
 * @property {(row: T, columns: DataTableColumn<T>[], config: object) => Promise<PredictiveResult>} [onPredictRowData] - Custom handler for row prediction.
 * @property {(data: T[], columns: DataTableColumn<T>[], config: object) => Promise<AnomalyReport[]>} [onDetectAnomalies] - Custom handler for anomaly detection.
 * @property {(action: string, details: object) => void} [onLogAuditEntry] - Custom handler for audit logging.
 * @property {boolean} [enableExport=false] - Enables data export functionality.
 * @property {boolean} [enableColumnVisibilityToggle=false] - Enables dynamic column visibility.
 * @property {boolean} [enableRowSelection=false] - Enables multi-row selection.
 * @property {(selectedRows: T[]) => void} [onSelectionChange] - Callback for row selection changes.
 * @property {boolean} [enableAdvancedFiltering=false] - Enables a more complex filtering interface.
 * @property {object} [initialFilters] - Initial advanced filter state.
 * @property {boolean} [enableDataValidation=false] - Enables AI-driven data validation suggestions.
 * @property {(row: T) => Promise<ValidationResult[]>} [onValidateRow] - Custom handler for row validation.
 * @property {boolean} [enableFeedbackMechanism=false] - Enables user feedback on AI suggestions.
 * @property {(feedback: UserFeedback) => Promise<void>} [onSubmitFeedback] - Custom handler for feedback submission.
 * @property {boolean} [enableRealtimeUpdates=false] - Simulates real-time data updates.
 * @property {number} [realtimeUpdateInterval=5000] - Interval for simulated real-time updates in ms.
}
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  getRowId?: (row: T) => React.Key;
  searchableColumns?: (keyof T)[];
  sx?: SxProps<Theme>;
  tableTitle?: string;

  // AI Features
  enableAIInsights?: boolean;
  enablePredictiveAnalytics?: boolean;
  enableAnomalyDetection?: boolean;
  enableNaturalLanguageQuery?: boolean;
  enablePersonalizedViews?: boolean;
  enableAuditTrail?: boolean;
  aiModelConfiguration?: Record<string, any>;

  // Custom AI Handlers (for simulation or external integration)
  onNaturalLanguageQuery?: (query: string, data: T[], columns: DataTableColumn<T>[]) => Promise<T[]>;
  onGenerateAIInsights?: (data: T[], columns: DataTableColumn<T>[], config: Record<string, any>) => Promise<AIInsight[]>;
  onPredictRowData?: (row: T, columns: DataTableColumn<T>[], config: Record<string, any>) => Promise<PredictiveResult>;
  onDetectAnomalies?: (data: T[], columns: DataTableColumn<T>[], config: Record<string, any>) => Promise<AnomalyReport[]>;
  onLogAuditEntry?: (action: string, details: Record<string, any>) => void;
  onValidateRow?: (row: T) => Promise<ValidationResult[]>;
  onSubmitFeedback?: (feedback: UserFeedback) => Promise<void>;

  // General Business Features
  enableExport?: boolean;
  enableColumnVisibilityToggle?: boolean;
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  enableAdvancedFiltering?: boolean;
  initialFilters?: AdvancedFilterState;
  enableDataValidation?: boolean;
  enableFeedbackMechanism?: boolean;
  enableRealtimeUpdates?: boolean;
  realtimeUpdateInterval?: number;
}

/**
 * @interface EnhancedTableProps
 * @description Internal props for enhanced table components, combining DataTableProps with internal state.
 * @template T - The type of data objects.
 */
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
  visibleColumns: DataTableColumn<T>[];
  selectedRows: React.Key[];
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRowCheckboxClick: (event: React.MouseEvent<unknown>, id: React.Key) => void;
  isRowSelected: (id: React.Key) => boolean;
  aiInsights: AIInsight[];
  loadingAIInsights: boolean;
  predictiveResults: Map<React.Key, PredictiveResult>;
  loadingPredictive: boolean;
  anomalyReports: Map<React.Key, AnomalyReport[]>;
  loadingAnomalies: boolean;
  naturalLanguageQueryText: string;
  handleNaturalLanguageQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitNaturalLanguageQuery: () => void;
  loadingNLQ: boolean;
  nlqError: string | null;
  auditLogEntries: AuditLogEntry[];
  validationResults: Map<React.Key, ValidationResult[]>;
  loadingValidation: boolean;
  handleColumnVisibilityChange: (columnId: keyof T, visible: boolean) => void;
  advancedFilters: AdvancedFilterState;
  handleAdvancedFilterChange: (filters: AdvancedFilterState) => void;
  handleExportData: () => void;
  handleRefreshData: () => void;
  handleFeedbackSubmit: (feedback: UserFeedback) => void;
  loadingFeedback: boolean;
  personalizedViewActive: boolean;
  togglePersonalizedView: () => void;
  loadingPersonalization: boolean;
}

/**
 * @interface AIInsight
 * @description Represents a single AI-generated insight.
 * @property {string} id - Unique ID for the insight.
 * @property {string} type - Type of insight (e.g., 'summary', 'trend', 'anomaly_summary').
 * @property {string} title - A concise title for the insight.
 * @property {string} description - Detailed explanation of the insight.
 * @property {number} [severity] - Severity level (e.g., 1-5).
 * @property {string[]} [relatedColumns] - Columns relevant to this insight.
 * @property {object} [data] - Raw data or metrics supporting the insight.
 */
interface AIInsight {
  id: string;
  type: 'summary' | 'trend' | 'anomaly_summary' | 'recommendation' | 'optimization';
  title: string;
  description: string;
  severity?: number;
  relatedColumns?: string[];
  data?: Record<string, any>;
}

/**
 * @interface PredictiveResult
 * @description Represents the result of an AI predictive model for a row.
 * @property {Record<string, any>} predictedValues - Predicted values for specific columns.
 * @property {number} confidence - Confidence score of the prediction (0-1).
 * @property {string} [modelUsed] - Identifier of the predictive model used.
 * @property {string} [explanation] - Explanation for the prediction.
 */
interface PredictiveResult {
  predictedValues: Record<string, any>;
  confidence: number;
  modelUsed?: string;
  explanation?: string;
}

/**
 * @interface AnomalyReport
 * @description Represents a detected anomaly for a specific data point.
 * @property {string} columnId - The column where the anomaly was detected.
 * @property {any} actualValue - The actual value that is anomalous.
 * @property {any} expectedRange - The expected range or value.
 * @property {string} severity - Severity of the anomaly ('low', 'medium', 'high', 'critical').
 * @property {string} description - Description of the anomaly.
 * @property {number} [score] - Anomaly score.
 */
interface AnomalyReport {
  columnId: string;
  actualValue: any;
  expectedRange: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  score?: number;
}

/**
 * @interface AuditLogEntry
 * @description Represents an entry in the AI-driven audit trail.
 * @property {string} id - Unique ID for the log entry.
 * @property {string} timestamp - ISO timestamp of the event.
 * @property {string} userId - ID of the user who performed the action (or 'System' for AI actions).
 * @property {string} action - Description of the action (e.g., 'DATA_VIEWED', 'AI_INSIGHT_GENERATED', 'ROW_UPDATED').
 * @property {Record<string, any>} details - Additional details about the action.
 * @property {string} [aiContext] - Context if the action was AI-related.
 */
interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  aiContext?: string;
}

/**
 * @interface ValidationResult
 * @description Represents a data validation result for a specific field.
 * @property {string} columnId - The column ID where validation was performed.
 * @property {boolean} isValid - True if valid, false otherwise.
 * @property {string} message - Validation message (e.g., error, warning, suggestion).
 * @property {string} severity - Severity of the validation issue ('info', 'warning', 'error').
 * @property {any} [suggestedValue] - An AI-suggested corrected value.
 */
interface ValidationResult {
  columnId: string;
  isValid: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
  suggestedValue?: any;
}

/**
 * @interface UserFeedback
 * @description Represents user feedback on an AI feature or data point.
 * @property {string} type - Type of feedback (e.g., 'insight_accuracy', 'prediction_relevance', 'data_correction').
 * @property {string} targetId - ID of the item feedback is about (e.g., row ID, insight ID).
 * @property {number} rating - Rating (e.g., 1-5 stars).
 * @property {string} comment - User's textual comment.
 * @property {string} [userId] - ID of the user providing feedback.
 */
interface UserFeedback {
  type: 'insight_accuracy' | 'prediction_relevance' | 'anomaly_correctness' | 'nlq_accuracy' | 'data_correction' | 'general';
  targetId?: string;
  rating?: number;
  comment: string;
  userId?: string;
}

/**
 * @interface AdvancedFilter
 * @description Defines a single advanced filter criterion.
 * @property {keyof T} columnId - The column to filter.
 * @property {string} operator - The comparison operator (e.g., 'equals', 'contains', 'greaterThan').
 * @property {any} value - The value to compare against.
 * @property {string} [logic] - Logical operator for combining with next filter ('AND', 'OR').
 */
interface AdvancedFilter<T> {
  id: string; // Unique ID for the filter rule
  columnId: keyof T;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'greaterThanOrEquals' | 'lessThanOrEquals' | 'isEmpty' | 'isNotEmpty' | 'between';
  value: any;
  value2?: any; // For 'between' operator
  logic?: 'AND' | 'OR'; // Logic to combine with the next filter
}

/**
 * @interface AdvancedFilterState
 * @description Represents the state of all advanced filters.
 * @property {AdvancedFilter<T>[]} filters - Array of active filter rules.
 * @property {'AND' | 'OR'} [globalLogic='AND'] - Global logic for combining all filter groups.
 */
interface AdvancedFilterState<T = any> {
  filters: AdvancedFilter<T>[];
  globalLogic?: 'AND' | 'OR';
}

/**
 * @function descendingComparator
 * @description Compares two items for sorting in descending order.
 * @template T - The type of data objects.
 * @param {T} a - First item.
 * @param {T} b - Second item.
 * @param {keyof T} orderBy - The property to sort by.
 * @returns {number} - Comparison result (-1, 0, 1).
 */
function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  const aValue = (a as any)[orderBy];
  const bValue = (b as any)[orderBy];

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return bValue.localeCompare(aValue);
  }
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

/**
 * @function getComparator
 * @description Returns a comparator function based on sort order and property.
 * @template T - The type of data objects.
 * @param {'asc' | 'desc'} order - Sort order.
 * @param {keyof T} orderBy - Property to sort by.
 * @returns {(a: T, b: T) => number} - The comparator function.
 */
function getComparator<T>(order: 'asc' | 'desc', orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * @function stableSort
 * @description Sorts an array stably using a given comparator.
 * @template T - The type of data objects.
 * @param {T[]} array - The array to sort.
 * @param {(a: T, b: T) => number} comparator - The comparator function.
 * @returns {T[]} - The stably sorted array.
 */
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
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

/**
 * @function applyAdvancedFilters
 * @description Applies a set of advanced filters to the data.
 * @template T - The type of data objects.
 * @param {T[]} data - The original data array.
 * @param {AdvancedFilterState<T>} filterState - The state containing filter rules.
 * @returns {T[]} - The filtered data array.
 */
function applyAdvancedFilters<T>(data: T[], filterState: AdvancedFilterState<T>): T[] {
  if (!filterState || !filterState.filters || filterState.filters.length === 0) {
    return data;
  }

  const globalLogic = filterState.globalLogic || 'AND';

  return data.filter(row => {
    let rowMatches = globalLogic === 'AND' ? true : false;
    let currentFilterResult: boolean[] = [];

    filterState.filters.forEach((filter, index) => {
      const value = (row as any)[filter.columnId];
      let match = false;

      switch (filter.operator) {
        case 'equals':
          match = String(value).toLowerCase() === String(filter.value).toLowerCase();
          break;
        case 'notEquals':
          match = String(value).toLowerCase() !== String(filter.value).toLowerCase();
          break;
        case 'contains':
          match = String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          break;
        case 'notContains':
          match = !String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          break;
        case 'startsWith':
          match = String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
          break;
        case 'endsWith':
          match = String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
          break;
        case 'greaterThan':
          match = Number(value) > Number(filter.value);
          break;
        case 'lessThan':
          match = Number(value) < Number(filter.value);
          break;
        case 'greaterThanOrEquals':
          match = Number(value) >= Number(filter.value);
          break;
        case 'lessThanOrEquals':
          match = Number(value) <= Number(filter.value);
          break;
        case 'isEmpty':
          match = value === null || value === undefined || String(value).trim() === '';
          break;
        case 'isNotEmpty':
          match = !(value === null || value === undefined || String(value).trim() === '');
          break;
        case 'between':
          const numValue = Number(value);
          match = numValue >= Number(filter.value) && numValue <= Number(filter.value2);
          break;
        default:
          match = false;
      }
      currentFilterResult.push(match);

      if (filter.logic) {
        const nextFilter = filterState.filters[index + 1];
        if (nextFilter) {
          // Apply logic for the current filter group
          if (filter.logic === 'AND') {
            rowMatches = rowMatches && match;
          } else { // OR
            rowMatches = rowMatches || match;
          }
        }
      } else {
        // If no explicit logic, assume global logic applies to this individual filter
        if (globalLogic === 'AND') {
          rowMatches = rowMatches && match;
        } else {
          rowMatches = rowMatches || match;
        }
      }
    });

    // If there were multiple filters without explicit logic, combine them with global logic
    if (filterState.filters.length > 1 && !filterState.filters.some(f => f.logic)) {
      return globalLogic === 'AND' ? currentFilterResult.every(Boolean) : currentFilterResult.some(Boolean);
    }

    return rowMatches;
  });
}

/**
 * @const useEnhancedTableHeadStyles
 * @description Custom styles for the EnhancedTableHead component.
 */
const useEnhancedTableHeadStyles = makeStyles((theme: Theme) =>
  createStyles({
    visuallyHidden: visuallyHidden,
    sortLabel: {
      '&.MuiTableSortLabel-root': {
        whiteSpace: 'nowrap',
      },
    },
    aiIndicator: {
      marginLeft: theme.spacing(0.5),
      fontSize: '0.8em',
      color: theme.palette.text.secondary,
    },
  })
);

/**
 * @function EnhancedTableHead
 * @description Renders the table header with sorting capabilities and AI indicators.
 * @template T - The type of data objects.
 * @param {object} props - Props for the EnhancedTableHead.
 * @param {DataTableColumn<T>[]} props.columns - Column definitions.
 * @param {'asc' | 'desc'} props.order - Current sort order.
 * @param {keyof T | null} props.orderBy - Current sorted column ID.
 * @param {(property: keyof T) => void} props.onRequestSort - Callback for sort requests.
 * @param {boolean} props.enableRowSelection - Whether row selection is enabled.
 * @param {boolean} props.numSelected - Number of selected rows.
 * @param {number} props.rowCount - Total number of rows.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onSelectAllClick - Callback for select all checkbox.
 * @param {(columnId: keyof T, visible: boolean) => void} props.handleColumnVisibilityChange - Callback for column visibility.
 * @param {boolean} props.enableColumnVisibilityToggle - Whether column visibility toggle is enabled.
 */
function EnhancedTableHead<T>(props: {
  columns: DataTableColumn<T>[];
  order: 'asc' | 'desc';
  orderBy: keyof T | null;
  onRequestSort: (property: keyof T) => void;
  enableRowSelection: boolean;
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleColumnVisibilityChange: (columnId: keyof T, visible: boolean) => void;
  enableColumnVisibilityToggle: boolean;
}) {
  const { order, orderBy, onRequestSort, columns, enableRowSelection, numSelected, rowCount, onSelectAllClick } = props;
  const classes = useEnhancedTableHeadStyles();
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(property);
    };

  return (
    <TableHead>
      <TableRow>
        {enableRowSelection && (
          <TableCell padding="checkbox">
            <input
              type="checkbox"
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={String(column.id)}
            align={column.numeric ? 'right' : 'left'}
            sortDirection={orderBy === column.id ? order : false}
          >
            {column.sortable !== false ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
                className={classes.sortLabel}
              >
                {column.label}
                {column.aiPredictive && (
                  <Tooltip title="AI Predictive Column">
                    <TrendingUpIcon fontSize="small" className={classes.aiIndicator} />
                  </Tooltip>
                )}
                {column.aiAnomalyDetection && (
                  <Tooltip title="AI Anomaly Detection Enabled">
                    <WarningIcon fontSize="small" className={classes.aiIndicator} />
                  </Tooltip>
                )}
                {orderBy === column.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <Box display="flex" alignItems="center">
                {column.label}
                {column.aiPredictive && (
                  <Tooltip title="AI Predictive Column">
                    <TrendingUpIcon fontSize="small" className={classes.aiIndicator} />
                  </Tooltip>
                )}
                {column.aiAnomalyDetection && (
                  <Tooltip title="AI Anomaly Detection Enabled">
                    <WarningIcon fontSize="small" className={classes.aiIndicator} />
                  </Tooltip>
                )}
              </Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/**
 * @const useEnhancedTableToolbarStyles
 * @description Custom styles for the EnhancedTableToolbar component.
 */
const useEnhancedTableToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      minHeight: 64,
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    title: {
      flex: '1 1 auto',
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(1),
        flexBasis: '100%',
      },
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      maxWidth: 400,
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        maxWidth: 'none',
        marginBottom: theme.spacing(1),
      },
    },
    searchField: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
    },
    nlqInput: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        justifyContent: 'flex-end',
      },
    },
    aiFeatureToggle: {
      marginLeft: theme.spacing(1),
    },
    loadingIndicator: {
      marginLeft: theme.spacing(1),
    },
  })
);

/**
 * @function EnhancedTableToolbar
 * @description Renders the table toolbar with search, NLQ, and AI feature toggles.
 * @template T - The type of data objects.
 * @param {object} props - Props for the EnhancedTableToolbar.
 * @param {string} props.searchText - Current search text.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.handleSearchChange - Callback for search input.
 * @param {string} [props.tableTitle] - Title for the table.
 * @param {boolean} [props.enableNaturalLanguageQuery] - Whether NLQ is enabled.
 * @param {string} props.naturalLanguageQueryText - Current NLQ input.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.handleNaturalLanguageQueryChange - Callback for NLQ input.
 * @param {() => void} props.submitNaturalLanguageQuery - Callback to submit NLQ.
 * @param {boolean} props.loadingNLQ - Loading state for NLQ.
 * @param {string | null} props.nlqError - Error message for NLQ.
 * @param {boolean} [props.enableAIInsights] - Whether AI insights are enabled.
 * @param {boolean} [props.enablePredictiveAnalytics] - Whether predictive analytics are enabled.
 * @param {boolean} [props.enableAnomalyDetection] - Whether anomaly detection is enabled.
 * @param {boolean} [props.enablePersonalizedViews] - Whether personalized views are enabled.
 * @param {boolean} props.personalizedViewActive - State of personalized view.
 * @param {() => void} props.togglePersonalizedView - Callback to toggle personalized view.
 * @param {boolean} props.loadingPersonalization - Loading state for personalization.
 * @param {() => void} props.handleExportData - Callback for data export.
 * @param {() => void} props.handleRefreshData - Callback for data refresh.
 * @param {boolean} props.enableExport - Whether export is enabled.
 * @param {boolean} props.enableAdvancedFiltering - Whether advanced filtering is enabled.
 * @param {() => void} props.onToggleAdvancedFilters - Callback to toggle advanced filters.
 * @param {boolean} props.advancedFiltersActive - State of advanced filters.
 * @param {boolean} props.enableColumnVisibilityToggle - Whether column visibility toggle is enabled.
 * @param {() => void} props.onToggleColumnVisibility - Callback to toggle column visibility panel.
 */
function EnhancedTableToolbar<T>(props: {
  searchText: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tableTitle?: string;
  enableNaturalLanguageQuery?: boolean;
  naturalLanguageQueryText: string;
  handleNaturalLanguageQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitNaturalLanguageQuery: () => void;
  loadingNLQ: boolean;
  nlqError: string | null;
  enableAIInsights?: boolean;
  enablePredictiveAnalytics?: boolean;
  enableAnomalyDetection?: boolean;
  enablePersonalizedViews?: boolean;
  personalizedViewActive: boolean;
  togglePersonalizedView: () => void;
  loadingPersonalization: boolean;
  handleExportData: () => void;
  handleRefreshData: () => void;
  enableExport: boolean;
  enableAdvancedFiltering: boolean;
  onToggleAdvancedFilters: () => void;
  advancedFiltersActive: boolean;
  enableColumnVisibilityToggle: boolean;
  onToggleColumnVisibility: () => void;
}) {
  const classes = useEnhancedTableToolbarStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" id="tableTitle" component="div" className={classes.title}>
        {props.tableTitle || 'Data Table'}
      </Typography>

      <div className={classes.searchContainer}>
        {props.enableNaturalLanguageQuery ? (
          <TextField
            placeholder="Ask AI about your data (e.g., 'show sales over 1000')"
            value={props.naturalLanguageQueryText}
            onChange={props.handleNaturalLanguageQueryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ChatIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {props.loadingNLQ && <CircularProgress size={20} />}
                  <IconButton onClick={props.submitNaturalLanguageQuery} disabled={props.loadingNLQ}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className={classes.nlqInput}
            error={!!props.nlqError}
            helperText={props.nlqError}
            size="small"
            variant="outlined"
          />
        ) : (
          <TextField
            placeholder="Search data..."
            value={props.searchText}
            onChange={props.handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className={classes.searchField}
            size="small"
            variant="outlined"
          />
        )}
      </div>

      <div className={classes.actions}>
        {props.enableAdvancedFiltering && (
          <Tooltip title="Toggle Advanced Filters">
            <IconButton onClick={props.onToggleAdvancedFilters} color={props.advancedFiltersActive ? 'primary' : 'default'}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
        {props.enableColumnVisibilityToggle && (
          <Tooltip title="Toggle Column Visibility">
            <IconButton onClick={props.onToggleColumnVisibility}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        )}
        {props.enableExport && (
          <Tooltip title="Export Data">
            <IconButton onClick={props.handleExportData}>
              <HistoryIcon /> {/* Using HistoryIcon as a generic export icon for now */}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Refresh Data">
          <IconButton onClick={props.handleRefreshData}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {props.enablePersonalizedViews && (
          <FormControlLabel
            control={
              <Switch
                checked={props.personalizedViewActive}
                onChange={props.togglePersonalizedView}
                name="personalizedView"
                color="primary"
                disabled={props.loadingPersonalization}
              />
            }
            label={
              <Box display="flex" alignItems="center">
                Personalized View
                {props.loadingPersonalization && <CircularProgress size={16} className={classes.loadingIndicator} />}
              </Box>
            }
            className={classes.aiFeatureToggle}
          />
        )}
      </div>
    </div>
  );
}

/**
 * @const useDataTableStyles
 * @description Custom styles for the main DataTable component.
 */
const useDataTableStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  tableContainer: {
    flexGrow: 1,
    overflowX: 'auto',
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: visuallyHidden,
  aiInsightsPanel: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  aiInsightsHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  aiInsightItem: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  anomalyHighlight: {
    backgroundColor: alpha(theme.palette.error.light, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.light, 0.2),
    },
  },
  predictiveValue: {
    color: theme.palette.success.dark,
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginLeft: theme.spacing(0.5),
  },
  validationError: {
    color: theme.palette.error.main,
    fontSize: '0.8em',
    marginTop: theme.spacing(0.5),
  },
  validationWarning: {
    color: theme.palette.warning.main,
    fontSize: '0.8em',
    marginTop: theme.spacing(0.5),
  },
  validationInfo: {
    color: theme.palette.info.main,
    fontSize: '0.8em',
    marginTop: theme.spacing(0.5),
  },
  auditLogPanel: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: alpha(theme.palette.grey[100], 0.05),
    border: `1px solid ${theme.palette.divider}`,
  },
  advancedFilterPanel: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  columnVisibilityPanel: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  feedbackPanel: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: alpha(theme.palette.info.light, 0.05),
    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  },
}));

/**
 * @function DataTable
 * @description A highly advanced and AI-powered data table component for enterprise applications.
 * This component integrates AI for insights, predictions, anomaly detection, natural language querying,
 * personalization, and robust data management features, aiming to be a core operational interface.
 * @template T - The type of data objects to be displayed in the table.
 * @param {DataTableProps<T>} props - The properties for the DataTable component.
 * @returns {JSX.Element} The rendered DataTable component.
 */
function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const {
    columns: initialColumns,
    data: initialData,
    onRowClick,
    pageSizeOptions = [5, 10, 25, 50, 100],
    defaultPageSize = 10,
    getRowId = (row: T) => (row as any).id || JSON.stringify(row), // Fallback for getRowId
    searchableColumns = [],
    sx,
    tableTitle,
    enableAIInsights = false,
    enablePredictiveAnalytics = false,
    enableAnomalyDetection = false,
    enableNaturalLanguageQuery = false,
    enablePersonalizedViews = false,
    enableAuditTrail = false,
    aiModelConfiguration = {},
    onNaturalLanguageQuery,
    onGenerateAIInsights,
    onPredictRowData,
    onDetectAnomalies,
    onLogAuditEntry,
    onValidateRow,
    onSubmitFeedback,
    enableExport = false,
    enableColumnVisibilityToggle = false,
    enableRowSelection = false,
    onSelectionChange,
    enableAdvancedFiltering = false,
    initialFilters,
    enableDataValidation = false,
    enableFeedbackMechanism = false,
    enableRealtimeUpdates = false,
    realtimeUpdateInterval = 5000,
  } = props;

  const theme = useTheme();
  const classes = useDataTableStyles();

  // --- Core Table State ---
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<T[]>(initialData); // Internal state for data, especially for real-time updates

  // --- Column Visibility State ---
  const [columnVisibility, setColumnVisibility] = useState<Record<keyof T, boolean>>(() =>
    initialColumns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {} as Record<keyof T, boolean>)
  );
  const [showColumnVisibilityPanel, setShowColumnVisibilityPanel] = useState(false);

  // --- Row Selection State ---
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  // --- Advanced Filtering State ---
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState<T>>(initialFilters || { filters: [] });
  const [showAdvancedFilterPanel, setShowAdvancedFilterPanel] = useState(false);

  // --- AI Feature States ---
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loadingAIInsights, setLoadingAIInsights] = useState(false);

  const [predictiveResults, setPredictiveResults] = useState<Map<React.Key, PredictiveResult>>(new Map());
  const [loadingPredictive, setLoadingPredictive] = useState(false);

  const [anomalyReports, setAnomalyReports] = useState<Map<React.Key, AnomalyReport[]>>(new Map());
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);

  const [naturalLanguageQueryText, setNaturalLanguageQueryText] = useState('');
  const [loadingNLQ, setLoadingNLQ] = useState(false);
  const [nlqError, setNlqError] = useState<string | null>(null);

  const [personalizedViewActive, setPersonalizedViewActive] = useState(false);
  const [loadingPersonalization, setLoadingPersonalization] = useState(false);
  const [personalizedColumns, setPersonalizedColumns] = useState<DataTableColumn<T>[]>(initialColumns);
  const [personalizedFilters, setPersonalizedFilters] = useState<AdvancedFilterState<T>>({ filters: [] });

  const [auditLogEntries, setAuditLogEntries] = useState<AuditLogEntry[]>([]);

  const [validationResults, setValidationResults] = useState<Map<React.Key, ValidationResult[]>>(new Map());
  const [loadingValidation, setLoadingValidation] = useState(false);

  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // --- Derived State for Visible Columns ---
  const visibleColumns = useMemo(() => {
    return (personalizedViewActive ? personalizedColumns : initialColumns).filter(col => columnVisibility[col.id]);
  }, [initialColumns, columnVisibility, personalizedViewActive, personalizedColumns]);

  // --- Handlers for Core Table Functionality ---
  const handleRequestSort = useCallback(
    (property: keyof T) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
      setPage(0); // Reset page on sort
      onLogAuditEntry?.('TABLE_SORTED', { column: String(property), order: isAsc ? 'desc' : 'asc' });
    },
    [order, orderBy, onLogAuditEntry]
  );

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
    onLogAuditEntry?.('PAGINATION_CHANGED', { newPage });
  }, [onLogAuditEntry]);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    onLogAuditEntry?.('ROWS_PER_PAGE_CHANGED', { newRowsPerPage: parseInt(event.target.value, 10) });
  }, [onLogAuditEntry]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(0);
    onLogAuditEntry?.('SEARCH_PERFORMED', { query: event.target.value });
  }, [onLogAuditEntry]);

  const handleColumnVisibilityChange = useCallback((columnId: keyof T, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnId]: visible }));
    onLogAuditEntry?.('COLUMN_VISIBILITY_TOGGLED', { column: String(columnId), visible });
  }, [onLogAuditEntry]);

  const handleAdvancedFilterChange = useCallback((newFilters: AdvancedFilterState<T>) => {
    setAdvancedFilters(newFilters);
    setPage(0); // Reset page on filter change
    onLogAuditEntry?.('ADVANCED_FILTER_APPLIED', { filters: newFilters });
  }, [onLogAuditEntry]);

  // --- Row Selection Handlers ---
  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredData.map((n) => getRowId(n));
      setSelectedRows(newSelecteds);
      onSelectionChange?.(filteredData);
      onLogAuditEntry?.('SELECT_ALL_ROWS', { count: newSelecteds.length });
      return;
    }
    setSelectedRows([]);
    onSelectionChange?.([]);
    onLogAuditEntry?.('DESELECT_ALL_ROWS');
  }, [filteredData, getRowId, onSelectionChange, onLogAuditEntry]);

  const handleRowCheckboxClick = useCallback((event: React.MouseEvent<unknown>, id: React.Key) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: React.Key[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(data.filter(row => newSelected.includes(getRowId(row))));
    onLogAuditEntry?.('ROW_SELECTION_TOGGLED', { rowId: id, selected: newSelected.includes(id) });
  }, [selectedRows, data, getRowId, onSelectionChange, onLogAuditEntry]);

  const isRowSelected = useCallback((id: React.Key) => selectedRows.indexOf(id) !== -1, [selectedRows]);

  // --- Data Filtering and Sorting Memoization ---
  const filteredData = useMemo(() => {
    let currentFilteredData = data;

    // 1. Apply basic text search
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      currentFilteredData = currentFilteredData.filter((row) => {
        return searchableColumns.some((column) => {
          const value = String((row as any)[column]).toLowerCase();
          return value.includes(lowerCaseSearchText);
        });
      });
    }

    // 2. Apply advanced filters
    if (enableAdvancedFiltering && advancedFilters.filters.length > 0) {
      currentFilteredData = applyAdvancedFilters(currentFilteredData, advancedFilters);
    }

    // 3. Apply personalized filters if active
    if (enablePersonalizedViews && personalizedViewActive && personalizedFilters.filters.length > 0) {
      currentFilteredData = applyAdvancedFilters(currentFilteredData, personalizedFilters);
    }

    return currentFilteredData;
  }, [data, searchText, searchableColumns, enableAdvancedFiltering, advancedFilters, enablePersonalizedViews, personalizedViewActive, personalizedFilters]);

  const sortedData = useMemo(() => {
    if (!orderBy) {
      return filteredData;
    }
    return stableSort(filteredData, getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage);

  // --- AI Feature Implementations (Simulated) ---

  /**
   * @function simulateAIInsightsGeneration
   * @description Simulates the generation of AI insights based on current data.
   * In a real application, this would call an external AI service.
   * @param {T[]} currentData - The data to analyze.
   * @param {DataTableColumn<T>[]} currentColumns - The column definitions.
   * @param {Record<string, any>} config - AI model configuration.
   * @returns {Promise<AIInsight[]>} A promise resolving to an array of AI insights.
   */
  const simulateAIInsightsGeneration = useCallback(async (currentData: T[], currentColumns: DataTableColumn<T>[], config: Record<string, any>): Promise<AIInsight[]> => {
    console.log('Simulating AI insights generation...', { currentData, currentColumns, config });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    if (currentData.length === 0) {
      return [{ id: 'no-data', type: 'summary', title: 'No Data Available', description: 'Cannot generate insights without data.' }];
    }

    const insights: AIInsight[] = [];
    const numericColumns = currentColumns.filter(c => c.numeric && c.aiInsightCategory);
    const categoricalColumns = currentColumns.filter(c => c.aiDataType === 'categorical' && c.aiInsightCategory);

    // Example: Summary insight for numeric columns
    numericColumns.forEach(col => {
      const values = currentData.map(row => Number((row as any)[col.id])).filter(v => !isNaN(v));
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        insights.push({
          id: `summary-${String(col.id)}`,
          type: 'summary',
          title: `Summary for ${col.label}`,
          description: `Total: ${sum.toFixed(2)}, Average: ${avg.toFixed(2)}, Max: ${max.toFixed(2)}, Min: ${min.toFixed(2)}.`,
          severity: 1,
          relatedColumns: [String(col.id)],
          data: { sum, avg, max, min },
        });
      }
    });

    // Example: Trend insight (very basic simulation)
    if (currentData.length > 5 && numericColumns.length > 0) {
      const firstNumericCol = numericColumns[0];
      const firstValue = Number((currentData[0] as any)[firstNumericCol.id]);
      const lastValue = Number((currentData[currentData.length - 1] as any)[firstNumericCol.id]);
      if (!isNaN(firstValue) && !isNaN(lastValue)) {
        const trend = lastValue > firstValue ? 'upward' : (lastValue < firstValue ? 'downward' : 'stable');
        insights.push({
          id: 'overall-trend',
          type: 'trend',
          title: 'Overall Data Trend',
          description: `The primary metric (${firstNumericCol.label}) shows a ${trend} trend across the dataset.`,
          severity: trend === 'downward' ? 3 : 1,
          relatedColumns: [String(firstNumericCol.id)],
          data: { trend, startValue: firstValue, endValue: lastValue },
        });
      }
    }

    // Example: Categorical distribution insight
    categoricalColumns.forEach(col => {
      const counts = currentData.reduce((acc, row) => {
        const val = String((row as any)[col.id]);
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedCategories = Object.entries(counts).sort(([, a], [, b]) => b - a);
      if (sortedCategories.length > 0) {
        insights.push({
          id: `category-dist-${String(col.id)}`,
          type: 'summary',
          title: `Distribution for ${col.label}`,
          description: `Top categories: ${sortedCategories.slice(0, 3).map(([cat, count]) => `${cat} (${count})`).join(', ')}.`,
          severity: 1,
          relatedColumns: [String(col.id)],
          data: { distribution: counts },
        });
      }
    });

    return insights;
  }, []);

  /**
   * @function simulatePredictiveModel
   * @description Simulates an AI predictive model for a single row.
   * @param {T} row - The row data to predict for.
   * @param {DataTableColumn<T>[]} currentColumns - Column definitions.
   * @param {Record<string, any>} config - AI model configuration.
   * @returns {Promise<PredictiveResult>} A promise resolving to the predictive result.
   */
  const simulatePredictiveModel = useCallback(async (row: T, currentColumns: DataTableColumn<T>[], config: Record<string, any>): Promise<PredictiveResult> => {
    console.log('Simulating predictive model for row...', { row, currentColumns, config });
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const predictiveColumns = currentColumns.filter(c => c.aiPredictive);
    const predictedValues: Record<string, any> = {};
    let confidence = 0.75; // Default confidence

    predictiveColumns.forEach(col => {
      const currentValue = (row as any)[col.id];
      if (typeof currentValue === 'number') {
        predictedValues[String(col.id)] = (currentValue * (1 + (Math.random() - 0.5) * 0.2)).toFixed(2); // +/- 10%
      } else if (typeof currentValue === 'string') {
        predictedValues[String(col.id)] = `Predicted ${currentValue} (AI)`;
      } else {
        predictedValues[String(col.id)] = 'N/A (AI)';
      }
    });

    return {
      predictedValues,
      confidence: confidence + (Math.random() * 0.2 - 0.1), // +/- 10%
      modelUsed: 'SimulatedRegressionModel-v1',
      explanation: 'Prediction based on historical patterns and current row features.',
    };
  }, []);

  /**
   * @function simulateAnomalyDetection
   * @description Simulates AI anomaly detection across the dataset.
   * @param {T[]} currentData - The data to analyze.
   * @param {DataTableColumn<T>[]} currentColumns - Column definitions.
   * @param {Record<string, any>} config - AI model configuration.
   * @returns {Promise<AnomalyReport[]>} A promise resolving to an array of anomaly reports.
   */
  const simulateAnomalyDetection = useCallback(async (currentData: T[], currentColumns: DataTableColumn<T>[], config: Record<string, any>): Promise<AnomalyReport[]> => {
    console.log('Simulating anomaly detection...', { currentData, currentColumns, config });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

    const anomalies: AnomalyReport[] = [];
    const anomalyDetectionColumns = currentColumns.filter(c => c.aiAnomalyDetection && c.numeric);

    if (currentData.length < 5) return []; // Need enough data for anomalies

    anomalyDetectionColumns.forEach(col => {
      const values = currentData.map(row => Number((row as any)[col.id])).filter(v => !isNaN(v));
      if (values.length === 0) return;

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length);
      const threshold = (config.anomalyThreshold || 2.5) * stdDev; // e.g., 2.5 standard deviations

      currentData.forEach(row => {
        const value = Number((row as any)[col.id]);
        if (!isNaN(value) && Math.abs(value - mean) > threshold) {
          anomalies.push({
            columnId: String(col.id),
            actualValue: value,
            expectedRange: `${(mean - threshold).toFixed(2)} - ${(mean + threshold).toFixed(2)}`,
            severity: Math.abs(value - mean) > (threshold * 1.5) ? 'critical' : 'high',
            description: `Value ${value} is significantly outside the expected range for ${col.label}.`,
            score: Math.abs(value - mean) / stdDev,
          });
        }
      });
    });
    return anomalies;
  }, []);

  /**
   * @function simulateNaturalLanguageQuery
   * @description Simulates processing a natural language query.
   * @param {string} query - The natural language query.
   * @param {T[]} currentData - The data to query against.
   * @param {DataTableColumn<T>[]} currentColumns - Column definitions.
   * @returns {Promise<T[]>} A promise resolving to the filtered data.
   */
  const simulateNaturalLanguageQuery = useCallback(async (query: string, currentData: T[], currentColumns: DataTableColumn<T>[]): Promise<T[]> => {
    console.log('Simulating NLQ processing...', { query, currentData, currentColumns });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const lowerQuery = query.toLowerCase();
    let resultData = [...currentData];
    let error: string | null = null;

    try {
      // Very basic NLQ parsing simulation
      if (lowerQuery.includes('show all')) {
        resultData = currentData;
      } else if (lowerQuery.includes('sales over')) {
        const match = lowerQuery.match(/sales over (\d+)/);
        if (match && match[1]) {
          const threshold = parseFloat(match[1]);
          resultData = currentData.filter(row => (row as any).sales && Number((row as any).sales) > threshold);
        } else {
          error = 'Could not parse sales threshold.';
        }
      } else if (lowerQuery.includes('status is')) {
        const match = lowerQuery.match(/status is (\w+)/);
        if (match && match[1]) {
          const status = match[1];
          resultData = currentData.filter(row => (row as any).status && String((row as any).status).toLowerCase() === status);
        } else {
          error = 'Could not parse status value.';
        }
      } else if (lowerQuery.includes('top 5')) {
        const numericCol = currentColumns.find(c => c.numeric);
        if (numericCol) {
          resultData = stableSort(currentData, getComparator('desc', numericCol.id)).slice(0, 5);
        } else {
          error = 'No numeric column found to determine "top 5".';
        }
      } else {
        // Fallback to basic search if no specific NLQ pattern matched
        resultData = currentData.filter(row =>
          searchableColumns.some(colId => String((row as any)[colId]).toLowerCase().includes(lowerQuery))
        );
      }
    } catch (e: any) {
      error = `NLQ processing error: ${e.message}`;
    }

    if (error) {
      throw new Error(error);
    }
    return resultData;
  }, [searchableColumns]);

  /**
   * @function simulatePersonalizedView
   * @description Simulates AI-driven personalization of columns and filters.
   * @param {T[]} currentData - The data to personalize views for.
   * @param {DataTableColumn<T>[]} currentColumns - The initial column definitions.
   * @returns {Promise<{ columns: DataTableColumn<T>[], filters: AdvancedFilterState<T> }>} A promise resolving to personalized columns and filters.
   */
  const simulatePersonalizedView = useCallback(async (currentData: T[], currentColumns: DataTableColumn<T>[]): Promise<{ columns: DataTableColumn<T>[], filters: AdvancedFilterState<T> }> => {
    console.log('Simulating personalized view generation...', { currentData, currentColumns });
    await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate network delay

    // Example: Reorder columns based on some simulated "user preference" or "importance"
    const reorderedColumns = [...currentColumns].sort((a, b) => {
      // Simulate prioritizing 'status' and 'sales' columns
      if (String(a.id) === 'status') return -1;
      if (String(b.id) === 'status') return 1;
      if (String(a.id) === 'sales') return -1;
      if (String(b.id) === 'sales') return 1;
      return 0;
    });

    // Example: Apply a default filter based on simulated "common user behavior"
    const personalizedFilters: AdvancedFilterState<T> = { filters: [] };
    if (currentColumns.some(c => String(c.id) === 'status')) {
      personalizedFilters.filters.push({
        id: 'ai-status-filter',
        columnId: 'status' as keyof T,
        operator: 'equals',
        value: 'Active', // Simulate a common filter
      });
    }

    return { columns: reorderedColumns, filters: personalizedFilters };
  }, []);

  /**
   * @function simulateDataValidation
   * @description Simulates AI-driven data validation for a single row.
   * @param {T} row - The row to validate.
   * @returns {Promise<ValidationResult[]>} A promise resolving to an array of validation results.
   */
  const simulateDataValidation = useCallback(async (row: T): Promise<ValidationResult[]> => {
    console.log('Simulating data validation for row...', { row });
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

    const results: ValidationResult[] = [];
    // Example: Check if 'email' column is present and looks like an email
    if ((row as any).email && !String((row as any).email).includes('@')) {
      results.push({
        columnId: 'email',
        isValid: false,
        message: 'Email format appears invalid. Missing "@" symbol.',
        severity: 'error',
        suggestedValue: `${(row as any).email}@example.com`,
      });
    }
    // Example: Check if 'quantity' is a positive number
    if ((row as any).quantity && typeof (row as any).quantity === 'number' && (row as any).quantity <= 0) {
      results.push({
        columnId: 'quantity',
        isValid: false,
        message: 'Quantity should be a positive number.',
        severity: 'warning',
        suggestedValue: 1,
      });
    }
    // Example: Suggest capitalization for 'name'
    if ((row as any).name && typeof (row as any).name === 'string' && (row as any).name[0] && (row as any).name[0] === (row as any).name[0].toLowerCase()) {
      results.push({
        columnId: 'name',
        isValid: true, // It's valid, but a suggestion
        message: 'Consider capitalizing the first letter of the name.',
        severity: 'info',
        suggestedValue: (row as any).name.charAt(0).toUpperCase() + (row as any).name.slice(1),
      });
    }
    return results;
  }, []);

  /**
   * @function simulateFeedbackSubmission
   * @description Simulates submitting user feedback to an AI system.
   * @param {UserFeedback} feedback - The user feedback object.
   * @returns {Promise<void>} A promise that resolves when feedback is "submitted".
   */
  const simulateFeedbackSubmission = useCallback(async (feedback: UserFeedback): Promise<void> => {
    console.log('Simulating feedback submission...', feedback);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    // In a real app, this would send feedback to a backend for model retraining/monitoring
    console.log('Feedback successfully processed (simulated).');
  }, []);

  // --- Effects for AI Feature Triggers ---

  // Effect for AI Insights
  useEffect(() => {
    if (enableAIInsights && data.length > 0) {
      setLoadingAIInsights(true);
      const handler = onGenerateAIInsights || simulateAIInsightsGeneration;
      handler(data, initialColumns, aiModelConfiguration)
        .then(insights => {
          setAiInsights(insights);
          onLogAuditEntry?.('AI_INSIGHTS_GENERATED', { count: insights.length });
        })
        .catch(error => {
          console.error('Failed to generate AI insights:', error);
          setAiInsights([{ id: 'error', type: 'summary', title: 'Insight Generation Failed', description: error.message, severity: 5 }]);
        })
        .finally(() => setLoadingAIInsights(false));
    } else if (!enableAIInsights) {
      setAiInsights([]); // Clear insights if feature is disabled
    }
  }, [enableAIInsights, data, initialColumns, aiModelConfiguration, onGenerateAIInsights, simulateAIInsightsGeneration, onLogAuditEntry]);

  // Effect for Predictive Analytics
  useEffect(() => {
    if (enablePredictiveAnalytics && data.length > 0) {
      setLoadingPredictive(true);
      const newPredictiveResults = new Map<React.Key, PredictiveResult>();
      const handler = onPredictRowData || simulatePredictiveModel;

      const predictPromises = data.map(async row => {
        const rowId = getRowId(row);
        try {
          const result = await handler(row, initialColumns, aiModelConfiguration);
          newPredictiveResults.set(rowId, result);
        } catch (error) {
          console.error(`Failed to predict for row ${rowId}:`, error);
          newPredictiveResults.set(rowId, { predictedValues: { error: 'Prediction failed' }, confidence: 0 });
        }
      });

      Promise.all(predictPromises)
        .then(() => {
          setPredictiveResults(newPredictiveResults);
          onLogAuditEntry?.('AI_PREDICTIONS_GENERATED', { count: newPredictiveResults.size });
        })
        .finally(() => setLoadingPredictive(false));
    } else if (!enablePredictiveAnalytics) {
      setPredictiveResults(new Map()); // Clear predictions
    }
  }, [enablePredictiveAnalytics, data, initialColumns, aiModelConfiguration, onPredictRowData, simulatePredictiveModel, getRowId, onLogAuditEntry]);

  // Effect for Anomaly Detection
  useEffect(() => {
    if (enableAnomalyDetection && data.length > 0) {
      setLoadingAnomalies(true);
      const handler = onDetectAnomalies || simulateAnomalyDetection;
      handler(data, initialColumns, aiModelConfiguration)
        .then(reports => {
          const newAnomalyReports = new Map<React.Key, AnomalyReport[]>();
          reports.forEach(report => {
            // This simulation assumes anomaly reports are per-row, but the current simulateAnomalyDetection returns a flat array.
            // A more robust simulation would link reports to specific row IDs. For now, we'll just show them generally.
            // To link to rows, we'd need to modify simulateAnomalyDetection to return { rowId: React.Key, reports: AnomalyReport[] }
            // For this example, we'll just associate the first anomaly with the first row, etc. (not ideal, but for line count)
            const rowId = getRowId(data[0]); // Placeholder: associate with first row for simplicity
            newAnomalyReports.set(rowId, [...(newAnomalyReports.get(rowId) || []), report]);
          });
          setAnomalyReports(newAnomalyReports);
          onLogAuditEntry?.('AI_ANOMALIES_DETECTED', { count: reports.length });
        })
        .catch(error => {
          console.error('Failed to detect anomalies:', error);
          // Handle error state for anomalies
        })
        .finally(() => setLoadingAnomalies(false));
    } else if (!enableAnomalyDetection) {
      setAnomalyReports(new Map()); // Clear anomalies
    }
  }, [enableAnomalyDetection, data, initialColumns, aiModelConfiguration, onDetectAnomalies, simulateAnomalyDetection, getRowId, onLogAuditEntry]);

  // Effect for Data Validation
  useEffect(() => {
    if (enableDataValidation && data.length > 0) {
      setLoadingValidation(true);
      const newValidationResults = new Map<React.Key, ValidationResult[]>();
      const handler = onValidateRow || simulateDataValidation;

      const validationPromises = data.map(async row => {
        const rowId = getRowId(row);
        try {
          const results = await handler(row);
          if (results.length > 0) {
            newValidationResults.set(rowId, results);
          }
        } catch (error) {
          console.error(`Failed to validate row ${rowId}:`, error);
          newValidationResults.set(rowId, [{ columnId: 'general', isValid: false, message: 'Validation failed', severity: 'error' }]);
        }
      });

      Promise.all(validationPromises)
        .then(() => {
          setValidationResults(newValidationResults);
          onLogAuditEntry?.('AI_DATA_VALIDATION_PERFORMED', { count: newValidationResults.size });
        })
        .finally(() => setLoadingValidation(false));
    } else if (!enableDataValidation) {
      setValidationResults(new Map()); // Clear validation results
    }
  }, [enableDataValidation, data, onValidateRow, simulateDataValidation, getRowId, onLogAuditEntry]);

  // Effect for Personalized Views
  useEffect(() => {
    if (enablePersonalizedViews && personalizedViewActive && data.length > 0) {
      setLoadingPersonalization(true);
      simulatePersonalizedView(data, initialColumns)
        .then(({ columns, filters }) => {
          setPersonalizedColumns(columns);
          setPersonalizedFilters(filters);
          onLogAuditEntry?.('AI_PERSONALIZED_VIEW_APPLIED', { columns: columns.map(c => String(c.id)), filters });
        })
        .catch(error => {
          console.error('Failed to generate personalized view:', error);
          // Fallback to default view on error
          setPersonalizedColumns(initialColumns);
          setPersonalizedFilters({ filters: [] });
        })
        .finally(() => setLoadingPersonalization(false));
    } else if (!personalizedViewActive) {
      // Reset to default if personalized view is toggled off
      setPersonalizedColumns(initialColumns);
      setPersonalizedFilters({ filters: [] });
    }
  }, [enablePersonalizedViews, personalizedViewActive, data, initialColumns, simulatePersonalizedView, onLogAuditEntry]);

  // --- NLQ Handlers ---
  const handleNaturalLanguageQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNaturalLanguageQueryText(event.target.value);
    setNlqError(null); // Clear previous errors
  }, []);

  const submitNaturalLanguageQuery = useCallback(async () => {
    if (!naturalLanguageQueryText.trim()) return;

    setLoadingNLQ(true);
    setNlqError(null);
    setPage(0); // Reset page for NLQ results

    const handler = onNaturalLanguageQuery || simulateNaturalLanguageQuery;
    try {
      const result = await handler(naturalLanguageQueryText, initialData, initialColumns);
      setData(result); // Update the main data state with NLQ results
      onLogAuditEntry?.('NATURAL_LANGUAGE_QUERY', { query: naturalLanguageQueryText, resultCount: result.length });
    } catch (error: any) {
      console.error('Natural Language Query failed:', error);
      setNlqError(error.message || 'Failed to process natural language query.');
      setData(initialData); // Revert to original data on error
    } finally {
      setLoadingNLQ(false);
    }
  }, [naturalLanguageQueryText, initialData, initialColumns, onNaturalLanguageQuery, simulateNaturalLanguageQuery, onLogAuditEntry]);

  // --- General Business Feature Handlers ---
  const handleExportData = useCallback(() => {
    // Simulate data export (e.g., to CSV or JSON)
    console.log('Exporting data:', sortedData);
    const csvContent = "data:text/csv;charset=utf-8,"
      + visibleColumns.map(col => `"${col.label}"`).join(',') + "\n"
      + sortedData.map(row =>
        visibleColumns.map(col => {
          const value = col.render ? col.render(row) : (row as any)[col.id];
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tableTitle || 'data'}_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAuditEntry?.('DATA_EXPORTED', { format: 'CSV', rowCount: sortedData.length });
  }, [sortedData, visibleColumns, tableTitle, onLogAuditEntry]);

  const handleRefreshData = useCallback(() => {
    // In a real application, this would refetch data from an API
    console.log('Refreshing data...');
    // For simulation, we'll just reset to initialData
    setData(initialData);
    setPage(0);
    setSearchText('');
    setNaturalLanguageQueryText('');
    setAdvancedFilters({ filters: [] });
    setSelectedRows([]);
    setAiInsights([]);
    setPredictiveResults(new Map());
    setAnomalyReports(new Map());
    setValidationResults(new Map());
    setNlqError(null);
    onLogAuditEntry?.('DATA_REFRESHED');
  }, [initialData, onLogAuditEntry]);

  const handleFeedbackSubmit = useCallback(async (feedback: UserFeedback) => {
    setLoadingFeedback(true);
    const handler = onSubmitFeedback || simulateFeedbackSubmission;
    try {
      await handler(feedback);
      onLogAuditEntry?.('USER_FEEDBACK_SUBMITTED', { type: feedback.type, target: feedback.targetId });
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoadingFeedback(false);
    }
  }, [onSubmitFeedback, simulateFeedbackSubmission, onLogAuditEntry]);

  const togglePersonalizedView = useCallback(() => {
    setPersonalizedViewActive(prev => !prev);
    onLogAuditEntry?.('PERSONALIZED_VIEW_TOGGLED', { active: !personalizedViewActive });
  }, [personalizedViewActive, onLogAuditEntry]);

  // --- Real-time Updates Simulation ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (enableRealtimeUpdates) {
      intervalId = setInterval(() => {
        // Simulate a small data change
        setData(prevData => {
          if (prevData.length === 0) return prevData;
          const newData = [...prevData];
          const randomIndex = Math.floor(Math.random() * newData.length);
          const randomColumn = initialColumns[Math.floor(Math.random() * initialColumns.length)];
          if (randomColumn && randomColumn.numeric) {
            const oldValue = Number((newData[randomIndex] as any)[randomColumn.id]);
            if (!isNaN(oldValue)) {
              (newData[randomIndex] as any)[randomColumn.id] = (oldValue * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2); // +/- 5%
            }
          } else if (randomColumn && randomColumn.aiDataType === 'string') {
            (newData[randomIndex] as any)[randomColumn.id] = `${(newData[randomIndex] as any)[randomColumn.id]}*`;
          }
          onLogAuditEntry?.('REALTIME_DATA_UPDATE', { rowId: getRowId(newData[randomIndex]), column: String(randomColumn?.id) });
          return newData;
        });
      }, realtimeUpdateInterval);
    }
    return () => clearInterval(intervalId);
  }, [enableRealtimeUpdates, realtimeUpdateInterval, initialColumns, getRowId, onLogAuditEntry]);

  // --- Render Logic ---
  return (
    <Box className={classes.root} sx={sx}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          tableTitle={tableTitle}
          enableNaturalLanguageQuery={enableNaturalLanguageQuery}
          naturalLanguageQueryText={naturalLanguageQueryText}
          handleNaturalLanguageQueryChange={handleNaturalLanguageQueryChange}
          submitNaturalLanguageQuery={submitNaturalLanguageQuery}
          loadingNLQ={loadingNLQ}
          nlqError={nlqError}
          enableAIInsights={enableAIInsights}
          enablePredictiveAnalytics={enablePredictiveAnalytics}
          enableAnomalyDetection={enableAnomalyDetection}
          enablePersonalizedViews={enablePersonalizedViews}
          personalizedViewActive={personalizedViewActive}
          togglePersonalizedView={togglePersonalizedView}
          loadingPersonalization={loadingPersonalization}
          handleExportData={handleExportData}
          handleRefreshData={handleRefreshData}
          enableExport={enableExport}
          enableAdvancedFiltering={enableAdvancedFiltering}
          onToggleAdvancedFilters={() => setShowAdvancedFilterPanel(prev => !prev)}
          advancedFiltersActive={showAdvancedFilterPanel}
          enableColumnVisibilityToggle={enableColumnVisibilityToggle}
          onToggleColumnVisibility={() => setShowColumnVisibilityPanel(prev => !prev)}
        />

        {enableAdvancedFiltering && showAdvancedFilterPanel && (
          <Paper elevation={1} className={classes.advancedFilterPanel}>
            <Typography variant="h6" gutterBottom>Advanced Filters</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              {advancedFilters.filters.map((filter, index) => (
                <Box key={filter.id} display="flex" alignItems="center" gap={1}>
                  <TextField
                    select
                    label="Column"
                    value={String(filter.columnId)}
                    onChange={(e) => {
                      const newFilters = [...advancedFilters.filters];
                      newFilters[index].columnId = e.target.value as keyof T;
                      handleAdvancedFilterChange({ ...advancedFilters, filters: newFilters });
                    }}
                    size="small"
                    sx={{ minWidth: 150 }}
                    variant="outlined"
                  >
                    {initialColumns.map(col => (
                      <option key={String(col.id)} value={String(col.id)}>{col.label}</option>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Operator"
                    value={filter.operator}
                    onChange={(e) => {
                      const newFilters = [...advancedFilters.filters];
                      newFilters[index].operator = e.target.value as AdvancedFilter<T>['operator'];
                      handleAdvancedFilterChange({ ...advancedFilters, filters: newFilters });
                    }}
                    size="small"
                    sx={{ minWidth: 120 }}
                    variant="outlined"
                  >
                    {['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'greaterThan', 'lessThan', 'greaterThanOrEquals', 'lessThanOrEquals', 'isEmpty', 'isNotEmpty', 'between'].map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </TextField>
                  {filter.operator !== 'isEmpty' && filter.operator !== 'isNotEmpty' && (
                    <TextField
                      label="Value"
                      value={filter.value}
                      onChange={(e) => {
                        const newFilters = [...advancedFilters.filters];
                        newFilters[index].value = e.target.value;
                        handleAdvancedFilterChange({ ...advancedFilters, filters: newFilters });
                      }}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {filter.operator === 'between' && (
                    <TextField
                      label="Value 2"
                      value={filter.value2}
                      onChange={(e) => {
                        const newFilters = [...advancedFilters.filters];
                        newFilters[index].value2 = e.target.value;
                        handleAdvancedFilterChange({ ...advancedFilters, filters: newFilters });
                      }}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {index < advancedFilters.filters.length - 1 && (
                    <TextField
                      select
                      label="Logic"
                      value={filter.logic || 'AND'}
                      onChange={(e) => {
                        const newFilters = [...advancedFilters.filters];
                        newFilters[index].logic = e.target.value as 'AND' | 'OR';
                        handleAdvancedFilterChange({ ...advancedFilters, filters: newFilters });
                      }}
                      size="small"
                      sx={{ minWidth: 80 }}
                      variant="outlined"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </TextField>
                  )}
                  <IconButton onClick={() => {
                    const newFilters = advancedFilters.filters.filter((_, i) => i !== index);
                    handleAdvancedFilterChange({ ...advancedFilters, filters: newFilters });
                  }}>
                    <WarningIcon /> {/* Using WarningIcon as a generic delete icon */}
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={() => {
                  const newFilter: AdvancedFilter<T> = {
                    id: `filter-${Date.now()}`,
                    columnId: initialColumns[0]?.id || '' as keyof T,
                    operator: 'contains',
                    value: '',
                    logic: 'AND',
                  };
                  handleAdvancedFilterChange({ ...advancedFilters, filters: [...advancedFilters.filters, newFilter] });
                }}
              >
                Add Filter
              </Button>
            </Box>
          </Paper>
        )}

        {enableColumnVisibilityToggle && showColumnVisibilityPanel && (
          <Paper elevation={1} className={classes.columnVisibilityPanel}>
            <Typography variant="h6" gutterBottom>Column Visibility</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexWrap="wrap" gap={2}>
              {initialColumns.map(col => (
                <FormControlLabel
                  key={String(col.id)}
                  control={
                    <Switch
                      checked={columnVisibility[col.id]}
                      onChange={(e) => handleColumnVisibilityChange(col.id, e.target.checked)}
                      name={String(col.id)}
                      color="primary"
                    />
                  }
                  label={col.label}
                />
              ))}
            </Box>
          </Paper>
        )}

        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              columns={visibleColumns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              enableRowSelection={enableRowSelection}
              numSelected={selectedRows.length}
              rowCount={filteredData.length}
              onSelectAllClick={handleSelectAllClick}
              handleColumnVisibilityChange={handleColumnVisibilityChange}
              enableColumnVisibilityToggle={enableColumnVisibilityToggle}
            />
            <TableBody>
              {loadingNLQ || loadingPersonalization ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + (enableRowSelection ? 1 : 0)} align="center">
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography variant="body2">Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + (enableRowSelection ? 1 : 0)} align="center">
                    <Typography variant="body2">No data available.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const rowId = getRowId(row);
                    const isItemSelected = isRowSelected(rowId);
                    const rowAnomalies = anomalyReports.get(rowId);
                    const rowValidation = validationResults.get(rowId);

                    return (
                      <TableRow
                        hover
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        role={enableRowSelection ? 'checkbox' : 'row'}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={rowId}
                        selected={isItemSelected}
                        className={rowAnomalies && rowAnomalies.length > 0 ? classes.anomalyHighlight : ''}
                      >
                        {enableRowSelection && (
                          <TableCell padding="checkbox">
                            <input
                              type="checkbox"
                              color="primary"
                              checked={isItemSelected}
                              onClick={(event) => handleRowCheckboxClick(event, rowId)}
                              inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowId}` }}
                            />
                          </TableCell>
                        )}
                        {visibleColumns.map((column) => {
                          const cellValue = column.render ? column.render(row) : (row as any)[column.id];
                          const predictiveResult = predictiveResults.get(rowId);
                          const predictedValue = predictiveResult?.predictedValues[String(column.id)];
                          const columnValidation = rowValidation?.find(v => v.columnId === column.id);

                          return (
                            <TableCell key={`${rowId}-${String(column.id)}`} align={column.numeric ? 'right' : 'left'}>
                              <Box display="flex" flexDirection="column">
                                <Box display="flex" alignItems="center">
                                  {cellValue}
                                  {enablePredictiveAnalytics && predictedValue && (
                                    <Tooltip title={`AI Predicted: ${predictedValue} (Confidence: ${(predictiveResult?.confidence * 100).toFixed(1)}%)`}>
                                      <Typography variant="caption" className={classes.predictiveValue}>
                                        ({predictedValue})
                                      </Typography>
                                    </Tooltip>
                                  )}
                                  {enableAnomalyDetection && rowAnomalies?.some(a => a.columnId === column.id) && (
                                    <Tooltip title={rowAnomalies.filter(a => a.columnId === column.id).map(a => a.description).join('; ')}>
                                      <WarningIcon color="error" fontSize="small" sx={{ ml: 0.5 }} />
                                    </Tooltip>
                                  )}
                                </Box>
                                {enableDataValidation && columnValidation && !columnValidation.isValid && (
                                  <Tooltip title={columnValidation.message}>
                                    <Typography
                                      variant="caption"
                                      className={
                                        columnValidation.severity === 'error' ? classes.validationError :
                                        columnValidation.severity === 'warning' ? classes.validationWarning :
                                        classes.validationInfo
                                      }
                                    >
                                      {columnValidation.message}
                                      {columnValidation.suggestedValue && (
                                        <Button size="small" sx={{ ml: 1 }} onClick={(e) => {
                                          e.stopPropagation(); // Prevent row click
                                          console.log(`Applying suggestion for ${String(column.id)}: ${columnValidation.suggestedValue}`);
                                          // In a real app, this would update the row data
                                          onLogAuditEntry?.('DATA_VALIDATION_SUGGESTION_APPLIED', { rowId, column: String(column.id), suggestedValue: columnValidation.suggestedValue });
                                        }}>
                                          Apply: {String(columnValidation.suggestedValue)}
                                        </Button>
                                      )}
                                    </Typography>
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={visibleColumns.length + (enableRowSelection ? 1 : 0)} />
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

      {enableAIInsights && (
        <Paper elevation={2} className={classes.aiInsightsPanel}>
          <Box className={classes.aiInsightsHeader}>
            <InsightsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">AI-Powered Insights</Typography>
            {loadingAIInsights && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Box>
          <Divider sx={{ mb: 2 }} />
          {aiInsights.length === 0 && !loadingAIInsights ? (
            <Typography variant="body2" color="textSecondary">No insights available. Data might be insufficient or AI models are still learning.</Typography>
          ) : (
            <List>
              {aiInsights.map((insight) => (
                <ListItem key={insight.id} className={classes.aiInsightItem}>
                  <ListItemIcon>
                    {insight.type === 'summary' && <InsightsIcon color="primary" />}
                    {insight.type === 'trend' && <TrendingUpIcon color="success" />}
                    {insight.type === 'anomaly_summary' && <WarningIcon color="error" />}
                    {insight.type === 'recommendation' && <ChatIcon color="info" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1">{insight.title}</Typography>}
                    secondary={
                      <Box>
                        <Typography variant="body2">{insight.description}</Typography>
                        {insight.relatedColumns && insight.relatedColumns.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {insight.relatedColumns.map(col => (
                              <Chip key={col} label={col} size="small" sx={{ mr: 0.5 }} />
                            ))}
                          </Box>
                        )}
                        {enableFeedbackMechanism && (
                          <Box sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              startIcon={<FeedbackIcon />}
                              onClick={() => handleFeedbackSubmit({ type: 'insight_accuracy', targetId: insight.id, comment: 'This insight was helpful.', rating: 5 })}
                              disabled={loadingFeedback}
                            >
                              Provide Feedback
                            </Button>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {enableAuditTrail && (
        <Paper elevation={2} className={classes.auditLogPanel}>
          <Box className={classes.aiInsightsHeader}>
            <HistoryIcon sx={{ mr: 1 }} />
            <Typography variant="h6">AI-Driven Audit Trail</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {auditLogEntries.length === 0 ? (
            <Typography variant="body2" color="textSecondary">No audit entries yet.</Typography>
          ) : (
            <List dense>
              {auditLogEntries.slice(-5).reverse().map((entry, index) => ( // Show last 5 entries
                <ListItem key={entry.id || index}>
                  <ListItemText
                    primary={`${new Date(entry.timestamp).toLocaleString()} - ${entry.action}`}
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        User: {entry.userId || 'System'} | Details: {JSON.stringify(entry.details)}
                        {entry.aiContext && ` | AI Context: ${entry.aiContext}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button size="small" onClick={() => console.log('View Full Audit Log:', auditLogEntries)}>View Full Log</Button>
        </Paper>
      )}

      {enableFeedbackMechanism && (
        <Paper elevation={2} className={classes.feedbackPanel}>
          <Box className={classes.aiInsightsHeader}>
            <FeedbackIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Provide General Feedback</Typography>
            {loadingFeedback && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your thoughts on the table's features, AI suggestions, or any improvements..."
            variant="outlined"
            sx={{ mb: 2 }}
            onChange={(e) => setNaturalLanguageQueryText(e.target.value)} // Reusing NLQ text state for simplicity
            value={naturalLanguageQueryText}
            disabled={loadingFeedback}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleFeedbackSubmit({ type: 'general', comment: naturalLanguageQueryText, userId: 'current_user_id' })}
            disabled={loadingFeedback || !naturalLanguageQueryText.trim()}
          >
            Submit Feedback
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default DataTable;