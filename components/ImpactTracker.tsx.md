import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// --- Core System Constants and Configuration ---
const SYSTEM_NAME = "Financial Analytics System";
const VERSION = "1.0.0-AI-Analytics";
const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#6c757d";
const AI_INSIGHT_COLOR = "#28a745";
const ALERT_COLOR = "#dc3545";

// --- Utility Functions (Simulating System Logic) ---

/**
 * Generates a synthetic dataset for demonstration purposes.
 * Simulates transactions across multiple dimensions.
 * @param {number} days - Number of days to simulate.
 * @returns {Array<Object>} - Time-series data points.
 */
const generateSyntheticImpactData = (days: number = 90) => {
    const data = [];
    const baseValue = 100000000; // Millions baseline
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateString = date.toISOString().split('T')[0];

        // Simulate market factors and potential fluctuations
        const marketSentimentFactor = 1 + (Math.sin(i / 10) * 0.05) + (Math.random() * 0.02);
        const securityIndex = 0.9 + (Math.random() * 0.05); // Variable security metric
        const efficiencyGain = 1 + (i * 0.0001);

        const totalImpact = baseValue * marketSentimentFactor * securityIndex * efficiencyGain * (1 + i / 500);

        data.push({
            date: dateString,
            'Total Economic Impact (USD)': totalImpact,
            'AI Predictive Accuracy (%)': 90 + (Math.random() * 5),
            'User Empowerment Score': 50 + (i * 0.1) + (Math.random() * 5),
            'Security Index': securityIndex * 100000,
            'Decentralized Ledger Throughput (TPS)': 5000 + (i * 100),
        });
    }
    return data;
};

/**
 * Generates an automated analysis summary.
 * @param {Array<Object>} data - The raw data set.
 * @returns {string} - An automated summary.
 */
const generateAIAnalysisSummary = (data: Array<Object>): string => {
    if (data.length === 0) return "No data available for analysis.";

    const latest = data[data.length - 1] as any;
    const initial = data[0] as any;

    const impactGrowth = ((latest['Total Economic Impact (USD)'] - initial['Total Economic Impact (USD)']) / initial['Total Economic Impact (USD)']) * 100;
    const avgAccuracy = data.reduce((sum, item: any) => sum + item['AI Predictive Accuracy (%)'], 0) / data.length;
    const maxEmpowerment = Math.max(...data.map((item: any) => item['User Empowerment Score']));

    return `
        **${SYSTEM_NAME} Performance Analysis (Automated Report v${VERSION})**

        **Executive Summary:** The system shows fluctuating performance, with the Total Economic Impact metric changing by **${impactGrowth.toFixed(4)}%** over the analyzed period.

        **Key Performance Indicators (KPIs):**
        1. **AI Predictive Accuracy:** Shows an average operational accuracy of **${avgAccuracy.toFixed(4)}%**, indicating areas for improvement in predictive models.
        2. **User Empowerment Index:** Reached a peak score of **${maxEmpowerment.toFixed(2)}**, suggesting potential for further user engagement and support.
        3. **Security Posture:** The Security Index shows areas for continuous monitoring, with ongoing efforts to enhance ledger integrity against evolving threats.

        **Forward Projection:** Future trends indicate potential for growth, though subject to market dynamics and ongoing algorithmic adjustments. Projections are estimates based on current models.
    `;
};

// --- Component Definitions ---

/**
 * Renders a multi-metric Line Chart for historical tracking.
 */
const HistoricalImpactChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <div style={{ height: '500px', width: '100%', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: `1px solid ${SECONDARY_COLOR}` }}>
            <h3 style={{ color: PRIMARY_COLOR, marginBottom: '10px' }}>Longitudinal Economic Performance Visualization</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={SECONDARY_COLOR} opacity={0.3} />
                    <XAxis dataKey="date" stroke={SECONDARY_COLOR} tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" stroke={PRIMARY_COLOR} domain={['dataMin - 1e7', 'dataMax + 1e7']} tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`} />
                    <YAxis yAxisId="right" orientation="right" stroke={AI_INSIGHT_COLOR} domain={[80, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#343a40', border: 'none', borderRadius: '4px' }}
                        labelStyle={{ color: PRIMARY_COLOR }}
                        formatter={(value: number, name: string) => {
                            if (name.includes('Impact')) return [`$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, name];
                            if (name.includes('Accuracy')) return [`${value.toFixed(4)}%`, name];
                            return [value.toFixed(2), name];
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="Total Economic Impact (USD)" stroke={PRIMARY_COLOR} strokeWidth={3} dot={false} animationDuration={1200} />
                    <Line yAxisId="right" type="monotone" dataKey="AI Predictive Accuracy (%)" stroke={AI_INSIGHT_COLOR} strokeWidth={2} dot={false} opacity={0.7} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

/**
 * Renders a comparative Bar Chart for key performance indicators distribution.
 */
const KPIDistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
    const latestData = data.length > 0 ? data[data.length - 1] : {};

    const chartData = useMemo(() => [
        { name: 'Empowerment Score', value: latestData['User Empowerment Score'] || 0, color: PRIMARY_COLOR },
        { name: 'Security Index (Scaled)', value: (latestData['Security Index'] || 0) / 100000, color: ALERT_COLOR },
        { name: 'Throughput (kTPS)', value: (latestData['Decentralized Ledger Throughput (TPS)'] || 0) / 1000, color: SECONDARY_COLOR },
    ], [latestData]);

    return (
        <div style={{ height: '350px', width: '100%', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: `1px solid ${SECONDARY_COLOR}` }}>
            <h3 style={{ color: PRIMARY_COLOR, marginBottom: '10px' }}>Current Operational Metric Snapshot</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={SECONDARY_COLOR} opacity={0.3} />
                    <XAxis type="number" stroke={SECONDARY_COLOR} />
                    <YAxis dataKey="name" type="category" stroke={SECONDARY_COLOR} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#343a40', border: 'none', borderRadius: '4px' }} />
                    <Bar dataKey="value" fill={PRIMARY_COLOR}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

/**
 * Renders a Pie Chart for simulated resource allocation or risk distribution.
 */
const RiskAllocationPieChart: React.FC<{ data: any[] }> = ({ data }) => {
    const COLORS = [PRIMARY_COLOR, AI_INSIGHT_COLOR, ALERT_COLOR, '#ffc107'];

    const pieData = useMemo(() => {
        if (data.length === 0) return [];
        const latest = data[data.length - 1] as any;
        return [
            { name: 'Validated Assets', value: latest['Total Economic Impact (USD)'] * 0.60, color: PRIMARY_COLOR },
            { name: 'AI Predictive Reserves', value: latest['Total Economic Impact (USD)'] * 0.25, color: AI_INSIGHT_COLOR },
            { name: 'Contingency Buffer', value: latest['Total Economic Impact (USD)'] * 0.10, color: ALERT_COLOR },
            { name: 'Operational Overhead', value: latest['Total Economic Impact (USD)'] * 0.05, color: COLORS[3] },
        ];
    }, [data]);

    return (
        <div style={{ height: '350px', width: '100%', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: `1px solid ${SECONDARY_COLOR}` }}>
            <h3 style={{ color: PRIMARY_COLOR, marginBottom: '10px' }}>Asset Allocation & Reserve Distribution</h3>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${(value / 1e9).toFixed(3)}B`, 'Value']} contentStyle={{ backgroundColor: '#343a40', border: 'none', borderRadius: '4px' }} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


/**
 * The main component encapsulating the entire Impact Tracking Dashboard.
 * This component serves as an interface for monitoring the system's economic performance,
 * reflecting ongoing development and adaptation.
 */
const ImpactTracker: React.FC = () => {
    const [impactData, setImpactData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [analysisText, setAnalysisText] = useState<string>("");

    // Initialization Effect: Load or generate the data set
    useEffect(() => {
        // Simulate asynchronous data fetching from the Ledger Core
        const fetchData = async () => {
            setLoading(true);
            // In a real system, this would be a secure API call to the core ledger service.
            // Here, we generate 180 days of synthetic data.
            const data = generateSyntheticImpactData(180);
            setImpactData(data);

            // Trigger AI analysis pipeline
            const summary = generateAIAnalysisSummary(data);
            setAnalysisText(summary);

            setLoading(false);
        };

        fetchData();
    }, []);

    // Memoized calculation for the latest snapshot metrics
    const latestSnapshot = useMemo(() => {
        if (impactData.length === 0) return null;
        return impactData[impactData.length - 1];
    }, [impactData]);

    // Professional rendering of a single KPI card
    const KPICard: React.FC<{ title: string, value: string | number, insight: string, color?: string }> = ({ title, value, insight, color = PRIMARY_COLOR }) => (
        <div style={{
            flex: 1,
            minWidth: '250px',
            padding: '20px',
            margin: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderLeft: `8px solid ${color}`,
            transition: 'transform 0.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': { transform: 'translateY(-5px)' }
        }}>
            <p style={{ fontSize: '14px', color: SECONDARY_COLOR, marginBottom: '5px' }}>{title}</p>
            <h2 style={{ fontSize: '2.2em', color: color, margin: '0 0 10px 0' }}>{value}</h2>
            <p style={{ fontSize: '12px', color: '#6c757d', fontStyle: 'italic' }}>{insight}</p>
        </div>
    );

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: PRIMARY_COLOR }}>
                <div className="spinner" style={{ border: `8px solid rgba(0, 123, 255, 0.1)`, borderTop: `8px solid ${PRIMARY_COLOR}`, borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
                <p style={{ fontSize: '1.2em' }}>Initializing Data... Please wait for system loading.</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#e9ecef' }}>
            <header style={{ marginBottom: '30px', borderBottom: `3px solid ${PRIMARY_COLOR}`, paddingBottom: '10px' }}>
                <h1 style={{ color: PRIMARY_COLOR, margin: 0 }}>{SYSTEM_NAME} - Macro Impact Dashboard</h1>
                <p style={{ color: SECONDARY_COLOR, margin: '5px 0 0 0' }}>Version: {VERSION}</p>
            </header>

            {/* Section 1: High-Level KPI Snapshot */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: SECONDARY_COLOR, borderBottom: `1px solid ${SECONDARY_COLOR}`, paddingBottom: '5px' }}>Real-Time Metrics</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-around' }}>
                    <KPICard
                        title="Total Economic Value Generated"
                        value={latestSnapshot ? `$${(latestSnapshot['Total Economic Impact (USD)'] / 1e9).toFixed(3)} B` : 'N/A'}
                        insight="Growth trajectory observed, subject to market conditions."
                        color={PRIMARY_COLOR}
                    />
                    <KPICard
                        title="AI Predictive Accuracy"
                        value={latestSnapshot ? `${latestSnapshot['AI Predictive Accuracy (%)'].toFixed(4)} %` : 'N/A'}
                        insight="Maintains high accuracy, with continuous refinement."
                        color={AI_INSIGHT_COLOR}
                    />
                    <KPICard
                        title="User Empowerment Index (UEI)"
                        value={latestSnapshot ? latestSnapshot['User Empowerment Score'].toFixed(2) : 'N/A'}
                        insight="Reflects user engagement and financial support."
                        color={SECONDARY_COLOR}
                    />
                    <KPICard
                        title="Security Index"
                        value={latestSnapshot ? (latestSnapshot['Security Index'] / 100000).toFixed(4) : 'N/A'}
                        insight="Security integrity maintained against simulated threats."
                        color={ALERT_COLOR}
                    />
                </div>
            </section>

            {/* Section 2: Longitudinal Visualization */}
            <section style={{ marginBottom: '40px' }}>
                <HistoricalImpactChart data={impactData} />
            </section>

            {/* Section 3: AI Deep Dive and Distribution Analysis */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: SECONDARY_COLOR, borderBottom: `1px solid ${SECONDARY_COLOR}`, paddingBottom: '5px' }}>AI Governance & Resource Allocation</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: 2, minWidth: '500px' }}>
                        <KPIDistributionChart data={impactData} />
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <RiskAllocationPieChart data={impactData} />
                    </div>
                </div>
            </section>

            {/* Section 4: AI Generated Narrative Analysis */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: PRIMARY_COLOR, borderBottom: `1px solid ${PRIMARY_COLOR}`, paddingBottom: '5px' }}>AI Narrative Synthesis</h2>
                <div style={{
                    padding: '25px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: `2px solid ${AI_INSIGHT_COLOR}`,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Consolas, monospace',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}>
                    {analysisText.split('\n').map((line, index) => (
                        <p key={index} style={{ margin: 0, color: '#333' }}>
                            {line.startsWith('**') ? (
                                <strong style={{ color: PRIMARY_COLOR }}>{line.replace(/\*\*/g, '')}</strong>
                            ) : line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') ? (
                                <span style={{ color: SECONDARY_COLOR }}>{line}</span>
                            ) : (
                                line
                            )}
                        </p>
                    ))}
                </div>
            </section>

            {/* Footer/Attribution - Maintaining Professionalism */}
            <footer style={{ textAlign: 'center', padding: '20px', borderTop: `1px solid ${SECONDARY_COLOR}`, marginTop: '30px' }}>
                <p style={{ fontSize: '12px', color: SECONDARY_COLOR }}>
                    Powered by the {SYSTEM_NAME} architecture. Designed for continuous adaptation in dynamic economic environments.
                </p>
            </footer>
        </div>
    );
};

export default ImpactTracker;