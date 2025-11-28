import React, { useState, useEffect } from 'react';

// Types and Interfaces
type Category = 'JETS' | 'YACHTS' | 'EVENTS' | 'dining';

interface Asset {
  id: string;
  title: string;
  description: string;
  specs: string[];
  availability: string;
  image: string; // Using colored placeholders for self-containment
}

interface BookingState {
  isBooking: boolean;
  asset: Asset | null;
  confirmed: boolean;
}

// Mock Data (Self-contained assets)
const ASSETS: Record<Category, Asset[]> = {
  JETS: [
    {
      id: 'j1',
      title: 'Gulfstream G700 "Prosperity One"',
      description: 'The flagship of the Balcony fleet. Ultra-long range with four living areas.',
      specs: ['Range: 7,500 nm', 'Speed: Mach 0.925', 'Capacity: 19 Pax'],
      availability: 'Immediate',
      image: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
    },
    {
      id: 'j2',
      title: 'Bombardier Global 8000',
      description: 'The fastest and longest-range business jet ever conceived.',
      specs: ['Range: 8,000 nm', 'Speed: Mach 0.94', 'Capacity: 17 Pax'],
      availability: 'In Hangar (London)',
      image: 'linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)'
    },
    {
      id: 'j3',
      title: 'Embraer Lineage 1000E',
      description: 'Sky yacht offering five luxurious cabin zones.',
      specs: ['Range: 4,600 nm', 'Master Suite', 'Capacity: 19 Pax'],
      availability: 'Returning (2h)',
      image: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'
    }
  ],
  YACHTS: [
    {
      id: 'y1',
      title: 'Project Centurion 110m',
      description: 'A floating palace equipped with a helipad and submarine dock.',
      specs: ['Length: 110m', 'Crew: 45', 'Guest Cabins: 12'],
      availability: 'Docked (Monaco)',
      image: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
    },
    {
      id: 'y2',
      title: 'Riva 110 Dolcevita',
      description: 'Flybridge yacht combining sportiness with ultimate elegance.',
      specs: ['Length: 34m', 'Speed: 26 kn', 'Guests: 10'],
      availability: 'Immediate (Miami)',
      image: 'linear-gradient(135deg, #000046 0%, #1CB5E0 100%)'
    },
    {
      id: 'y3',
      title: 'Sunreef 80 Power Eco',
      description: 'Fully electric luxury catamaran for silent cruising.',
      specs: ['Solar Skin', 'Zero Emission', 'Guests: 12'],
      availability: 'Available',
      image: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)'
    }
  ],
  EVENTS: [
    {
      id: 'e1',
      title: 'Monaco Grand Prix - Paddock Club',
      description: 'VIP access to the most prestigious race in the world.',
      specs: ['Full Hospitality', 'Pit Lane Walk', 'Driver Meet & Greet'],
      availability: 'May 23-26',
      image: 'linear-gradient(135deg, #8E0E00 0%, #1F1C18 100%)'
    },
    {
      id: 'e2',
      title: 'Met Gala Afterparty Access',
      description: 'Exclusive entry to the private post-event celebration.',
      specs: ['Red Carpet', 'Private Table', 'Concierge Escort'],
      availability: 'First Monday in May',
      image: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)'
    },
    {
      id: 'e3',
      title: 'Art Basel Private View',
      description: 'Early access to the collectors preview before public opening.',
      specs: ['Curator Tour', 'Private Lounge', 'Acquisition Assistance'],
      availability: 'December',
      image: 'linear-gradient(135deg, #DA4453 0%, #89216B 100%)'
    }
  ],
  dining: [] // Placeholder for extensibility
};

