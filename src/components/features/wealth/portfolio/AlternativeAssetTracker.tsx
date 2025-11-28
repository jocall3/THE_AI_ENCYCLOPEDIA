
import React, { useState, useMemo, FC } from 'react';

// --- TYPE DEFINITIONS ---
type AssetCategory = 'Real Estate' | 'Collectibles' | 'Fine Art' | 'Private Equity' | 'Cryptocurrency' | 'Other';

interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  lastAppraisalDate: string;
  notes?: string;
}

// --- MOCK DATA ---
const initialAssets: Asset[] = [
  {
    id: 're1',
    name: 'Downtown Loft Apartment',
    category: 'Real Estate',
    purchaseDate: '2018-05-20',
    purchasePrice: 450000,
    currentValue: 620000,
    lastAppraisalDate: '2023-06-15',
    notes: 'Primary residence, good rental potential.'
  },
  {
    id: 'fa1',
    name: '"Sunset Over Water" by Local Artist',
    category: 'Fine Art',
    purchaseDate: '2020-11-01',
    purchasePrice: 5000,
    currentValue: 8500,
    lastAppraisalDate: '2024-01-10',
  },
  {
    id: 'co1',
    name: 'Vintage Rolex Submariner 1680',
    category: 'Collectibles',
    purchaseDate: '2019-03-12',
    purchasePrice: 12000,
    currentValue: 25000,
    lastAppraisalDate: '2023-11-20',
    notes: 'Excellent condition, full set.'
  },
  {
    id: 'pe1',
    name: 'StartupX Seed Investment',
    category: 'Private Equity',
    purchaseDate: '2021-02-15',
    purchasePrice: 50000,
    currentValue: 150000,
    lastAppraisalDate: '2024-03-31',
    notes: 'Series A funding round completed.'
  },
  {
    id: 'cr1',
    name: 'Bitcoin Holdings',
    category: 'Cryptocurrency',
    purchaseDate: '2017-08-01',
    purchasePrice: 15000,
    currentValue: 70000,
    lastAppraisalDate: new Date().toISOString().split('T')[0],
  },
];

// --- HELPER FUNCTIONS & COMPONENTS ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- ICONS (SVG) ---
const PlusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const EditIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const ChevronUpIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"/></svg>
);

const ChevronDownIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

// --- MAIN COMPONENT ---
const AlternativeAssetTracker: FC = () => {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Asset; direction: 'ascending' | 'descending' } | null>(null);

    const summaryData = useMemo(() => {
        const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
        const totalCost = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
        const totalGainLoss = totalValue - totalCost;
        const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
        
        const categoryDistribution = assets.reduce((acc, asset) => {
            acc[asset.category] = (acc[asset.category] || 0) + asset.currentValue;
            return acc;
        }, {} as Record<AssetCategory, number>);

        return { totalValue, totalGainLoss, totalGainLossPercentage, categoryDistribution };
    }, [assets]);

    const sortedAssets = useMemo(() => {
        let sortableItems = [...assets];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [assets, sortConfig]);

    const requestSort = (key: keyof Asset) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddNew = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    const handleEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleDelete = (assetId: string) => {
        if(window.confirm('Are you sure you want to delete this asset?')) {
            setAssets(assets.filter(a => a.id !== assetId));
        }
    };
    
    const handleSaveAsset = (asset: Asset) => {
        if (editingAsset) {
            setAssets(assets.map(a => a.id === asset.id ? asset : a));
        } else {
            setAssets([...assets, { ...asset, id: `new-${Date.now()}` }]);
        }
        setIsModalOpen(false);
        setEditingAsset(null);
    };

    const assetCategories: AssetCategory[] = ['Real Estate', 'Collectibles', 'Fine Art', 'Private Equity', 'Cryptocurrency', 'Other'];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Alternative Asset Tracker</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your non-traditional investments like real estate, art, and more.</p>
                    </div>
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Asset</span>
                    </button>
                </div>

                {/* --- Summary Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard title="Total Value" value={formatCurrency(summaryData.totalValue)} />
                    <SummaryCard 
                        title="Total Gain/Loss" 
                        value={formatCurrency(summaryData.totalGainLoss)} 
                        percentage={summaryData.totalGainLossPercentage}
                    />
                    <div className="col-span-1 md:col-span-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                         <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Value by Category</h3>
                         <CategoryChart data={summaryData.categoryDistribution} />
                    </div>
                </div>

                {/* --- Assets Table --- */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    {['name', 'category', 'currentValue', 'purchasePrice', 'lastAppraisalDate'].map((key) => (
                                        <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as keyof Asset)}>
                                            <div className="flex items-center">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                <span className="ml-1">
                                                    {sortConfig?.key === key && (sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3">Gain/Loss</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAssets.map(asset => {
                                    const gainLoss = asset.currentValue - asset.purchasePrice;
                                    const gainLossColor = gainLoss >= 0 ? 'text-green-500' : 'text-red-500';
                                    return (
                                        <tr key={asset.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{asset.name}</th>
                                            <td className="px-6 py-4">{asset.category}</td>
                                            <td className="px-6 py-4 font-semibold">{formatCurrency(asset.currentValue)}</td>
                                            <td className="px-6 py-4">{formatCurrency(asset.purchasePrice)}</td>
                                            <td className="px-6 py-4">{formatDate(asset.lastAppraisalDate)}</td>
                                            <td className={`px-6 py-4 font-semibold ${gainLossColor}`}>{formatCurrency(gainLoss)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-4">
                                                    <button onClick={() => handleEdit(asset)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                        <EditIcon className="w-5 h-5"/>
                                                    </button>
                                                    <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                                        <TrashIcon className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {assets.length === 0 && (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                No alternative assets added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <AssetFormModal 
                    asset={editingAsset}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAsset}
                    categories={assetCategories}
                />
            )}
        </div>
    );
};

// --- Child Components ---

const SummaryCard: FC<{ title: string; value: string; percentage?: number }> = ({ title, value, percentage }) => {
    const isPositive = percentage !== undefined && percentage >= 0;
    const percentageColor = isPositive ? 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300' : 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300';
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
            <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
                {percentage !== undefined && (
                    <span className={`ml-2 text-sm font-semibold px-2 py-0.5 rounded-full ${percentageColor}`}>
                        {isPositive ? 'â²' : 'â¼'} {percentage.toFixed(2)}%
                    </span>
                )}
            </div>
        </div>
    );
};

const CategoryChart: FC<{ data: Record<string, number> }> = ({ data }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    if (total === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400">No data for chart.</div>;
    }
    const categories = Object.entries(data);
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

    return (
        <div className="space-y-2">
            {categories.sort((a,b) => b[1] - a[1]).map(([category, value], index) => {
                const percentage = (value / total) * 100;
                return (
                    <div key={category}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-gray-600 dark:text-gray-300">{category}</span>
                            <span className="text-gray-500 dark:text-gray-400">{formatCurrency(value)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


interface AssetFormModalProps {
    asset: Asset | null;
    onClose: () => void;
    onSave: (asset: Asset) => void;
    categories: AssetCategory[];
}

const AssetFormModal: FC<AssetFormModalProps> = ({ asset, onClose, onSave, categories }) => {
    const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
        name: asset?.name || '',
        category: asset?.category || 'Real Estate',
        purchaseDate: asset?.purchaseDate || new Date().toISOString().split('T')[0],
        purchasePrice: asset?.purchasePrice || 0,
        currentValue: asset?.currentValue || 0,
        lastAppraisalDate: asset?.lastAppraisalDate || new Date().toISOString().split('T')[0],
        notes: asset?.notes || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.endsWith('Price') || name.endsWith('Value') ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const assetToSave = asset ? { ...asset, ...formData } : { id: '', ...formData };
        onSave(assetToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{asset ? 'Edit Asset' : 'Add New Asset'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Price</label>
                            <input type="number" name="purchasePrice" id="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Date</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Value</label>
                            <input type="number" name="currentValue" id="currentValue" value={formData.currentValue} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="lastAppraisalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Appraisal</label>
                            <input type="date" name="lastAppraisalDate" id="lastAppraisalDate" value={formData.lastAppraisalDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                        <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Asset</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlternativeAssetTracker;