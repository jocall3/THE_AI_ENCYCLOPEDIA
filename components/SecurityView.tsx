
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import PlaidLinkButton from './PlaidLinkButton';
import { 
    LoginActivity, Device, DataSharingPolicy, TransactionRule, ThreatAlert, 
    AuditLogEntry, APIKey, TrustedContact, SecurityAwarenessModule, SecurityScoreMetric 
} from '../types';

// --- Helper Components ---

export const SecuritySettingToggle: React.FC<{
    title: string;
    description: string;
    defaultChecked: boolean;
    onToggle?: (checked: boolean) => void;
    disabled?: boolean;
    id: string;
}> = ({ title, description, defaultChecked, onToggle, disabled, id }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        onToggle && onToggle(e.target.checked);
    };
    return (
        <li className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-grow">
                <label htmlFor={`toggle-${id}`} className="font-semibold text-white cursor-pointer">{title}</label>
                <p className="text-sm text-gray-400 max-w-md mt-1">{description}</p>
            </div>
            <input
                type="checkbox"
                id={`toggle-${id}`}
                className="toggle toggle-cyan mt-2 sm:mt-0"
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                aria-label={`Toggle for ${title}`}
            />
        </li>
    );
};

export const NotificationToast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'critical';
    onClose: () => void;
    isVisible: boolean;
}> = ({ message, type, onClose, isVisible }) => {
    const typeClasses = {
        success: 'bg-green-600 border-green-700',
        error: 'bg-red-600 border-red-700',
        info: 'bg-blue-600 border-blue-700',
        warning: 'bg-yellow-600 border-yellow-700',
        critical: 'bg-purple-700 border-purple-800'
    };
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isVisible) {
            timer = setTimeout(() => { onClose(); }, type === 'critical' ? 10000 : 5000);
        }
        return () => clearTimeout(timer);
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-xl text-white flex items-center space-x-3 transition-all duration-300 ease-out transform ${typeClasses[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{zIndex: 1000}}>
            <span className="text-sm font-medium flex-grow">{message}</span>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-black/20 focus:outline-none flex-shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

// --- Main Component ---

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context || {};

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | 'critical'; isVisible: boolean } | null>(null);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    
    // Mock Data Loading
    useEffect(() => {
        const now = new Date();
        const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        setLoginActivity([
            { id: '1', device: 'Chrome on macOS', browser: 'Chrome 120', os: 'macOS 14.2', location: 'New York, USA', ip: '192.168.1.1', timestamp: pastDate(0.01), isCurrent: true, userAgent: 'Mozilla/5.0...' },
            { id: '2', device: 'DemoBank App on iOS', browser: 'App', os: 'iOS 17.1', location: 'New York, USA', ip: '172.16.0.1', timestamp: pastDate(3), isCurrent: false, userAgent: 'Mozilla/5.0...' },
        ]);

        setDevices([
            { id: 'dvc_1', name: 'My MacBook Pro', type: 'Desktop', model: 'MacBook Pro M2', lastActivity: pastDate(0.01), location: 'New York, USA', ip: '192.168.1.1', isCurrent: true, permissions: ['read_accounts'], status: 'active', firstSeen: pastDate(300), userAgent: 'Mozilla/5.0...', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'full' },
            { id: 'dvc_2', name: 'iPhone 15 Pro', type: 'Mobile', model: 'iPhone 15 Pro', lastActivity: pastDate(0.5), location: 'New York, USA', ip: '172.16.0.1', isCurrent: false, permissions: ['read_accounts', 'initiate_transfers'], status: 'active', firstSeen: pastDate(60), userAgent: 'Mozilla/5.0...', pushNotificationsEnabled: true, biometricAuthEnabled: true, encryptionStatus: 'full' },
        ]);
    }, []);

    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'critical') => {
        setNotification({ message, type, isVisible: true });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(prev => prev ? { ...prev, isVisible: false } : null);
    }, []);

    const handleUnlink = (id: string) => {
        if (unlinkAccount) {
            unlinkAccount(id);
            showNotification('Account successfully unlinked.', 'info');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Security Fortress</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Linked Accounts Section */}
                <Card title="Linked Accounts & Data Sources" className="lg:col-span-2">
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">Manage external financial connections securely.</p>
                        {linkedAccounts && linkedAccounts.length > 0 ? (
                            <div className="space-y-2">
                                {linkedAccounts.map(account => (
                                    <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 mr-3">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{account.name}</p>
                                                <p className="text-xs text-gray-400">Mask: {account.mask}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleUnlink(account.id)}
                                            className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-sm transition-colors"
                                        >
                                            Unlink
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No external accounts linked.</p>
                        )}
                        <div className="pt-4">
                           {handlePlaidSuccess && <PlaidLinkButton onSuccess={handlePlaidSuccess} className="w-full sm:w-auto" />}
                        </div>
                    </div>
                </Card>

                {/* Security Settings */}
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700">
                        <SecuritySettingToggle 
                            id="2fa"
                            title="Two-Factor Authentication" 
                            description="Require a code from your authenticator app when logging in." 
                            defaultChecked={true} 
                        />
                        <SecuritySettingToggle 
                            id="biometric"
                            title="Biometric Login" 
                            description="Use FaceID or TouchID for faster, secure access." 
                            defaultChecked={true} 
                        />
                        <li className="py-4 flex justify-between items-center">
                             <div>
                                <span className="font-semibold text-white">Password</span>
                                <p className="text-sm text-gray-400">Last changed 3 months ago</p>
                             </div>
                             <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">Change</button>
                        </li>
                    </ul>
                </Card>

                 {/* Recent Activity */}
                 <Card title="Recent Login Activity">
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {loginActivity.map(activity => (
                            <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg">
                                <div>
                                    <p className="font-medium text-white flex items-center gap-2">
                                        {activity.device}
                                        {activity.isCurrent && <span className="px-1.5 py-0.5 bg-green-900/50 text-green-400 text-xs rounded">Current</span>}
                                    </p>
                                    <p className="text-xs text-gray-400">{activity.location} • {activity.ip}</p>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                
                 {/* Active Devices */}
                 <Card title="Active Devices" className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {devices.map(device => (
                            <div key={device.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-300">
                                        {device.type === 'Mobile' ? (
                                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                        ) : (
                                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{device.name}</p>
                                        <p className="text-xs text-gray-400">Last active: {new Date(device.lastActivity).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${device.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {device.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {notification && (
                <NotificationToast 
                    message={notification.message} 
                    type={notification.type} 
                    isVisible={notification.isVisible} 
                    onClose={closeNotification} 
                />
            )}
        </div>
    );
};

export default SecurityView;
