import React, { useState, useMemo } from 'react';
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    Settings,
    Lock,
    Zap,
    Shield,
    Key,
    Cloud,
} from 'lucide-react';

// --- Placeholder Components (Assuming existence in the project) ---

// A generic card component for metrics
const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
            <div className="text-indigo-600">{icon}</div>
        </div>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend} vs last month</p>
    </div>
);

// A generic component for API authentication slots
interface APISlotProps {
    apiName: string;
    status: 'Connected' | 'Disconnected' | 'Pending';
    onConnect: () => void;
}

const APISlot: React.FC<APISlotProps> = ({ apiName, status, onConnect }) => {
    const statusColor = status === 'Connected' ? 'bg-green-100 text-green-800' : status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    const buttonText = status === 'Connected' ? 'Reconfigure' : 'Connect';

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{apiName}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 w-fit ${statusColor}`}>
                    {status}
                </span>
            </div>
            <button
                onClick={onConnect}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
            >
                {buttonText}
            </button>
        </div>
    );
};

// --- Main View Component ---

const ECommerceView: React.FC = () => {
    const [apiStatus, setApiStatus] = useState({
        shopify: 'Connected' as 'Connected' | 'Disconnected' | 'Pending',
        bigcommerce: 'Pending' as 'Connected' | 'Disconnected' | 'Pending',
        woocommerce: 'Connected' as 'Connected' | 'Disconnected' | 'Pending',
        stripe: 'Connected' as 'Connected' | 'Disconnected' | 'Pending',
        mailchimp: 'Disconnected' as 'Connected' | 'Disconnected' | 'Pending',
        cloudinary: 'Connected' as 'Connected' | 'Disconnected' | 'Pending',
        easypost: 'Connected' as 'Connected' | 'Disconnected' | 'Pending',
        algolia: 'Connected' as 'Connected' | 'Disconnected' | 'Pending',
    });

    const [securityConfig, setSecurityConfig] = useState({
        p2peEnabled: true,
        heEnabled: true,
        pqcKyberDilithium: true,
    });

    const handleConnect = (api: keyof typeof apiStatus) => {
        // Simulate connection attempt/toggle
        setApiStatus(prev => ({
            ...prev,
            [api]: prev[api] === 'Connected' ? 'Disconnected' : 'Connected',
        }));
    };

    const metrics = useMemo(() => [
        { title: 'Total Revenue (HE Secured)', value: '$1,245,789', icon: <DollarSign className="w-6 h-6" />, trend: '+12.5%' },
        { title: 'Orders Fulfilled (P2PE)', value: '8,901', icon: <ShoppingCart className="w-6 h-6" />, trend: '+8.1%' },
        { title: 'Active Products', value: '4,120', icon: <Package className="w-6 h-6" />, trend: '-1.2%' },
        { title: 'New Subscribers (Mailchimp)', value: '567', icon: <Users className="w-6 h-6" />, trend: '+25.0%' },
    ], []);

    const SecurityToggle: React.FC<{ label: string; description: string; enabled: boolean; onToggle: () => void }> = ({ label, description, enabled, onToggle }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
            <div>
                <p className="font-medium text-white flex items-center">
                    {enabled ? <Shield className="w-4 h-4 mr-2 text-green-400" /> : <Lock className="w-4 h-4 mr-2 text-red-400" />}
                    {label}
                </p>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition duration-150 ${enabled ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                {enabled ? 'Active' : 'Inactive'}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Billion Dollar E-commerce Command Center</h1>
                <p className="text-gray-600 mt-2">Unified management and secure data processing across all major e-commerce platforms.</p>
            </header>

            {/* API Integration and Authentication Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                
                {/* E-commerce Platform Integrations */}
                <div className="bg-white p-6 rounded-xl shadow-2xl lg:col-span-1">
                    <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center"><ShoppingCart className="w-5 h-5 mr-2" /> E-commerce Platform APIs</h2>
                    <div className="space-y-2">
                        <APISlot apiName="Shopify API" status={apiStatus.shopify} onConnect={() => handleConnect('shopify')} />
                        <APISlot apiName="BigCommerce API" status={apiStatus.bigcommerce} onConnect={() => handleConnect('bigcommerce')} />
                        <APISlot apiName="WooCommerce API" status={apiStatus.woocommerce} onConnect={() => handleConnect('woocommerce')} />
                    </div>
                </div>

                {/* Financial, Shipping & Media Integrations */}
                <div className="bg-white p-6 rounded-xl shadow-2xl lg:col-span-1">
                    <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center"><Cloud className="w-5 h-5 mr-2" /> Core Service APIs</h2>
                    <div className="space-y-2">
                        <APISlot apiName="Stripe/Tripe API (Payments)" status={apiStatus.stripe} onConnect={() => handleConnect('stripe')} />
                        <APISlot apiName="EasyPost/Shippo API (Shipping)" status={apiStatus.easypost} onConnect={() => handleConnect('easypost')} />
                        <APISlot apiName="Cloudinary API (Assets)" status={apiStatus.cloudinary} onConnect={() => handleConnect('cloudinary')} />
                        <APISlot apiName="Algolia API (Search)" status={apiStatus.algolia} onConnect={() => handleConnect('algolia')} />
                    </div>
                </div>

                {/* Advanced Security Configuration Slot */}
                <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl lg:col-span-1">
                    <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center"><Key className="w-5 h-5 mr-2" /> PQC & Encryption Settings</h2>
                    <div className="space-y-1">
                        <SecurityToggle
                            label="Point-to-Point Encryption (P2PE)"
                            description="Ensures payment data is encrypted from capture to processor (Stripe/Tripe integration)."
                            enabled={securityConfig.p2peEnabled}
                            onToggle={() => setSecurityConfig(p => ({ ...p, p2peEnabled: !p.p2peEnabled }))}
                        />
                        <SecurityToggle
                            label="Homomorphic Encryption (HE) Analytics"
                            description="Allows secure computation on encrypted sales data without decryption."
                            enabled={securityConfig.heEnabled}
                            onToggle={() => setSecurityConfig(p => ({ ...p, heEnabled: !p.heEnabled }))}
                        />
                        <SecurityToggle
                            label="Kyber/Dilithium PQC Key Exchange"
                            description="Post-Quantum Cryptography enabled for API key exchange and digital signatures."
                            enabled={securityConfig.pqcKyberDilithium}
                            onToggle={() => setSecurityConfig(p => ({ ...p, pqcKyberDilithium: !p.pqcKyberDilithium }))}
                        />
                        <div className="pt-4 text-xs text-gray-400 border-t border-gray-700 mt-4">
                            <p className="font-bold">Security Status:</p>
                            <p>All sensitive financial data flows are secured using PQC and P2PE protocols.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>

            {/* Data Visualization and Operational Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-xl lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Encrypted Sales Trend (HE Processed)</h2>
                    <div className="h-80 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">Placeholder for Recharts/D3 Sales Visualization (Data processed via Homomorphic Encryption)</p>
                    </div>
                </div>

                {/* Top Products List */}
                <div className="bg-white p-6 rounded-xl shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products (Shopify/WooCommerce Aggregation)</h2>
                    <ul className="space-y-3">
                        {['Quantum Processor X', 'PQC Secure Wallet', 'API Integration Kit', 'Dilithium Key Fob'].map((product, i) => (
                            <li key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0">
                                <span className="text-gray-700">{product}</span>
                                <span className="font-medium text-indigo-600">{1500 - i * 100} units</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Inventory Status & Fulfillment */}
                <div className="bg-white p-6 rounded-xl shadow-xl lg:col-span-3">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory and Fulfillment Status</h2>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">98%</p>
                            <p className="text-sm text-gray-500">On-Time Shipping Rate (EasyPost/Shippo)</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">124</p>
                            <p className="text-sm text-gray-500">Low Stock Alerts</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">450 TB</p>
                            <p className="text-sm text-gray-500">Image Storage Used (Cloudinary)</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-3xl font-bold text-green-600">1,500</p>
                            <p className="text-sm text-gray-500">Pending Orders (BigCommerce/Shopify)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ECommerceView;