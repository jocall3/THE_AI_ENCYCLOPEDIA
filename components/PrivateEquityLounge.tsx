import React, { useState, useMemo } from 'react';

// Data Models and Interfaces

interface Stakeholder {
    id: number;
    name: string;
    shares: number;
    type: 'Founder' | 'Investor' | 'Employee' | 'Option Pool' | 'Advisor';
    equityPercentage: number;
    basis: number;
    vested: number;
    votingRights: boolean;
    antiDilution: 'None' | 'Full Ratchet' | 'Weighted Average';
}

interface FinancialMetric {
    label: string;
    value: number;
    delta: number; // Percentage change
    trend: 'up' | 'down' | 'flat';
    prefix?: string;
    suffix?: string;
}

interface AIInsight {
    id: number;
    category: 'Risk' | 'Opportunity' | 'Compliance' | 'Strategy';
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    message: string;
    timestamp: string;
}

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    status: 'Verified' | 'Pending' | 'Flagged';
    accessLevel: 'Admin' | 'Board' | 'Public';
}

interface ChatMessage {
    id: number;
    sender: 'User' | 'System_AI';
    text: string;
    timestamp: Date;
}

// Mock Data

const mockStakeholders: Stakeholder[] = [
    { id: 1, name: "Prosperity Fund A (PFS)", shares: 4500000, type: 'Investor', equityPercentage: 45.00, basis: 50000000, vested: 100, votingRights: true, antiDilution: 'Weighted Average' },
    { id: 2, name: "Alice Founder", shares: 2500000, type: 'Founder', equityPercentage: 25.00, basis: 10000, vested: 85, votingRights: true, antiDilution: 'None' },
    { id: 3, name: "Bob Co-Founder", shares: 1500000, type: 'Founder', equityPercentage: 15.00, basis: 10000, vested: 85, votingRights: true, antiDilution: 'None' },
    { id: 4, name: "Employee Pool (Vested)", shares: 1000000, type: 'Employee', equityPercentage: 10.00, basis: 0, vested: 100, votingRights: false, antiDilution: 'None' },
    { id: 5, name: "Future Options Pool", shares: 500000, type: 'Option Pool', equityPercentage: 5.00, basis: 0, vested: 0, votingRights: false, antiDilution: 'None' },
    { id: 6, name: "Strategic Advisor Group", shares: 100000, type: 'Advisor', equityPercentage: 1.00, basis: 0, vested: 50, votingRights: false, antiDilution: 'None' },
];

const initialDocuments: Document[] = [
    { id: 1, name: "Series A Term Sheet.pdf", type: "PDF", size: "2.4 MB", uploadDate: "2023-10-15", status: "Verified", accessLevel: "Board" },
    { id: 2, name: "Q3 Financial Audit.xlsx", type: "XLSX", size: "4.1 MB", uploadDate: "2023-11-02", status: "Verified", accessLevel: "Admin" },
    { id: 3, name: "IP Assignment Agreements.zip", type: "ZIP", size: "15.0 MB", uploadDate: "2023-09-01", status: "Flagged", accessLevel: "Admin" },
    { id: 4, name: "Board Meeting Minutes Oct.docx", type: "DOCX", size: "1.2 MB", uploadDate: "2023-10-28", status: "Pending", accessLevel: "Board" },
];

const initialInsights: AIInsight[] = [
    { id: 1, category: 'Opportunity', severity: 'High', message: "Market analysis suggests a 15% valuation premium if IPO is delayed to Q3 2025 due to sector rotation.", timestamp: "10:42 AM" },
    { id: 2, category: 'Risk', severity: 'Medium', message: "Burn rate has increased by 8% month-over-month. Recommended review of marketing spend efficiency.", timestamp: "09:15 AM" },
    { id: 3, category: 'Compliance', severity: 'Low', message: "Annual 409A valuation update required within 45 days.", timestamp: "Yesterday" },
];

// Component Definition

const PrivateEquityLounge: React.FC = () => {
    // State Management
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'CapTable' | 'Liquidity' | 'DataRoom' | 'AI_Advisor'>('Dashboard');
    const [stakeholders] = useState<Stakeholder[]>(mockStakeholders);
    const [documents] = useState<Document[]>(initialDocuments);
    const [insights] = useState<AIInsight[]>(initialInsights);
    
    // Financial State
    const [valuation, setValuation] = useState<number>(100000000);
    const [revenue, setRevenue] = useState<number>(12500000);
    const [ebitda, setEbitda] = useState<number>(-2500000);
    const [cashOnHand, setCashOnHand] = useState<number>(18000000);
    
    // Scenario State
    const [exitValuation, setExitValuation] = useState<number>(250000000);
    const [exitDate, setExitDate] = useState<number>(36); // Months
    
    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: 1, sender: 'System_AI', text: "Welcome to the Executive Suite. I have analyzed your real-time financial data. How can I assist with your strategic planning today?", timestamp: new Date() }
    ]);

    // Computed Metrics
    
    const totalShares = useMemo(() => stakeholders.reduce((sum, s) => sum + s.shares, 0), [stakeholders]);
    
    const kpis: FinancialMetric[] = useMemo(() => [
        { label: "Current Valuation", value: valuation, delta: 12.5, trend: 'up', prefix: "$" },
        { label: "ARR (Annual Recurring)", value: revenue, delta: 8.2, trend: 'up', prefix: "$" },
        { label: "EBITDA", value: ebitda, delta: -2.1, trend: 'down', prefix: "$" },
        { label: "Runway (Months)", value: cashOnHand / Math.abs(ebitda / 12), delta: 0, trend: 'flat', suffix: " Mo" },
    ], [valuation, revenue, ebitda, cashOnHand]);

    const exitScenarios = useMemo(() => {
        const grossReturn = exitValuation;
        const investor = stakeholders.find(s => s.id === 1);
        if (!investor) return null;
        
        const investorReturn = grossReturn * (investor.equityPercentage / 100);
        const multiple = investorReturn / investor.basis;
        const irr = (Math.pow(multiple, 1 / (exitDate / 12)) - 1) * 100;
        
        return {
            grossReturn,
            investorReturn,
            multiple,
            irr
        };
    }, [exitValuation, exitDate, stakeholders]);

    // Event Handlers

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        
        const userMsg: ChatMessage = { id: Date.now(), sender: 'User', text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');

        // Simulate AI Processing
        setTimeout(() => {
            let responseText = "I am processing that request against our global market database.";
            if (userMsg.text.toLowerCase().includes('valuation')) {
                responseText = `Based on current SaaS multiples of 8x-12x, a valuation of $${(revenue * 10).toLocaleString()} is defensible. Your current valuation of $${valuation.toLocaleString()} is conservative.`;
            } else if (userMsg.text.toLowerCase().includes('risk')) {
                responseText = "Primary risk factors identified: 1. Customer concentration in Tech sector. 2. Rising CAC due to ad market saturation. 3. Key person dependency on Alice Founder.";
            } else if (userMsg.text.toLowerCase().includes('exit')) {
                responseText = `Modeling a $${exitValuation.toLocaleString()} exit in ${exitDate} months yields a ${exitScenarios?.multiple.toFixed(2)}x multiple for primary investors. This exceeds the fund's hurdle rate of 3.0x.`;
            }

            const aiMsg: ChatMessage = { id: Date.now() + 1, sender: 'System_AI', text: responseText, timestamp: new Date() };
            setChatHistory(prev => [...prev, aiMsg]);
        }, 800);
    };

    // Render Functions

    const renderSidebar = () => (
        <div style={styles.sidebar}>
            <div style={styles.logoArea}>
                <div style={styles.logoCircle}>PE</div>
                <h2 style={styles.logoText}>NEXUS<span style={{color: '#00aaff'}}>OS</span></h2>
            </div>
            <nav style={styles.nav}>
                {['Dashboard', 'CapTable', 'Liquidity', 'DataRoom', 'AI_Advisor'].map((tab) => (
                    <button 
                        key={tab} 
                        style={activeTab === tab ? styles.navButtonActive : styles.navButton}
                        onClick={() => setActiveTab(tab as any)}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </nav>
            <div style={styles.sidebarFooter}>
                <div style={styles.statusIndicator}>
                    <span style={styles.statusDot}></span> System Operational
                </div>
                <div style={styles.userProfile}>
                    <div style={styles.avatar}>AS</div>
                    <div style={styles.userInfo}>
                        <span style={styles.userName}>Alex Smith</span>
                        <span style={styles.userRole}>Managing Partner</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>Executive Command Center</h1>
                    <p style={styles.pageSubtitle}>Real-time enterprise telemetry and strategic oversight.</p>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.actionButton}>Generate Report</button>
                    <button style={styles.primaryButton}>Invite Stakeholder</button>
                </div>
            </header>

            <div style={styles.kpiGrid}>
                {kpis.map((kpi, idx) => (
                    <div key={idx} style={styles.kpiCard}>
                        <span style={styles.kpiLabel}>{kpi.label}</span>
                        <div style={styles.kpiValueRow}>
                            <span style={styles.kpiValue}>
                                {kpi.prefix}{kpi.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}{kpi.suffix}
                            </span>
                            <span style={{ 
                                ...styles.kpiDelta, 
                                color: kpi.trend === 'up' ? '#00ff9d' : kpi.trend === 'down' ? '#ff4d4d' : '#aaa' 
                            }}>
                                {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
                            </span>
                        </div>
                        <div style={styles.miniChart}>
                            <div style={{ ...styles.chartBar, height: '40%' }}></div>
                            <div style={{ ...styles.chartBar, height: '60%' }}></div>
                            <div style={{ ...styles.chartBar, height: '50%' }}></div>
                            <div style={{ ...styles.chartBar, height: '80%' }}></div>
                            <div style={{ ...styles.chartBar, height: '100%', backgroundColor: '#00aaff' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.dashboardGrid}>
                <div style={styles.dashboardPanel}>
                    <h3 style={styles.panelTitle}>AI Strategic Insights</h3>
                    <div style={styles.insightList}>
                        {insights.map(insight => (
                            <div key={insight.id} style={styles.insightItem}>
                                <div style={{
                                    ...styles.severityIndicator,
                                    backgroundColor: insight.severity === 'High' ? '#ff4d4d' : insight.severity === 'Medium' ? '#ffaa00' : '#00aaff'
                                }}></div>
                                <div style={styles.insightContent}>
                                    <div style={styles.insightHeader}>
                                        <span style={styles.insightCategory}>{insight.category}</span>
                                        <span style={styles.insightTime}>{insight.timestamp}</span>
                                    </div>
                                    <p style={styles.insightMessage}>{insight.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={styles.dashboardPanel}>
                    <h3 style={styles.panelTitle}>Market Performance vs Peers</h3>
                    <div style={styles.chartPlaceholder}>
                        <div style={styles.chartGridLines}>
                            {[1,2,3,4,5].map(i => <div key={i} style={styles.gridLine}></div>)}
                        </div>
                        <div style={styles.chartBarsContainer}>
                            <div style={{...styles.chartBarLarge, height: '40%', left: '10%'}}></div>
                            <div style={{...styles.chartBarLarge, height: '55%', left: '30%'}}></div>
                            <div style={{...styles.chartBarLarge, height: '45%', left: '50%'}}></div>
                            <div style={{...styles.chartBarLarge, height: '70%', left: '70%'}}></div>
                            <div style={{...styles.chartBarLarge, height: '85%', left: '90%', backgroundColor: '#00aaff', boxShadow: '0 0 15px rgba(0,170,255,0.5)'}}></div>
                        </div>
                        <div style={styles.chartLabels}>
                            <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>Current</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCapTable = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>Capitalization Table</h1>
                    <p style={styles.pageSubtitle}>Immutable ledger of equity ownership and dilution modeling.</p>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.actionButton}>Export CSV</button>
                    <button style={styles.primaryButton}>Issue New Options</button>
                </div>
            </header>

            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <div style={{ flex: 3 }}>Stakeholder Entity</div>
                    <div style={{ flex: 1 }}>Class</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Shares</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Ownership</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Vested</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Voting</div>
                    <div style={{ flex: 2, textAlign: 'right' }}>Cost Basis</div>
                </div>
                {stakeholders.map(s => (
                    <div key={s.id} style={styles.tableRow}>
                        <div style={{ flex: 3, fontWeight: 600, color: '#fff' }}>{s.name}</div>
                        <div style={{ flex: 1 }}>
                            <span style={{
                                ...styles.badge,
                                backgroundColor: s.type === 'Investor' ? 'rgba(0, 170, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: s.type === 'Investor' ? '#00aaff' : '#ccc'
                            }}>{s.type}</span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace' }}>{s.shares.toLocaleString()}</div>
                        <div style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace', color: '#00ff9d' }}>{s.equityPercentage.toFixed(2)}%</div>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                            <div style={styles.progressBar}>
                                <div style={{ ...styles.progressFill, width: `${s.vested}%` }}></div>
                            </div>
                            <span style={{ fontSize: 10, color: '#777' }}>{s.vested}%</span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>{s.votingRights ? 'âœ“' : '-'}</div>
                        <div style={{ flex: 2, textAlign: 'right', fontFamily: 'monospace' }}>${s.basis.toLocaleString()}</div>
                    </div>
                ))}
                <div style={styles.tableFooter}>
                    <div style={{ flex: 3 }}>TOTAL OUTSTANDING</div>
                    <div style={{ flex: 1 }}></div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{totalShares.toLocaleString()}</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>100.00%</div>
                    <div style={{ flex: 4 }}></div>
                </div>
            </div>
        </div>
    );

    const renderLiquidity = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>Liquidity & Waterfall Analysis</h1>
                    <p style={styles.pageSubtitle}>Advanced exit scenario modeling and distribution logic.</p>
                </div>
            </header>

            <div style={styles.splitLayout}>
                <div style={styles.controlPanel}>
                    <h3 style={styles.panelTitle}>Scenario Parameters</h3>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Target Exit Valuation</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputPrefix}>$</span>
                            <input 
                                type="number" 
                                value={exitValuation} 
                                onChange={(e) => setExitValuation(Number(e.target.value))}
                                style={styles.input} 
                            />
                        </div>
                        <input 
                            type="range" 
                            min="10000000" 
                            max="1000000000" 
                            step="1000000"
                            value={exitValuation}
                            onChange={(e) => setExitValuation(Number(e.target.value))}
                            style={styles.rangeInput}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Time to Exit (Months)</label>
                        <div style={styles.inputWrapper}>
                            <input 
                                type="number" 
                                value={exitDate} 
                                onChange={(e) => setExitDate(Number(e.target.value))}
                                style={styles.input} 
                            />
                            <span style={styles.inputSuffix}>Months</span>
                        </div>
                        <input 
                            type="range" 
                            min="6" 
                            max="120" 
                            value={exitDate}
                            onChange={(e) => setExitDate(Number(e.target.value))}
                            style={styles.rangeInput}
                        />
                    </div>

                    <div style={styles.infoBox}>
                        <h4 style={{margin: '0 0 10px 0', color: '#00aaff'}}>AI Projection</h4>
                        <p style={{fontSize: 13, lineHeight: 1.5, color: '#ccc'}}>
                            Based on current burn rate and market conditions, an exit in {exitDate} months requires a CAGR of 45% to justify a ${exitValuation.toLocaleString()} valuation. Probability: 62%.
                        </p>
                    </div>
                </div>

                <div style={styles.resultsPanel}>
                    <h3 style={styles.panelTitle}>Distribution Waterfall</h3>
                    {exitScenarios && (
                        <div style={styles.waterfallGrid}>
                            <div style={styles.waterfallCard}>
                                <div style={styles.waterfallLabel}>Gross Exit Value</div>
                                <div style={styles.waterfallValue}>${exitScenarios.grossReturn.toLocaleString()}</div>
                            </div>
                            <div style={styles.waterfallCard}>
                                <div style={styles.waterfallLabel}>Investor Proceeds</div>
                                <div style={styles.waterfallValue}>${exitScenarios.investorReturn.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                <div style={styles.waterfallSub}>45% Ownership</div>
                            </div>
                            <div style={styles.waterfallCard}>
                                <div style={styles.waterfallLabel}>Net Multiple (MOIC)</div>
                                <div style={{...styles.waterfallValue, color: exitScenarios.multiple > 3 ? '#00ff9d' : '#fff'}}>
                                    {exitScenarios.multiple.toFixed(2)}x
                                </div>
                            </div>
                            <div style={styles.waterfallCard}>
                                <div style={styles.waterfallLabel}>Internal Rate of Return (IRR)</div>
                                <div style={{...styles.waterfallValue, color: exitScenarios.irr > 25 ? '#00ff9d' : '#fff'}}>
                                    {exitScenarios.irr.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    )}
                    <div style={styles.chartPlaceholder}>
                        <div style={{display: 'flex', alignItems: 'flex-end', height: '100%', gap: 20, padding: '0 20px'}}>
                            <div style={{width: '20%', height: '30%', backgroundColor: '#333', borderRadius: '4px 4px 0 0', position: 'relative'}}>
                                <span style={styles.barLabel}>Pref</span>
                            </div>
                            <div style={{width: '20%', height: '50%', backgroundColor: '#444', borderRadius: '4px 4px 0 0', position: 'relative'}}>
                                <span style={styles.barLabel}>Debt</span>
                            </div>
                            <div style={{width: '20%', height: '80%', backgroundColor: '#00aaff', borderRadius: '4px 4px 0 0', position: 'relative'}}>
                                <span style={styles.barLabel}>Common</span>
                            </div>
                            <div style={{width: '20%', height: '100%', backgroundColor: '#00ff9d', borderRadius: '4px 4px 0 0', position: 'relative'}}>
                                <span style={styles.barLabel}>Total</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDataRoom = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>Secure Data Room</h1>
                    <p style={styles.pageSubtitle}>Encrypted repository for due diligence and governance.</p>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.primaryButton}>Upload Document</button>
                </div>
            </header>

            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <div style={{ flex: 3 }}>Document Name</div>
                    <div style={{ flex: 1 }}>Type</div>
                    <div style={{ flex: 1 }}>Size</div>
                    <div style={{ flex: 1 }}>Date</div>
                    <div style={{ flex: 1 }}>Access</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
                </div>
                {documents.map(doc => (
                    <div key={doc.id} style={styles.tableRow}>
                        <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={styles.docIcon}>ðŸ“„</div>
                            <span style={{ color: '#fff', fontWeight: 500 }}>{doc.name}</span>
                        </div>
                        <div style={{ flex: 1, color: '#888' }}>{doc.type}</div>
                        <div style={{ flex: 1, color: '#888' }}>{doc.size}</div>
                        <div style={{ flex: 1, color: '#888' }}>{doc.uploadDate}</div>
                        <div style={{ flex: 1 }}>
                            <span style={styles.tag}>{doc.accessLevel}</span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                            <span style={{
                                ...styles.statusBadge,
                                backgroundColor: doc.status === 'Verified' ? 'rgba(0, 255, 157, 0.1)' : doc.status === 'Flagged' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 170, 0, 0.1)',
                                color: doc.status === 'Verified' ? '#00ff9d' : doc.status === 'Flagged' ? '#ff4d4d' : '#ffaa00'
                            }}>
                                {doc.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAIAdvisor = () => (
        <div style={styles.contentFadeIn}>
            <div style={styles.chatContainer}>
                <div style={styles.chatSidebar}>
                    <h3 style={styles.panelTitle}>Active Agents</h3>
                    <div style={styles.agentCard}>
                        <div style={styles.agentAvatar}>FN</div>
                        <div>
                            <div style={styles.agentName}>Financial Analyst</div>
                            <div style={styles.agentStatus}>Online â€¢ Processing</div>
                        </div>
                    </div>
                    <div style={{...styles.agentCard, opacity: 0.5}}>
                        <div style={styles.agentAvatar}>LG</div>
                        <div>
                            <div style={styles.agentName}>Legal Compliance</div>
                            <div style={styles.agentStatus}>Idle</div>
                        </div>
                    </div>
                    <div style={{...styles.agentCard, opacity: 0.5}}>
                        <div style={styles.agentAvatar}>MK</div>
                        <div>
                            <div style={styles.agentName}>Market Sentiment</div>
                            <div style={styles.agentStatus}>Idle</div>
                        </div>
                    </div>
                </div>
                <div style={styles.chatMain}>
                    <div style={styles.chatHeader}>
                        <h3>NEXUS Strategic Advisor</h3>
                        <span style={styles.chatSubtitle}>Powered by Enterprise Neural Engine v4.0</span>
                    </div>
                    <div style={styles.chatHistory}>
                        {chatHistory.map(msg => (
                            <div key={msg.id} style={msg.sender === 'User' ? styles.msgUser : styles.msgSystem}>
                                <div style={styles.msgBubble}>
                                    {msg.text}
                                </div>
                                <div style={styles.msgTime}>
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.chatInputArea}>
                        <input 
                            type="text" 
                            placeholder="Ask about valuation, risks, or exit scenarios..." 
                            style={styles.chatInput}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button style={styles.sendButton} onClick={handleSendMessage}>
                            SEND COMMAND
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.appContainer}>
            {renderSidebar()}
            <main style={styles.mainContent}>
                {activeTab === 'Dashboard' && renderDashboard()}
                {activeTab === 'CapTable' && renderCapTable()}
                {activeTab === 'Liquidity' && renderLiquidity()}
                {activeTab === 'DataRoom' && renderDataRoom()}
                {activeTab === 'AI_Advisor' && renderAIAdvisor()}
            </main>
        </div>
    );
};

// --- STYLES ---

const styles: { [key: string]: React.CSSProperties } = {
    appContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#05050a',
        color: '#e0e0e0',
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        overflow: 'hidden',
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#0a0a12',
        borderRight: '1px solid #1f1f2e',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        zIndex: 10,
    },
    logoArea: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 40,
        gap: 12,
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        backgroundColor: '#00aaff',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        boxShadow: '0 0 15px rgba(0, 170, 255, 0.4)',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '1px',
        margin: 0,
        color: '#fff',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1,
    },
    navButton: {
        textAlign: 'left',
        padding: '12px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 50,
        transition: 'all 0.2s',
    },
    navButtonActive: {
        textAlign: 'left',
        padding: '12px 16px',
        backgroundColor: 'rgba(0, 170, 255, 0.1)',
        border: 'none',
        color: '#00aaff',
        cursor: 'pointer',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        borderLeft: '3px solid #00aaff',
    },
    sidebarFooter: {
        borderTop: '1px solid #1f1f2e',
        paddingTop: 20,
    },
    statusIndicator: {
        fontSize: 11,
        color: '#00ff9d',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#00ff9d',
        boxShadow: '0 0 8px #00ff9d',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 'bold',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
    },
    userRole: {
        fontSize: 11,
        color: '#666',
    },
    mainContent: {
        flex: 1,
        padding: '40px',
        overflowY: 'auto',
        backgroundColor: '#05050a',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #111122 0%, #05050a 60%)',
    },
    contentFadeIn: {
        animation: 'fadeIn 0.4s ease-out',
    },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 700,
        margin: '0 0 8px 0',
        color: '#fff',
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#888',
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#00aaff',
        color: '#000',
        border: 'none',
        padding: '10px 20px',
        borderRadius: 6,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 13,
        boxShadow: '0 4px 12px rgba(0, 170, 255, 0.3)',
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#fff',
        border: '1px solid #333',
        padding: '10px 20px',
        borderRadius: 6,
        fontWeight: 500,
        cursor: 'pointer',
        fontSize: 13,
    },
    kpiGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 30,
    },
    kpiCard: {
        backgroundColor: '#11111a',
        border: '1px solid #222',
        borderRadius: 12,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    kpiLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    kpiValueRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        marginTop: 8,
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: 700,
        color: '#fff',
    },
    kpiDelta: {
        fontSize: 12,
        fontWeight: 600,
    },
    miniChart: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        height: 30,
        marginTop: 15,
        opacity: 0.5,
    },
    chartBar: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: '2px 2px 0 0',
    },
    dashboardGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 20,
    },
    dashboardPanel: {
        backgroundColor: '#11111a',
        border: '1px solid #222',
        borderRadius: 12,
        padding: 25,
        minHeight: 300,
    },
    panelTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
        marginBottom: 20,
        borderBottom: '1px solid #222',
        paddingBottom: 15,
    },
    insightList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    insightItem: {
        display: 'flex',
        gap: 15,
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
        borderLeft: '1px solid #333',
    },
    severityIndicator: {
        width: 4,
        borderRadius: 4,
        backgroundColor: '#00aaff',
    },
    insightContent: {
        flex: 1,
    },
    insightHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    insightCategory: {
        fontSize: 11,
        fontWeight: 700,
        color: '#fff',
        textTransform: 'uppercase',
    },
    insightTime: {
        fontSize: 11,
        color: '#666',
    },
    insightMessage: {
        fontSize: 13,
        color: '#ccc',
        margin: 0,
        lineHeight: 1.4,
    },
    chartPlaceholder: {
        height: 200,
        position: 'relative',
        marginTop: 20,
    },
    chartGridLines: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    gridLine: {
        height: 1,
        backgroundColor: '#222',
        width: '100%',
    },
    chartBarsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    chartBarLarge: {
        position: 'absolute',
        bottom: 0,
        width: '12%',
        backgroundColor: '#333',
        borderRadius: '4px 4px 0 0',
        transition: 'height 0.5s ease',
    },
    chartLabels: {
        position: 'absolute',
        bottom: -25,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10%',
        fontSize: 11,
        color: '#666',
    },
    // Table Styles
    tableContainer: {
        backgroundColor: '#11111a',
        border: '1px solid #222',
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'flex',
        padding: '15px 20px',
        backgroundColor: '#161624',
        borderBottom: '1px solid #222',
        fontSize: 12,
        fontWeight: 600,
        color: '#888',
        textTransform: 'uppercase',
    },
    tableRow: {
        display: 'flex',
        padding: '15px 20px',
        borderBottom: '1px solid #1f1f2e',
        alignItems: 'center',
        fontSize: 13,
        color: '#ddd',
        transition: 'background-color 0.1s',
    },
    tableFooter: {
        display: 'flex',
        padding: '15px 20px',
        backgroundColor: '#161624',
        fontSize: 12,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '1px',
    },
    badge: {
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        width: '100%',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00ff9d',
        borderRadius: 2,
    },
    // Liquidity Styles
    splitLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 20,
    },
    controlPanel: {
        backgroundColor: '#11111a',
        border: '1px solid #222',
        borderRadius: 12,
        padding: 25,
    },
    resultsPanel: {
        backgroundColor: '#11111a',
        border: '1px solid #222',
        borderRadius: 12,
        padding: 25,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        display: 'block',
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#0a0a12',
        border: '1px solid #333',
        borderRadius: 6,
        padding: '0 12px',
        marginBottom: 10,
    },
    input: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        padding: '12px 0',
        fontSize: 16,
        width: '100%',
        outline: 'none',
        fontWeight: 600,
    },
    inputPrefix: {
        color: '#666',
        marginRight: 5,
    },
    inputSuffix: {
        color: '#666',
        fontSize: 12,
    },
    rangeInput: {
        width: '100%',
        accentColor: '#00aaff',
    },
    infoBox: {
        backgroundColor: 'rgba(0, 170, 255, 0.05)',
        border: '1px solid rgba(0, 170, 255, 0.1)',
        borderRadius: 8,
        padding: 15,
        marginTop: 20,
    },
    waterfallGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 15,
        marginBottom: 30,
    },
    waterfallCard: {
        backgroundColor: '#1a1a26',
        padding: 15,
        borderRadius: 8,
        textAlign: 'center',
    },
    waterfallLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 5,
    },
    waterfallValue: {
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
    },
    waterfallSub: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    barLabel: {
        position: 'absolute',
        bottom: -25,
        width: '100%',
        textAlign: 'center',
        fontSize: 11,
        color: '#888',
    },
    // Data Room Styles
    docIcon: {
        fontSize: 18,
    },
    tag: {
        backgroundColor: '#222',
        color: '#aaa',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
    },
    // Chat Styles
    chatContainer: {
        display: 'flex',
        height: 'calc(100vh - 140px)',
        backgroundColor: '#11111a',
        border: '1px solid #222',
        borderRadius: 12,
        overflow: 'hidden',
    },
    chatSidebar: {
        width: 250,
        backgroundColor: '#161624',
        borderRight: '1px solid #222',
        padding: 20,
    },
    agentCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        backgroundColor: '#1f1f2e',
        borderRadius: 8,
        marginBottom: 10,
        cursor: 'pointer',
    },
    agentAvatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#00aaff',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 'bold',
    },
    agentName: {
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
    },
    agentStatus: {
        fontSize: 10,
        color: '#00ff9d',
    },
    chatMain: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    chatHeader: {
        padding: '15px 20px',
        borderBottom: '1px solid #222',
        backgroundColor: '#161624',
    },
    chatSubtitle: {
        fontSize: 11,
        color: '#00aaff',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    chatHistory: {
        flex: 1,
        padding: 20,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    msgUser: {
        alignSelf: 'flex-end',
        maxWidth: '70%',
    },
    msgSystem: {
        alignSelf: 'flex-start',
        maxWidth: '70%',
    },
    msgBubble: {
        padding: '12px 16px',
        borderRadius: 8,
        backgroundColor: '#222',
        color: '#ddd',
        fontSize: 14,
        lineHeight: 1.5,
        border: '1px solid #333',
    },
    msgTime: {
        fontSize: 10,
        color: '#555',
        marginTop: 4,
        textAlign: 'right',
    },
    chatInputArea: {
        padding: 20,
        borderTop: '1px solid #222',
        display: 'flex',
        gap: 10,
        backgroundColor: '#161624',
    },
    chatInput: {
        flex: 1,
        backgroundColor: '#0a0a12',
        border: '1px solid #333',
        borderRadius: 6,
        padding: '12px',
        color: '#fff',
        outline: 'none',
    },
    sendButton: {
        backgroundColor: '#00aaff',
        color: '#000',
        border: 'none',
        borderRadius: 6,
        padding: '0 20px',
        fontWeight: 700,
        fontSize: 12,
        cursor: 'pointer',
    }
};

export default PrivateEquityLounge;