const ConciergeService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('JETS');
  const [booking, setBooking] = useState<BookingState>({
    isBooking: false,
    asset: null,
    confirmed: false
  });

  // Styles object for self-contained theming
  const styles = {
    container: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      backgroundColor: '#050505',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '40px',
      boxSizing: 'border-box' as const,
      overflow: 'hidden',
      position: 'relative' as const,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '60px',
      borderBottom: '1px solid #333',
      paddingBottom: '20px',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 300,
      letterSpacing: '4px',
      color: '#d4af37', // Gold
      textTransform: 'uppercase' as const,
      margin: 0,
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#888',
      letterSpacing: '1px',
    },
    nav: {
      display: 'flex',
      gap: '40px',
      marginBottom: '40px',
    },
    navItem: (isActive: boolean) => ({
      background: 'none',
      border: 'none',
      color: isActive ? '#d4af37' : '#666',
      fontSize: '1.2rem',
      cursor: 'pointer',
      padding: '10px 0',
      borderBottom: isActive ? '2px solid #d4af37' : '2px solid transparent',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '30px',
    },
    card: {
      backgroundColor: '#111',
      border: '1px solid #222',
      borderRadius: '4px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      position: 'relative' as const,
    },
    cardImage: (gradient: string) => ({
      height: '200px',
      width: '100%',
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    cardContent: {
      padding: '25px',
    },
    cardTitle: {
      fontSize: '1.4rem',
      margin: '0 0 10px 0',
      color: '#fff',
      fontWeight: 400,
    },
    cardMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#d4af37',
      fontSize: '0.8rem',
      textTransform: 'uppercase' as const,
      marginBottom: '15px',
      letterSpacing: '1px',
    },
    cardDesc: {
      color: '#aaa',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    specsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '10px',
    },
    specTag: {
      background: 'rgba(212, 175, 55, 0.1)',
      color: '#d4af37',
      padding: '5px 10px',
      borderRadius: '2px',
      fontSize: '0.75rem',
    },
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
    },
    modal: {
      width: '600px',
      backgroundColor: '#0a0a0a',
      border: '1px solid #333',
      padding: '40px',
      position: 'relative' as const,
      boxShadow: '0 0 50px rgba(212, 175, 55, 0.1)',
    },
    modalTitle: {
      fontSize: '2rem',
      color: '#d4af37',
      marginBottom: '10px',
      fontFamily: 'serif',
    },
    actionButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#d4af37',
      color: '#000',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
      cursor: 'pointer',
      marginTop: '30px',
      transition: 'background 0.3s',
    },
    closeButton: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      background: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '8px 16px',
      border: '1px solid #d4af37',
      color: '#d4af37',
      fontSize: '0.8rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
      marginBottom: '20px',
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    setBooking({ isBooking: true, asset, confirmed: false });
  };

  const confirmBooking = () => {
    // In a real scenario, this would interface with the Balcony ledger
    // Since "nothing needs to be paid for", this is an allocation request
    setBooking(prev => ({ ...prev, confirmed: true }));
  };

  const closeBooking = () => {
    setBooking({ isBooking: false, asset: null, confirmed: false });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>The Balcony of Prosperity</h1>
          <span style={styles.subtitle}>Concierge & Lifestyle Management</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#d4af37', fontSize: '1.2rem' }}>∞ ACCESS</div>
          <div style={{ color: '#555', fontSize: '0.8rem' }}>GLOBAL MEMBER</div>
        </div>
      </header>

      <nav style={styles.nav}>
        {(['JETS', 'YACHTS', 'EVENTS'] as Category[]).map((tab) => (
          <button
            key={tab}
            style={styles.navItem(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main style={styles.grid}>
        {ASSETS[activeTab].map((asset) => (
          <div 
            key={asset.id} 
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => handleAssetSelect(asset)}
          >
            <div style={styles.cardImage(asset.image)}>
              <span style={{ 
                color: 'rgba(255,255,255,0.2)', 
                fontSize: '3rem', 
                textTransform: 'uppercase', 
                fontWeight: 'bold', 
                letterSpacing: '10px' 
              }}>
                {activeTab.slice(0, -1)}
              </span>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.cardMeta}>
                <span>{asset.availability}</span>
                <span>ID: {asset.id.toUpperCase()}</span>
              </div>
              <h3 style={styles.cardTitle}>{asset.title}</h3>
              <p style={styles.cardDesc}>{asset.description}</p>
              <ul style={styles.specsList}>
                {asset.specs.map((spec, i) => (
                  <li key={i} style={styles.specTag}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </main>

      {booking.isBooking && booking.asset && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.closeButton} onClick={closeBooking}>×</button>
            
            {!booking.confirmed ? (
              <>
                <span style={styles.statusBadge}>Verification Complete</span>
                <h2 style={styles.modalTitle}>Confirm Allocation</h2>
                <p style={{ color: '#ccc', marginBottom: '20px' }}>
                  You are requesting immediate access to the <strong>{booking.asset.title}</strong>. 
                  As a holder of the Prosperity Standard, no payment is required.
                </p>
                
                <div style={{ background: '#111', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Asset</span>
                    <span>{booking.asset.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Allocation Type</span>
                    <span>All-Inclusive / Priority</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Cost</span>
                    <span style={{ color: '#d4af37' }}>0.00 (Standard Included)</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                  By confirming, concierge will contact your secure channel within 3 minutes to finalize itinerary logistics.
                </p>

                <button 
                  style={styles.actionButton}
                  onClick={confirmBooking}
                >
                  Authorize Access
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ 
                  fontSize: '4rem', 
                  color: '#d4af37', 
                  marginBottom: '20px',
                  animation: 'fadeIn 1s'
                }}>
                  ✓
                </div>
                <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Access Granted</h2>
                <p style={{ color: '#888' }}>
                  The <strong>{booking.asset.title}</strong> has been secured.
                  <br />
                  Your Concierge Manager is now preparing the itinerary.
                </p>
                <button 
                  style={{...styles.actionButton, background: '#333', color: '#fff', marginTop: '40px'}}
                  onClick={closeBooking}
                >
                  Return to Balcony
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciergeService;