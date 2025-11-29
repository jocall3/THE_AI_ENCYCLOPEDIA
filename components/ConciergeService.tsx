import React, { useState, useEffect } from 'react';

// -----------------------------------------------------------------------------
// SYSTEM ARCHITECTURE & TYPES
// -----------------------------------------------------------------------------

type ViewMode = 'DASHBOARD' | 'ASSETS' | 'INTELLIGENCE' | 'OPERATIONS' | 'SECURITY' | 'PROFILE' | 'COMMUNICATIONS';
type AssetCategory = 'JETS' | 'YACHTS' | 'REAL_ESTATE' | 'EVENTS' | 'SECURITY' | 'ART' | 'SPACE' | 'PHILANTHROPY';
type AIStatus = 'IDLE' | 'ANALYZING' | 'PROCESSING' | 'GENERATING' | 'OPTIMIZING';

interface Asset {
  id: string;
  category: AssetCategory;
  title: string;
  description: string;
  specs: Record<string, string>;
  availability: string;
  value: string;
  roi: string;
  imageGradient: string;
  aiAnalysis: string;
}

interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number; // percentage
  prediction: string;
}

interface Message {
  id: string;
  sender: 'USER' | 'SYSTEM' | 'AI_CORE';
  content: string;
  timestamp: number;
  context?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
  read: boolean;
}

interface UserProfile {
  name: string;
  title: string;
  clearanceLevel: string;
  netWorth: string;
  liquidAssets: string;
  reputationScore: number;
  biometrics: {
    heartRate: number;
    stressLevel: number;
    focusIndex: number;
  };
}

// -----------------------------------------------------------------------------
// GLOBAL CONSTANTS & ASSETS (THE "BILLION DOLLAR" DATA LAYER)
// -----------------------------------------------------------------------------

const THEME = {
  colors: {
    background: '#030304',
    surface: '#0a0a0b',
    surfaceHighlight: '#141416',
    border: '#1f1f22',
    primary: '#D4AF37', // Gold
    primaryDim: 'rgba(212, 175, 55, 0.1)',
    secondary: '#FFFFFF',
    text: '#EAEAEA',
    textDim: '#888888',
    success: '#00F090',
    warning: '#F0B90B',
    danger: '#FF3B30',
    accent: '#3B82F6',
    ai: '#8B5CF6', // Purple for AI
  },
  fonts: {
    main: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"SF Mono", "Fira Code", Consolas, monospace',
    serif: '"Didot", "Bodoni MT", serif',
  },
  shadows: {
    card: '0 10px 30px -10px rgba(0,0,0,0.5)',
    glow: '0 0 20px rgba(212, 175, 55, 0.15)',
    aiGlow: '0 0 30px rgba(139, 92, 246, 0.2)',
  }
};

const ICONS = {
  dashboard: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  assets: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>,
  intelligence: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 10.5M12 12V22M12 12l9.9-1.5"/></svg>,
  security: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  profile: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  ai: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/><path d="M2 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/><path d="M16 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>,
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
};

