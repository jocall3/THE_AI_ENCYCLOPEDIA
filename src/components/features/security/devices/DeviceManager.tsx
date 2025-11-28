import React, { useState, useEffect } from 'react';

// Define the shape of a device session
interface DeviceSession {
  id: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string; // ISO string or formatted date
  loginTime: string;  // ISO string or formatted date
  isCurrent: boolean; // Indicates if this is the current session
}

const DeviceManager: React.FC = () => {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching device sessions from an API
    const fetchDeviceSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, this would be an API call to your backend
        // For now, we use mock data to demonstrate the UI and functionality
        const mockSessions: DeviceSession[] = [
          {
            id: 'session-1',
            deviceType: 'Laptop',
            os: 'Windows 11',
            browser: 'Chrome 120',
            ipAddress: '203.0.113.45',
            location: 'New York, USA',
            lastActive: '2023-10-27T10:30:00Z',
            loginTime: '2023-10-27T09:00:00Z',
            isCurrent: true, // This is the user's current active session
          },
          {
            id: 'session-2',
            deviceType: 'Mobile Phone',
            os: 'iOS 17',
            browser: 'Safari',
            ipAddress: '198.51.100.12',
            location: 'London, UK',
            lastActive: '2023-10-27T08:15:00Z',
            loginTime: '2023-10-26T22:00:00Z',
            isCurrent: false,
          },
          {
            id: 'session-3',
            deviceType: 'Tablet',
            os: 'Android 13',
            browser: 'Firefox',
            ipAddress: '192.0.2.10',
            location: 'Berlin, Germany',
            lastActive: '2023-10-26T17:45:00Z',
            loginTime: '2023-10-26T10:00:00Z',
            isCurrent: false,
          },
          {
            id: 'session-4',
            deviceType: 'Desktop',
            os: 'macOS Sonoma',
            browser: 'Brave',
            ipAddress: '192.0.2.20',
            location: 'Paris, France',
            lastActive: '2023-10-25T12:00:00Z',
            loginTime: '2023-10-25T09:00:00Z',
            isCurrent: false,
          },
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700)); 
        setSessions(mockSessions);
      } catch (err) {
        setError('Failed to load device sessions. Please try again.');
        console.error("Error fetching device sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceSessions();
  }, []); // Empty dependency array means this runs once on mount

  // Handles revoking access for a specific session
  const handleRevokeAccess = async (sessionId: string) => {
    // Confirm with the user before revoking access
    if (!window.confirm('Are you sure you want to revoke access for this device? This will log out the device immediately.')) {
      return;
    }

    try {
      // Simulate an API call to revoke access on the backend
      console.log(`Attempting to revoke access for session ID: ${sessionId}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
      
      // If the API call is successful, update the UI by removing the session
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
      alert('Access successfully revoked! The device has been logged out.');
    } catch (err) {
      setError('Failed to revoke access. Please try again.');
      console.error("Error revoking access:", err);
    }
  };

  // Helper function to format ISO date strings into a more readable format
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // Using toLocaleString for user's local date and time format
      return date.toLocaleString(); 
    } catch (e) {
      return isoString; // Return original if invalid date
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>Loading active device sessions...</p>
        {/* Simple spinner animation */}
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite',
          margin: '10px auto'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center', fontFamily: 'Arial, sans-serif', border: '1px solid #ffcccc', borderRadius: '8px', backgroundColor: '#fff0f0', maxWidth: '600px', margin: '20px auto' }}>
        <p><strong>Error:</strong> {error}</p>
        <button 
          onClick={() => window.location.reload()} // Simple retry by reloading the page
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            marginTop: '15px' 
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '20px auto', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <p>No active device sessions found.</p>
        <p style={{ color: '#666' }}>Your account is currently not logged in on any other devices.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '960px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: '#fdfdfd' }}>
      <h2 style={{ marginBottom: '30px', color: '#333', textAlign: 'center', fontSize: '2em' }}>
        <span role="img" aria-label="devices">📱💻</span> Active Device Sessions
      </h2>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>
        View all devices currently logged into your account. You can remotely revoke access for any session below.
      </p>

      <div style={{ 
        display: 'grid', 
        gap: '25px', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' 
      }}>
        {sessions.map((session) => (
          <div 
            key={session.id} 
            style={{ 
              border: session.isCurrent ? '2px solid #007bff' : '1px solid #eee', 
              borderRadius: '12px', 
              padding: '25px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {session.isCurrent && (
              <span style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '8px 15px', 
                borderBottomLeftRadius: '12px',
                fontSize: '0.85em',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>
                Current Session
              </span>
            )}
            <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333', fontSize: '1.4em' }}>
              {session.deviceType} <span style={{ fontSize: '0.8em', color: '#666', fontWeight: 'normal' }}>({session.os})</span>
            </h3>
            <p style={{ margin: '8px 0', color: '#555' }}>
              <strong>Browser:</strong> {session.browser}
            </p>
            <p style={{ margin: '8px 0', color: '#555' }}>
              <strong>Location:</strong> {session.location} <span style={{ color: '#888' }}>({session.ipAddress})</span>
            </p>
            <p style={{ margin: '8px 0', color: '#555' }}>
              <strong>Logged In:</strong> {formatDateTime(session.loginTime)}
            </p>
            <p style={{ margin: '8px 0', color: '#555' }}>
              <strong>Last Active:</strong> {formatDateTime(session.lastActive)}
            </p>
            <button 
              onClick={() => handleRevokeAccess(session.id)} 
              disabled={session.isCurrent}
              style={{ 
                marginTop: '25px', 
                padding: '12px 18px', 
                backgroundColor: session.isCurrent ? '#cccccc' : '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: session.isCurrent ? 'not-allowed' : 'pointer', 
                fontSize: '1em',
                fontWeight: 'bold',
                width: '100%',
                transition: 'background-color 0.2s ease, opacity 0.2s ease',
                opacity: session.isCurrent ? 0.7 : 1
              }}
              title={session.isCurrent ? "You cannot revoke access for your current session." : "Revoke access for this device and log it out."}
            >
              {session.isCurrent ? 'Current Session (Cannot Revoke)' : 'Revoke Access'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceManager;