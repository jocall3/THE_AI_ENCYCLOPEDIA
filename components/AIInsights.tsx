import React, { useContext, useMemo, useCallback, useState } from 'react';
import Card from './Card';
import type { AIInsight, ChartDataPoint, UrgencyLevel } from '../types';
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// --- Configuration Constants for Hyper-Scalability ---
const URGENCY_STYLES: Record<UrgencyLevel, { color: string; ring: string }> = {
    low: { color: 'bg-green-500', ring: 'ring-green-400' },
    medium: { color: 'bg-yellow-500', ring: 'ring-yellow-400' },
    high: { color: 'bg-red-500', ring: 'ring-red-400' },
    critical: { color: 'bg-purple-500', ring: 'ring-purple-400' },
};

const CHART_COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- Advanced Urgency Indicator Component ---
interface UrgencyIndicatorProps {
    urgency: UrgencyLevel;
    size?: 'sm' | 'md' | 'lg';
}

const UrgencyIndicator: React.FC<UrgencyIndicatorProps> = React.memo(({ urgency, size = 'md' }) => {
    const baseClasses = 'absolute top-2 right-2 rounded-full shadow-lg transition-all duration-300 ease-in-out';
    
    const sizeClasses = useMemo(() => {
        switch (size) {
            case 'sm': return 'h-2 w-2';
            case 'lg': return 'h-4 w-4';
            case 'md':
            default: return 'h-3 w-3';
        }
    }, [size]);

    const colorClass = URGENCY_STYLES[urgency]?.color || URGENCY_STYLES.medium.color;
    const ringClass = URGENCY_STYLES[urgency]?.ring || URGENCY_STYLES.medium.ring;

    return (
        <span 
            className={`${baseClasses} ${sizeClasses} ${colorClass} ring-2 ${ringClass} ring-opacity-75`}
            title={`Urgency Level: ${urgency.charAt(0).toUpperCase() + urgency.slice(1)}`}
        ></span>
    );
});
UrgencyIndicator.displayName = 'UrgencyIndicator';

// --- AI Insight Detail Renderer Component ---
interface InsightDetailRendererProps {
    insight: AIInsight;
}

const InsightDetailRenderer: React.FC<InsightDetailRendererProps> = React.memo(({ insight }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const renderChart = useCallback(() => {
        if (!insight.chartData || insight.chartData.length === 0) return null;

        // Determine chart type based on data structure or insight type (Hypothetical expansion)
        const isVerticalBar = insight.chartType === 'vertical_bar' || insight.chartData.every(d => typeof d.value === 'number');
        
        if (isVerticalBar) {
            return (
                <div className="mt-3 h-32 md:h-40 pr-4 bg-gray-800/30 p-2 rounded-lg border border-gray-700/50">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={insight.chartData} layout={insight.chartType === 'vertical_bar' ? "vertical" : "horizontal"} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                            <XAxis 
                                type="number" 
                                hide={insight.chartType === 'vertical_bar'} 
                                stroke="#6b7280" 
                                fontSize={10}
                            />
                            <YAxis 
                                type="category" 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={10} 
                                stroke="#9ca3af" 
                                width={insight.chartType === 'vertical_bar' ? 80 : 0}
                                orientation={insight.chartType === 'vertical_bar' ? "left" : "top"}
                                style={{ textTransform: 'capitalize' }}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(100,116,139,0.15)' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                    borderColor: '#374151',
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                }}
                                formatter={(value: number, name: string, props: any) => {
                                    if (props.dataKey === 'value') {
                                        return [`$${value.toFixed(2)}`, insight.chartMetricName || 'Value'];
                                    }
                                    return [value, name];
                                }}
                            />
                            <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', color: '#e5e7eb' }} />
                            <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={15} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }
        
        // Hypothetical Pie Chart rendering for distribution insights
        if (insight.chartType === 'pie') {
            return (
                <div className="mt-3 h-40 flex justify-center items-center bg-gray-800/30 p-2 rounded-lg border border-gray-700/50">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={insight.chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={3}
                                labelLine={false}
                            >
                                {insight.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                    borderColor: '#374151',
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                }}
                                formatter={(value: number, name: string) => [`${(value / insight.chartData!.reduce((sum, d) => sum + d.value, 0) * 100).toFixed(1)}%`, name]}
                            />
                            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '11px', color: '#e5e7eb' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        // Hypothetical Line Chart for trend analysis
        if (insight.chartType === 'line') {
             return (
                <div className="mt-3 h-32 pr-4 bg-gray-800/30 p-2 rounded-lg border border-gray-700/50">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={insight.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                            <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                    borderColor: '#374151',
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Trend Value']}
                            />
                            <Line type="monotone" dataKey="value" stroke={CHART_COLORS[1]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        return null;
    }, [insight]);

    const urgency = insight.urgency || 'medium';
    const urgencyStyle = URGENCY_STYLES[urgency];

    return (
        <div className="relative p-5 bg-gray-800/70 rounded-xl shadow-2xl border border-gray-700/60 hover:border-cyan-400/70 transition-all duration-300 ease-in-out transform hover:scale-[1.01] group">
            <UrgencyIndicator urgency={urgency} size="lg" />
            
            <div className="flex items-center mb-2">
                <span className={`h-3 w-3 rounded-full mr-2 ${urgencyStyle.color} ring-2 ${urgencyStyle.ring} ring-opacity-50`}></span>
                <h4 className="font-extrabold text-lg text-white tracking-wide">{insight.title}</h4>
            </div>
            
            <p className="text-sm text-gray-300 mt-1 leading-relaxed border-b border-gray-700 pb-2">
                {insight.description.substring(0, isExpanded ? insight.description.length : 150)}
                {insight.description.length > 150 && (
                    <button 
                        onClick={toggleExpand} 
                        className="text-cyan-400 hover:text-cyan-300 ml-1 text-xs font-medium transition-colors"
                    >
                        {isExpanded ? ' (Show Less)' : '... (Read More)'}
                    </button>
                )}
            </p>

            {insight.recommendation && (
                <div className="mt-3 p-3 bg-indigo-900/30 border-l-4 border-indigo-400 rounded-r-lg">
                    <p className="text-xs font-semibold text-indigo-300 uppercase mb-1">AI Recommendation:</p>
                    <p className="text-sm text-gray-200 italic">{insight.recommendation}</p>
                </div>
            )}

            {renderChart()}

            {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Contextual Data:</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(insight.metadata).map(([key, value]) => (
                            <span key={key} className="px-2 py-0.5 text-xs bg-gray-700 text-gray-200 rounded-full">
                                {key}: <span className="font-mono text-cyan-300">{String(value)}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});
InsightDetailRenderer.displayName = 'InsightDetailRenderer';


// --- Main AI Insights Component ---
const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("AIInsights must be within a DataProvider");
    const { aiInsights, isInsightsLoading } = context;

    const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSearchedInsights = useMemo(() => {
        let results = aiInsights;

        if (filterUrgency !== 'all') {
            results = results.filter(insight => insight.urgency === filterUrgency);
        }

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            results = results.filter(insight => 
                insight.title.toLowerCase().includes(lowerCaseSearch) ||
                insight.description.toLowerCase().includes(lowerCaseSearch) ||
                insight.recommendation?.toLowerCase().includes(lowerCaseSearch)
            );
        }
        
        // Sort by urgency (Critical > High > Medium > Low)
        const urgencyOrder: Record<UrgencyLevel | 'all', number> = { critical: 4, high: 3, medium: 2, low: 1, all: 0 };
        return results.sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);

    }, [aiInsights, filterUrgency, searchTerm]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFilterChange = useCallback((urgency: UrgencyLevel | 'all') => {
        setFilterUrgency(urgency);
    }, []);

    const renderInsightList = () => {
        if (isInsightsLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                    <p className="ml-3 text-cyan-400">Synthesizing next-generation intelligence...</p>
                </div>
            );
        }

        if (filteredAndSearchedInsights.length === 0) {
            return (
                <div className="text-center p-10 bg-gray-800/50 rounded-lg border border-gray-700">
                    <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-white">No Insights Found</h3>
                    <p className="mt-1 text-sm text-gray-400">
                        Adjust your filters or search term to find relevant strategic guidance.
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSearchedInsights.map(insight => (
                    <InsightDetailRenderer key={insight.id} insight={insight} />
                ))}
            </div>
        );
    };

    const urgencyLevels: (UrgencyLevel | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];

    return (
        <Card title="Quantum AI Strategic Insights Nexus" className="min-h-[600px]">
            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700 shadow-inner">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search Input */}
                    <div className="w-full md:w-1/3 relative">
                        <input
                            type="text"
                            placeholder="Search insights by keyword..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full p-2 pl-10 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>

                    {/* Urgency Filters */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <span className="text-sm text-gray-300 hidden sm:inline">Filter by Urgency:</span>
                        {urgencyLevels.map(level => (
                            <button
                                key={level}
                                onClick={() => handleFilterChange(level)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 capitalize shadow-md
                                    ${filterUrgency === level 
                                        ? `ring-2 ring-offset-2 ring-offset-gray-900 ${URGENCY_STYLES[level as UrgencyLevel]?.ring || 'ring-cyan-400'} text-white ${URGENCY_STYLES[level as UrgencyLevel]?.color.replace('bg-', 'bg-')}`
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }
                                    ${level === 'all' && filterUrgency === 'all' && 'bg-cyan-600 text-white ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900'}
                                    ${level !== 'all' && !URGENCY_STYLES[level as UrgencyLevel] && 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                `}
                            >
                                {level === 'all' ? 'All Insights' : level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {renderInsightList()}
        </Card>
    );
};

export default AIInsights;