import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Bot,
  MessageSquare,
  Settings,
  ShieldCheck,
} from 'lucide-react';

// Rationale for Refactoring:
// 1. Removed a massive, fragmented set of icon imports (e.g., FileSearch2, FileImage22, FileX30) 
//    which indicated poor module maintenance and performance overhead.
// 2. Replaced them with clean, standard imports from `lucide-react`, unifying the icon library
//    as per the "Unify the Technology Stack" instruction.
// 3. Implemented a reliable component structure (AutonomousFinanceAgentLog) suitable for a 
//    production-ready financial dashboard MVP, including filtering, searching, and pagination logic.

// --- Type Definitions ---

type LogLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SYSTEM';

interface AgentLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: Record<string, any>;
}

// --- Mock Data (To be replaced by API calls via React Query in a production setup) ---
const MOCK_LOGS: AgentLogEntry[] = [
  { id: '1', timestamp: '2024-07-29T10:00:00Z', level: 'SYSTEM', source: 'Orchestrator', message: 'Agent execution initiated for Q3 Treasury Review.', details: { agentId: 'AF-101' } },
  { id: '2', timestamp: '2024-07-29T10:00:15Z', level: 'INFO', source: 'LLM_Planner', message: 'Identified target banks for liquidity optimization check.', details: { banks: ['JP-Morgan', 'Citi'] } },
  { id: '3', timestamp: '2024-07-29T10:05:40Z', level: 'SUCCESS', source: 'TreasuryEngine', message: 'Liquidity sweep executed successfully. $50M moved to high-yield account.', details: { txId: 'TXN-9012', amount: 50000000 } },
  { id: '4', timestamp: '2024-07-29T10:07:10Z', level: 'WARNING', source: 'API_Plum', message: 'Rate limit hit on Bank API (Citi). Retrying in 10s.', details: { attempts: 1 } },
  { id: '5', timestamp: '2024-07-29T10:07:25Z', level: 'ERROR', source: 'TreasuryEngine', message: 'Failed to apply new policy: Policy validation error.', details: { reason: 'Missing regulatory approval flag.' } },
  { id: '6', timestamp: '2024-07-29T10:08:00Z', level: 'SUCCESS', source: 'Orchestrator', message: 'Agent run completed with 1 error and 1 warning.', details: { duration_ms: 480000 } },
  { id: '7', timestamp: '2024-07-29T10:09:00Z', level: 'INFO', source: 'ComplianceChecker', message: 'Pre-flight check passed for AML compliance.', details: { checkId: 'AML-C-2024' } },
  { id: '8', timestamp: '2024-07-29T10:10:00Z', level: 'SYSTEM', source: 'Scheduler', message: 'Next run scheduled for 15:00 UTC.', details: {} },
  { id: '9', timestamp: '2024-07-29T10:11:00Z', level: 'INFO', source: 'ReportingEngine', message: 'Generated Q3 Treasury Summary Report.', details: { reportId: 'REP-Q3-2024', format: 'PDF' } },
];

const ITEMS_PER_PAGE = 10;
const availableLevels: LogLevel[] = ['SYSTEM', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'];

// Helper function to map log level to styling and icon
const getLogLevelDetails = (level: LogLevel) => {
  switch (level) {
    case 'SUCCESS':
      return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50' };
    case 'ERROR':
      return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
    case 'WARNING':
      return { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    case 'SYSTEM':
      return { icon: ShieldCheck, color: 'text-blue-500', bgColor: 'bg-blue-50' };
    case 'INFO':
    default:
      return { icon: Info, color: 'text-gray-500', bgColor: 'bg-gray-50' };
  }
};


// Component to display individual log entry
const LogEntry: React.FC<{ entry: AgentLogEntry }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { icon: Icon, color, bgColor } = getLogLevelDetails(entry.level);
  
  const formattedTimestamp = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  
  return (
    <div className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-150`}>
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3 w-full">
          <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <span className={`font-mono text-xs font-semibold uppercase ${color} px-2 py-0.5 rounded-full ${bgColor}`}>
              {entry.level}
            </span>
            <p className="text-sm font-medium text-gray-900 mt-1">{entry.message}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <span className="text-xs text-gray-500 font-mono">{formattedTimestamp}</span>
          <span className="text-xs font-semibold text-gray-600 px-2 border rounded">{entry.source}</span>
        </div>
      </div>

      {isExpanded && entry.details && Object.keys(entry.details).length > 0 && (
        <div className="mt-3 p-3 ml-8 bg-gray-50 rounded border border-gray-100">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Details</h4>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
            {JSON.stringify(entry.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};


// Main Component
const AutonomousFinanceAgentLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    // Sort by timestamp descending (newest first)
    let logs = MOCK_LOGS.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 1. Level Filtering
    if (filterLevel !== 'ALL') {
      logs = logs.filter(log => log.level === filterLevel);
    }

    // 2. Search Filtering
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      logs = logs.filter(log => 
        log.message.toLowerCase().includes(lowerCaseSearch) ||
        log.source.toLowerCase().includes(lowerCaseSearch) ||
        JSON.stringify(log.details || {}).toLowerCase().includes(lowerCaseSearch)
      );
    }

    return logs;
  }, [filterLevel, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredLogs.slice(start, end);
  }, [filteredLogs, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Reset page when filters change
  const handleFilterChange = (newLevel: LogLevel | 'ALL') => {
    setFilterLevel(newLevel);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-900/5">
      <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Bot className="w-6 h-6 mr-2 text-indigo-600" />
          Autonomous Agent Log
        </h2>
        <div className="flex space-x-3">
          <button 
            className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
            onClick={() => { /* Placeholder for refresh logic (e.g., refetching data) */ }}
          >
            <RotateCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
          <button 
            className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
            onClick={() => { /* Placeholder for settings/export logic */ }}
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </button>
        </div>
      </header>

      {/* Controls & Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages, sources, or details..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Filter Dropdown (Level) */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <label htmlFor="log-level-filter" className="text-sm text-gray-700 sr-only md:not-sr-only">Level:</label>
          <select
            id="log-level-filter"
            value={filterLevel}
            onChange={(e) => handleFilterChange(e.target.value as LogLevel | 'ALL')}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="ALL">All Levels ({MOCK_LOGS.length})</option>
            {availableLevels.map(level => (
              <option key={level} value={level}>
                {level} ({MOCK_LOGS.filter(l => l.level === level).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log List */}
      <div className="divide-y divide-gray-100 min-h-[300px]">
        {paginatedLogs.length > 0 ? (
          paginatedLogs.map((log) => (
            <LogEntry key={log.id} entry={log} />
          ))
        ) : (
          <div className="text-center p-12 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-3" />
            No log entries found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white">
        <span className="text-sm text-gray-700">
          Showing {Math.min(filteredLogs.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredLogs.length, currentPage * ITEMS_PER_PAGE)} of {filteredLogs.length} results
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-lg text-gray-600 disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="p-2 px-4 text-sm font-medium border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 border rounded-lg text-gray-600 disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutonomousFinanceAgentLog;