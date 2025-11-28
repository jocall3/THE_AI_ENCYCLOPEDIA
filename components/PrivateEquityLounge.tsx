import React, { useState, useMemo } from 'react';

// Mock Data Definitions (Must be internally managed as per 'no dependencies' constraint)
interface Stakeholder {
    id: number;
    name: string;
    shares: number;
    type: 'Founder' | 'Investor' | 'Employee' | 'Option Pool';
    equityPercentage: number;
    basis: number; // Total investment/cost basis
}

const mockStakeholders: Stakeholder[] = [
    { id: 1, name: "Prosperity Fund A (PFS)", shares: 4500000, type: 'Investor', equityPercentage: 45.00, basis: 50000000 },
    { id: 2, name: "Alice Founder", shares: 2500000, type: 'Founder', equityPercentage: 25.00, basis: 0 },
    { id: 3, name: "Bob Co-Founder", shares: 1500000, type: 'Founder', equityPercentage: 15.00, basis: 0 },
    { id: 4, name: "Employee Pool (Vested)", shares: 1000000, type: 'Employee', equityPercentage: 10.00, basis: 0 },
    { id: 5, name: "Future Options Pool", shares: 500000, type: 'Option Pool', equityPercentage: 5.00, basis: 0 },
];

const initialValuation = 100000000; // $100M Current Valuation

const PrivateEquityLounge: React.FC = () => {
    const [stakeholders] = useState<Stakeholder[]>(mockStakeholders);
    const [currentValuation] = useState<number>(initialValuation);
    // Target exit valuation for scenario planning
    const [exitValuation, setExitValuation] = useState<number>(250000000); 

    // --- Helper Calculations ---
    const totalShares = useMemo(() => 
        stakeholders.reduce((sum, s) => sum + s.shares, 0), 
        [stakeholders]
    );
    
    // Calculates the projected return metrics for the primary investor (ID 1)
    const calculateExitReturns = (valuation: number) => {
        const primaryInvestor = stakeholders.find(s => s.id === 1);
        if (!primaryInvestor) return { grossReturn: 0, netMultiple: 0, irr: 0 };

        const ownershipPct = primaryInvestor.equityPercentage / 100;
        const grossReturn = valuation * ownershipPct;
        const netMultiple = primaryInvestor.basis > 0 ? grossReturn / primaryInvestor.basis : 0;
        
        // Simplified IRR calculation (assuming a 5-year holding period for illustration)
        // IRR = (Multiple ^ (1/Years)) - 1
        const simplifiedIRR = (Math.pow(netMultiple, 1/5) - 1) * 100;
        
        return { grossReturn, netMultiple, irr: simplifiedIRR };
    };

    const exitMetrics = useMemo(() => 
        calculateExitReturns(exitValuation), 
        [exitValuation, stakeholders]
    );

    // --- Cap Table Visualization ---
    const renderCapTable = () => (
        <div style={styles.capTableContainer}>
            <h3 style={styles.sectionTitle}>Capitalization Table Overview</h3>
            <div style={styles.table}>
                <div style={styles.tableHeader}>
                    <span style={{ flex: 3 }}>Stakeholder</span>
                    <span style={{ flex: 1 }}>Shares</span>
                    <span style={{ flex: 1 }}>Ownership %</span>
                    <span style={{ flex: 2 }}>Type</span>
                    <span style={{ flex: 2, textAlign: 'right' }}>Cost Basis</span>
                </div>
                {stakeholders.map(s => (
                    <div key={s.id} style={styles.tableRow}>
                        <span style={{ flex: 3, fontWeight: s.id === 1 ? 'bold' : 'normal', color: s.id === 1 ? '#00aaff' : '#f0f0f5' }}>
                            {s.name} 
                        </span>
                        <span style={{ flex: 1 }}>{s.shares.toLocaleString()}</span>
                        <span style={{ flex: 1 }}>{s.equityPercentage.toFixed(2)}%</span>
                        <span style={{ flex: 2 }}>{s.type}</span>
                        <span style={{ flex: 2, textAlign: 'right' }}>${s.basis.toLocaleString()}</span>
                    </div>
                ))}
                <div style={styles.tableFooter}>
                    <span style={{ flex: 3 }}>Total Outstanding</span>
                    <span style={{ flex: 1 }}>{totalShares.toLocaleString()}</span>
                    <span style={{ flex: 1 }}>100.00%</span>
                    <span style={{ flex: 4 }}></span>
                </div>
            </div>
        </div>
    );

    // --- Exit Modeling & Scenario Planning ---
    const renderExitModeling = () => {
        const ourReturn = exitMetrics.grossReturn;
        const basis = stakeholders.find(s => s.id === 1)?.basis || 0;

        return (
            <div style={styles.exitModelContainer}>
                <h3 style={styles.sectionTitle}>Exit Scenario Modeling (Balcony View)</h3>
                
                <div style={styles.inputGroup}>
                    <label style={{ fontSize: 14, color: '#aaa' }}>Simulate Target Exit Valuation ($):</label>
                    <input
                        type="number"
                        value={exitValuation}
                        onChange={(e) => setExitValuation(Number(e.target.value))}
                        style={styles.inputField}
                    />
                </div>

                <div style={styles.metricGrid}>
                    <div style={styles.metricCard}>
                        <h4>Target Return (Gross)</h4>
                        <p style={styles.metricValue}>${ourReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div style={styles.metricCard}>
                        <h4>Net Multiple on Basis</h4>
                        <p style={styles.metricValue}>{exitMetrics.netMultiple.toFixed(2)}x</p>
                    </div>
                    <div style={styles.metricCard}>
                        <h4>Estimated IRR (5Y Avg.)</h4>
                        <p style={styles.metricValue}>{exitMetrics.irr.toFixed(1)}%</p>
                    </div>
                    <div style={styles.metricCard}>
                        <h4>Investment Basis</h4>
                        <p style={styles.metricValue}>${basis.toLocaleString()}</p>
                    </div>
                </div>

                <button style={styles.simulateButton}>
                    Run Advanced Liquidity Analysis
                </button>

                <p style={{ marginTop: 20, fontSize: 12, color: '#777' }}>
                    * Projections are simplified. Full liquidation preference modeling is available in the Waterfall Analysis panel below.
                </p>
            </div>
        );
    };

    return (
        <div style={styles.loungeContainer}>
            <header style={styles.header}>
                <h1>Private Equity Lounge: ACME Corp Stake</h1>
                <p>Exclusive access for managing large, illiquid financial positions. Current Estimated Valuation: <strong>${currentValuation.toLocaleString()}</strong></p>
            </header>

            <main style={styles.mainContent}>
                
                <div style={styles.panel}>{renderCapTable()}</div>

                <div style={styles.panel}>{renderExitModeling()}</div>

                <div style={{ ...styles.panel, gridColumn: 'span 2' }}>
                    <h3 style={styles.sectionTitle}>Advanced Simulation: Waterfall & Distributions</h3>
                    <div style={{ height: 200, backgroundColor: '#1e1e2d', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', padding: 20 }}>
                        <p>Self-Contained Liquidity Modeling Engine (Zero Cost)</p>
                        <div style={{ marginTop: 15, width: '80%', height: 80, border: '1px dashed #444', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: 14 }}>
                            <span>Scenario 1: 1x Pref Return</span>
                            <span>Scenario 2: Full Participation</span>
                            <span>Scenario 3: Custom Drag-Along</span>
                        </div>
                    </div>
                </div>
                
            </main>
        </div>
    );
};

// --- Standardized Styling (Self-contained, adhering to zero-dependency mandate) ---
const styles: { [key: string]: React.CSSProperties } = {
    loungeContainer: {
        fontFamily: 'Roboto, Arial, sans-serif',
        backgroundColor: '#0a0a1a', 
        color: '#f0f0f5',
        padding: 40,
        minHeight: '100vh',
    },
    header: {
        marginBottom: 30,
        borderBottom: '1px solid #333',
        paddingBottom: 20,
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 30,
    },
    panel: {
        backgroundColor: '#161625',
        borderRadius: 12,
        padding: 25,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
    },
    sectionTitle: {
        color: '#84e7ff', // Fintech/Prosperity Accent
        borderBottom: '1px solid #2b2b40',
        paddingBottom: 10,
        marginBottom: 15,
        fontSize: 18,
    },
    // Cap Table Styles
    capTableContainer: {},
    table: {
        fontSize: 13,
    },
    tableHeader: {
        display: 'flex',
        padding: '10px 10px 10px 0',
        fontWeight: 'bold',
        backgroundColor: '#1e1e30',
        marginBottom: 5,
        borderRadius: 4,
        textTransform: 'uppercase',
    },
    tableRow: {
        display: 'flex',
        padding: '8px 0',
        borderBottom: '1px dotted #2b2b40',
        alignItems: 'center',
    },
    tableFooter: {
        display: 'flex',
        padding: '12px 0',
        marginTop: 10,
        fontWeight: 'bold',
        borderTop: '3px solid #00aaff',
    },
    // Exit Modeling Styles
    exitModelContainer: {},
    inputGroup: {
        marginBottom: 20,
    },
    inputField: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#1e1e2d',
        border: '1px solid #3a3a50',
        color: '#f0f0f5',
        borderRadius: 6,
        width: '95%',
        fontSize: 16,
    },
    metricGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 15,
        marginBottom: 25,
    },
    metricCard: {
        backgroundColor: '#202035',
        padding: 15,
        borderRadius: 8,
        textAlign: 'center',
        borderLeft: '4px solid #00aaff',
    },
    metricValue: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        margin: '5px 0 0 0',
    },
    simulateButton: {
        width: '100%',
        padding: '15px 20px',
        backgroundColor: '#00aaff',
        color: '#0a0a1a',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 16,
        transition: 'background-color 0.2s',
    }
};


export default PrivateEquityLounge;