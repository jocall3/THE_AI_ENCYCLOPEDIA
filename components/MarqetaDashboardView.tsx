import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProgram, MarqetaCardholder } from '../types';

// Mock data generation for demonstration
const generateMockMarqetaData = (): { programs: MarqetaCardProgram[]; cardholders: MarqetaCardholder[] } => {
    const programs: MarqetaCardProgram[] = [
        { token: 'prog_1', name: 'Quantum Corporate T&E', active: true, fulfillment: { shipping: { method: 'STANDARD_MAIL', care_of_line: 'Demo Bank Inc.' } }, created_time: new Date().toISOString() },
        { token: 'prog_2', name: 'Virtual Developer Cards', active: true, fulfillment: { shipping: { method: 'STANDARD_MAIL', care_of_line: 'Demo Bank Inc.' } }, created_time: new Date().toISOString() },
    ];
    const cardholders: MarqetaCardholder[] = [
        { token: 'user_1', first_name: 'Alex', last_name: 'Ray', email: 'alex@example.com', active: true, status: 'ACTIVE', created_time: new Date().toISOString() },
        { token: 'user_2', first_name: 'Sam', last_name: 'Jones', email: 'sam@example.com', active: true, status: 'ACTIVE', created_time: new Date().toISOString() },
    ];
    return { programs, cardholders };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("MarqetaDashboardView must be used within a DataProvider");
    }
    const { marqetaApiKey, setActiveView } = context;

    const mockData = generateMockMarqetaData();

    if (!marqetaApiKey) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Marqeta Dashboard</h2>
                <Card title="Configuration Required">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">
                            Please configure your Marqeta API Key to view the Marqeta dashboard.
                        </p>
                        <button
                            onClick={() => setActiveView(View.APIIntegration)}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                        >
                            Go to API Settings
                        </button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Marqeta Card Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Cards Issued">
                    <p className="text-5xl font-bold text-center text-white my-4">15,780</p>
                </Card>
                <Card title="Active Cardholders">
                    <p className="text-5xl font-bold text-center text-white my-4">12,340</p>
                </Card>
                <Card title="Transaction Volume (24h)">
                    <p className="text-5xl font-bold text-center text-white my-4">$2.5M</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Active Card Programs">
                    <div className="space-y-3">
                        {mockData.programs.map(program => (
                            <div key={program.token} className="p-3 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <p className="font-semibold text-white">{program.name}</p>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Recent Cardholders">
                     <div className="space-y-3">
                        {mockData.cardholders.map(holder => (
                            <div key={holder.token} className="p-3 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{holder.first_name} {holder.last_name}</p>
                                    <p className="text-xs text-gray-400">{holder.email}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${holder.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {holder.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MarqetaDashboardView;