const GLOBAL_ASSETS: Asset[] = [
  // JETS
  {
    id: 'JET-001',
    category: 'JETS',
    title: 'Gulfstream G800 "Apex"',
    description: 'The longest-range business jet in the industry, configured for global diplomacy.',
    specs: { Range: '8,000 nm', Speed: 'Mach 0.925', Capacity: '19 Pax', Avionics: 'Symmetry Flight Deck' },
    availability: 'Immediate',
    value: '$72,500,000',
    roi: '+4.2% / yr',
    imageGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    aiAnalysis: 'Optimal for upcoming trans-pacific summit. Fuel efficiency rating: A+.'
  },
  {
    id: 'JET-002',
    category: 'JETS',
    title: 'Bombardier Global 7500',
    description: 'Four true living spaces with a master suite and full-size bed.',
    specs: { Range: '7,700 nm', Speed: 'Mach 0.925', Capacity: '17 Pax', Feature: 'Nuage Seats' },
    availability: 'In Transit (2h)',
    value: '$75,000,000',
    roi: '+3.8% / yr',
    imageGradient: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
    aiAnalysis: 'Suggested for family relocation logistics. High comfort index.'
  },
  // YACHTS
  {
    id: 'YACHT-001',
    category: 'YACHTS',
    title: 'Project "Sovereign" 120m',
    description: 'Hybrid propulsion gigayacht with onboard laboratory and submersible dock.',
    specs: { Length: '120m', Crew: '50', Guests: '24', Range: 'Transatlantic' },
    availability: 'Docked (Monaco)',
    value: '$350,000,000',
    roi: '-2.1% / yr',
    imageGradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
    aiAnalysis: 'Maintenance schedule optimized. Charter demand projected to increase 15% in Q3.'
  },
  // REAL ESTATE
  {
    id: 'RE-001',
    category: 'REAL_ESTATE',
    title: 'Penthouse One, Central Park Tower',
    description: 'The highest residence in the world. 360-degree views of New York City.',
    specs: { SqFt: '17,500', Floors: '3', Bedrooms: '7', Staff: 'Dedicated' },
    availability: 'Vacant',
    value: '$250,000,000',
    roi: '+8.5% / yr',
    imageGradient: 'linear-gradient(135deg, #1e1e1e 0%, #3a3a3a 100%)',
    aiAnalysis: 'Market peak approaching. Recommend holding for 12 months.'
  },
  {
    id: 'RE-002',
    category: 'REAL_ESTATE',
    title: 'Kyoto Imperial Estate',
    description: 'Historic sanctuary with private onsen and ancient zen gardens.',
    specs: { Acres: '4.5', History: '400 Years', Privacy: 'Absolute', Access: 'Helipad' },
    availability: 'Occupied (Guest)',
    value: '$85,000,000',
    roi: '+12.1% / yr',
    imageGradient: 'linear-gradient(135deg, #2C5364 0%, #203A43 50%, #0F2027 100%)',
    aiAnalysis: 'Cultural heritage asset. Tax incentives applicable for preservation.'
  },
  // SECURITY
  {
    id: 'SEC-001',
    category: 'SECURITY',
    title: 'Global Extraction Team Alpha',
    description: 'Elite ex-SAS unit available for immediate deployment worldwide.',
    specs: { Team: '12 Operatives', Response: '< 4 Hours', Equipment: 'Mil-Spec', Air: 'Included' },
    availability: 'Standby',
    value: '$250,000 / day',
    roi: 'N/A',
    imageGradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
    aiAnalysis: 'Threat level in Eastern Europe elevated. Recommend pre-positioning in Zurich.'
  },
  // SPACE
  {
    id: 'SPC-001',
    category: 'SPACE',
    title: 'Orbital Station "Nexus" Module',
    description: 'Private research and leisure module attached to commercial station.',
    specs: { Orbit: 'LEO', Capacity: '4', Duration: '14 Days', Training: 'Required' },
    availability: 'Launch Window Q4',
    value: '$55,000,000',
    roi: 'Intangible',
    imageGradient: 'linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)',
    aiAnalysis: 'Pre-flight medical clearance pending. Zero-G adaptation protocol generated.'
  }
];

// -----------------------------------------------------------------------------
// CORE COMPONENT
// -----------------------------------------------------------------------------

const ConciergeService: React.FC = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [view, setView] = useState<ViewMode>('DASHBOARD');
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('JETS');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [aiStatus, setAiStatus] = useState<AIStatus>('IDLE');
  const [chatInput, setChatInput] = useState('');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alexander V.',
    title: 'Global Chairman',
    clearanceLevel: 'OMEGA-1',
    netWorth: '$42,850,000,000',
    liquidAssets: '$1,250,000,000',
    reputationScore: 99.8,
    biometrics: { heartRate: 62, stressLevel: 12, focusIndex: 94 }
  });

  const [kpis, setKpis] = useState<KPI[]>([
    { id: 'k1', label: 'Global Portfolio', value: 42850000000, unit: 'USD', trend: 2.4, prediction: 'Bullish' },
    { id: 'k2', label: 'Liquid Capital', value: 1250000000, unit: 'USD', trend: -0.5, prediction: 'Stable' },
    { id: 'k3', label: 'Active Ventures', value: 142, unit: 'Count', trend: 5.0, prediction: 'Expansion' },
    { id: 'k4', label: 'Carbon Offset', value: 8500, unit: 'Tons', trend: 12.0, prediction: 'Target Met' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'AI_CORE', content: 'Welcome back, Chairman. Global markets are opening. I have prepared a briefing on the Singapore acquisition.', timestamp: Date.now() - 100000 },
    { id: 'm2', sender: 'SYSTEM', content: 'Security Protocol Level 1 Active. Biometrics confirmed.', timestamp: Date.now() - 90000 }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Asset Acquisition', message: 'The Tokyo commercial district deal has closed.', priority: 'HIGH', timestamp: Date.now(), read: false },
    { id: 'n2', title: 'Maintenance Alert', message: 'Gulfstream G800 requires scheduled avionics update.', priority: 'MEDIUM', timestamp: Date.now(), read: false }
  ]);

  // ---------------------------------------------------------------------------
  // EFFECTS & SIMULATIONS
  // ---------------------------------------------------------------------------
  
  // Clock & Biometrics Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Simulate live biometrics
      setUserProfile(prev => ({
        ...prev,
        biometrics: {
          heartRate: 60 + Math.floor(Math.random() * 10),
          stressLevel: Math.max(0, Math.min(100, prev.biometrics.stressLevel + (Math.random() > 0.5 ? 1 : -1))),
          focusIndex: Math.max(0, Math.min(100, prev.biometrics.focusIndex + (Math.random() > 0.5 ? 1 : -1)))
        }
      }));

      // Simulate live market data in KPIs
      setKpis(prev => prev.map(k => ({
        ...k,
        value: k.unit === 'USD' ? k.value + (Math.random() - 0.5) * 100000 : k.value,
        trend: k.trend + (Math.random() - 0.5) * 0.1
      })));

    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AI Processing Simulation
  useEffect(() => {
    if (aiStatus === 'ANALYZING') {
      const timer = setTimeout(() => {
        setAiStatus('PROCESSING');
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (aiStatus === 'PROCESSING') {
      const timer = setTimeout(() => {
        setAiStatus('GENERATING');
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (aiStatus === 'GENERATING') {
      const timer = setTimeout(() => {
        setAiStatus('IDLE');
        // Add a system response if needed
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [aiStatus]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'USER',
      content: chatInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setAiStatus('ANALYZING');

    // Simulate AI Response
    setTimeout(() => {
      const responses = [
        "I've analyzed the request. Initiating protocols.",
        "Cross-referencing with global database. One moment.",
        "Optimization complete. The asset has been allocated.",
        "I detect a 94% probability of success for this directive.",
        "Updating the ledger. Your privacy is secured."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'AI_CORE',
        content: randomResponse,
        timestamp: Date.now()
      }]);
    }, 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS (STYLES & COMPONENTS)
  // ---------------------------------------------------------------------------

  const styles = {
    container: {
      backgroundColor: THEME.colors.background,
      color: THEME.colors.text,
      fontFamily: THEME.fonts.main,
      minHeight: '100vh',
      display: 'flex',
      overflow: 'hidden',
    },
    sidebar: {
      width: '80px',
      backgroundColor: THEME.colors.surface,
      borderRight: `1px solid ${THEME.colors.border}`,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      padding: '20px 0',
      zIndex: 10,
    },
    sidebarIcon: (active: boolean) => ({
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      color: active ? THEME.colors.primary : THEME.colors.textDim,
      backgroundColor: active ? THEME.colors.primaryDim : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: active ? `1px solid ${THEME.colors.primary}` : '1px solid transparent',
    }),
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      overflow: 'hidden',
    },
    header: {
      height: '80px',
      borderBottom: `1px solid ${THEME.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      backgroundColor: 'rgba(3, 3, 4, 0.8)',
      backdropFilter: 'blur(10px)',
    },
    contentArea: {
      flex: 1,
      padding: '40px',
      overflowY: 'auto' as const,
      position: 'relative' as const,
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '40px',
    },
    kpiCard: {
      backgroundColor: THEME.colors.surface,
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: '8px',
      padding: '20px',
      position: 'relative' as const,
    },
    assetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '30px',
    },
    assetCard: {
      backgroundColor: THEME.colors.surface,
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    aiPanel: {
      width: '350px',
      backgroundColor: THEME.colors.surface,
      borderLeft: `1px solid ${THEME.colors.border}`,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    chatWindow: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
    },
    messageBubble: (sender: string) => ({
      alignSelf: sender === 'USER' ? 'flex-end' : 'flex-start',
      backgroundColor: sender === 'USER' ? THEME.colors.primaryDim : '#1a1a1a',
      color: sender === 'USER' ? THEME.colors.primary : '#ccc',
      padding: '12px 16px',
      borderRadius: '12px',
      maxWidth: '80%',
      fontSize: '0.9rem',
      border: sender === 'USER' ? `1px solid ${THEME.colors.primary}` : '1px solid #333',
    }),
    inputArea: {
      padding: '20px',
      borderTop: `1px solid ${THEME.colors.border}`,
      display: 'flex',
      gap: '10px',
    },
    input: {
      flex: 1,
      backgroundColor: '#000',
      border: `1px solid ${THEME.colors.border}`,
      color: '#fff',
      padding: '12px',
      borderRadius: '6px',
      outline: 'none',
    },
    modal: {
      position: 'fixed' as const,
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(15px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      width: '800px',
      maxHeight: '90vh',
      backgroundColor: THEME.colors.surface,
      border: `1px solid ${THEME.colors.primary}`,
      borderRadius: '16px',
      padding: '40px',
      overflowY: 'auto' as const,
      boxShadow: THEME.shadows.glow,
    },
    tag: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      marginRight: '8px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: '#aaa',
    }
  };

  // ---------------------------------------------------------------------------
  // SUB-COMPONENTS (INLINED FOR SINGLE FILE)
  // ---------------------------------------------------------------------------

  const renderSidebar = () => (
    <div style={styles.sidebar}>
      <div style={{ marginBottom: '40px', color: THEME.colors.primary }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
      </div>
      <div style={styles.sidebarIcon(view === 'DASHBOARD')} onClick={() => setView('DASHBOARD')}>{ICONS.dashboard}</div>
      <div style={styles.sidebarIcon(view === 'ASSETS')} onClick={() => setView('ASSETS')}>{ICONS.assets}</div>
      <div style={styles.sidebarIcon(view === 'INTELLIGENCE')} onClick={() => setView('INTELLIGENCE')}>{ICONS.intelligence}</div>
      <div style={styles.sidebarIcon(view === 'SECURITY')} onClick={() => setView('SECURITY')}>{ICONS.security}</div>
      <div style={{ flex: 1 }} />
      <div style={styles.sidebarIcon(view === 'PROFILE')} onClick={() => setView('PROFILE')}>{ICONS.profile}</div>
    </div>
  );

  const renderHeader = () => (
    <header style={styles.header}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          <span style={{ color: THEME.colors.primary }}>Prosperity</span> OS <span style={{ fontSize: '0.8rem', color: '#666' }}>v12.4.0</span>
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>SYSTEM STATUS</div>
          <div style={{ color: THEME.colors.success, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.colors.success, boxShadow: '0 0 10px #00F090' }}></span>
            OPERATIONAL
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>LOCAL TIME</div>
          <div style={{ fontFamily: THEME.fonts.mono, fontSize: '1.1rem' }}>{currentTime}</div>
        </div>
        <div style={{ position: 'relative' }}>
          {ICONS.bell}
          {notifications.some(n => !n.read) && (
            <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: THEME.colors.danger, borderRadius: '50%' }}></span>
          )}
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #333, #666)', border: `2px solid ${THEME.colors.primary}` }}></div>
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '30px' }}>Executive Overview</h2>
      
      <div style={styles.kpiGrid}>
        {kpis.map(kpi => (
          <div key={kpi.id} style={styles.kpiCard}>
            <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{kpi.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
              {kpi.unit === 'USD' ? formatCurrency(kpi.value) : kpi.value.toLocaleString()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: kpi.trend >= 0 ? THEME.colors.success : THEME.colors.danger, fontSize: '0.9rem' }}>
                {kpi.trend >= 0 ? 'â–²' : 'â–¼'} {Math.abs(kpi.trend).toFixed(1)}%
              </span>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>AI: {kpi.prediction}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div style={{ ...styles.kpiCard, height: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Global Asset Distribution</h3>
            <button style={{ background: 'none', border: `1px solid ${THEME.colors.border}`, color: '#888', padding: '5px 15px', borderRadius: '4px' }}>Full Report</button>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px' }}>
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
              <div key={i} style={{ width: '6%', height: `${h}%`, backgroundColor: i === 11 ? THEME.colors.primary : '#222', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                {i === 11 && <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', color: THEME.colors.primary, fontWeight: 'bold' }}>+12%</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.kpiCard, height: '400px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Biometric Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'center', height: '80%' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#888' }}>Heart Rate</span>
                <span style={{ color: '#fff' }}>{userProfile.biometrics.heartRate} BPM</span>
              </div>
              <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                <div style={{ width: `${(userProfile.biometrics.heartRate / 120) * 100}%`, height: '100%', background: THEME.colors.success, borderRadius: '2px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#888' }}>Stress Level</span>
                <span style={{ color: '#fff' }}>{userProfile.biometrics.stressLevel}%</span>
              </div>
              <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                <div style={{ width: `${userProfile.biometrics.stressLevel}%`, height: '100%', background: THEME.colors.accent, borderRadius: '2px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#888' }}>Cognitive Focus</span>
                <span style={{ color: '#fff' }}>{userProfile.biometrics.focusIndex}%</span>
              </div>
              <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                <div style={{ width: `${userProfile.biometrics.focusIndex}%`, height: '100%', background: THEME.colors.ai, borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 300, margin: 0 }}>Asset Portfolio</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['JETS', 'YACHTS', 'REAL_ESTATE', 'SECURITY', 'SPACE'] as AssetCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? THEME.colors.primary : 'transparent',
                color: activeCategory === cat ? '#000' : '#888',
                border: `1px solid ${activeCategory === cat ? THEME.colors.primary : '#333'}`,
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.assetGrid}>
        {GLOBAL_ASSETS.filter(a => a.category === activeCategory).map(asset => (
          <div 
            key={asset.id} 
            style={styles.assetCard}
            onClick={() => setSelectedAsset(asset)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = styles.shadows.card; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ height: '200px', background: asset.imageGradient, position: 'relative', padding: '20px' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', backdropFilter: 'blur(5px)', fontSize: '0.8rem' }}>
                {asset.availability}
              </div>
              <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{asset.title}</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem', color: '#888' }}>
                <span>ID: {asset.id}</span>
                <span style={{ color: THEME.colors.primary }}>{asset.value}</span>
              </div>
              <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>{asset.description}</p>
              <div style={{ borderTop: '1px solid #222', paddingTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.entries(asset.specs).slice(0, 3).map(([key, val]) => (
                  <span key={key} style={styles.tag}>{key}: {val}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div style={styles.aiPanel}>
      <div style={{ padding: '20px', borderBottom: `1px solid ${THEME.colors.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ color: THEME.colors.ai }}>{ICONS.ai}</div>
        <div>
          <div style={{ fontWeight: 'bold', color: '#fff' }}>Concierge AI Core</div>
          <div style={{ fontSize: '0.7rem', color: aiStatus === 'IDLE' ? '#666' : THEME.colors.ai }}>
            {aiStatus === 'IDLE' ? 'STANDBY' : aiStatus + '...'}
          </div>
        </div>
      </div>
      
      <div style={styles.chatWindow}>
        {messages.map(msg => (
          <div key={msg.id} style={styles.messageBubble(msg.sender)}>
            {msg.content}
            <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '5px', textAlign: 'right' }}>
              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        ))}
        {aiStatus !== 'IDLE' && (
          <div style={{ alignSelf: 'flex-start', color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>
            AI is typing...
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.input}
          placeholder="Command the system..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          style={{ background: THEME.colors.primary, border: 'none', borderRadius: '6px', width: '40px', cursor: 'pointer', color: '#000' }}
        >
          {ICONS.send}
        </button>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.container}>
      {renderSidebar()}
      
      <div style={styles.main}>
        {renderHeader()}
        
        <div style={styles.contentArea}>
          {view === 'DASHBOARD' && renderDashboard()}
          {view === 'ASSETS' && renderAssets()}
          {view === 'INTELLIGENCE' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444', flexDirection: 'column' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>ðŸ”’</div>
              <h2>Classified Intelligence</h2>
              <p>Biometric authentication required for deep state access.</p>
            </div>
          )}
          {view === 'PROFILE' && (
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#333', border: `2px solid ${THEME.colors.primary}` }}></div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{userProfile.name}</h1>
                  <div style={{ color: THEME.colors.primary, fontSize: '1.2rem', letterSpacing: '2px' }}>{userProfile.title}</div>
                  <div style={{ marginTop: '10px', display: 'inline-block', padding: '5px 10px', background: 'rgba(255,0,0,0.2)', color: '#ff4444', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid rgba(255,0,0,0.3)' }}>
                    CLEARANCE: {userProfile.clearanceLevel}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div style={styles.kpiCard}>
                  <div style={{ color: '#888' }}>Net Worth</div>
                  <div style={{ fontSize: '1.8rem', color: '#fff' }}>{userProfile.netWorth}</div>
                </div>
                <div style={styles.kpiCard}>
                  <div style={{ color: '#888' }}>Reputation Score</div>
                  <div style={{ fontSize: '1.8rem', color: THEME.colors.success }}>{userProfile.reputationScore} / 100</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {renderAI()}

      {/* ASSET DETAIL MODAL */}
      {selectedAsset && (
        <div style={styles.modal} onClick={() => setSelectedAsset(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <div style={{ color: THEME.colors.primary, fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '10px' }}>ASSET DETAILS</div>
                <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{selectedAsset.title}</h2>
              </div>
              <button onClick={() => setSelectedAsset(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>Ã—</button>
            </div>

            <div style={{ height: '300px', background: selectedAsset.imageGradient, borderRadius: '8px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem', letterSpacing: '5px', color: 'rgba(255,255,255,0.3)' }}>IMMERSIVE PREVIEW</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
              <div>
                <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  {Object.entries(selectedAsset.specs).map(([k, v]) => (
                    <div key={k}>
                      <div style={{ color: '#888', fontSize: '0.8rem' }}>{k}</div>
                      <div style={{ color: '#fff', fontSize: '1.1rem' }}>{v}</div>
                    </div>
                  ))}
                </div>
                
                <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '40px' }}>AI Analysis</h3>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: `1px solid ${THEME.colors.ai}`, padding: '20px', borderRadius: '8px', marginTop: '20px', color: '#ddd', lineHeight: '1.6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: THEME.colors.ai, fontWeight: 'bold' }}>
                    {ICONS.ai} CORE INSIGHT
                  </div>
                  {selectedAsset.aiAnalysis}
                </div>
              </div>

              <div>
                <div style={{ background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Current Valuation</div>
                    <div style={{ fontSize: '2rem', color: '#fff' }}>{selectedAsset.value}</div>
                  </div>
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Projected ROI</div>
                    <div style={{ fontSize: '1.2rem', color: selectedAsset.roi.includes('+') ? THEME.colors.success : THEME.colors.danger }}>{selectedAsset.roi}</div>
                  </div>
                  <button style={{ width: '100%', padding: '15px', background: THEME.colors.primary, color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Initiate Acquisition
                  </button>
                  <button style={{ width: '100%', padding: '15px', background: 'transparent', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                    Schedule Inspection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciergeService;