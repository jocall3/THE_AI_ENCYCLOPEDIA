```typescript
import React, { useState, useMemo } from 'react';
import { LayoutDashboard, FileText, Users, Settings, DollarSign, CreditCard, BarChart2, Filter, PlusCircle, ChevronDown, CheckCircle, Clock, XCircle } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type InvoiceStatus = 'Pending' | 'Approved' | 'Rejected' | 'Funded';

interface Invoice {
  id: string;
  supplier: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface Supplier {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  earlyPaymentEligible: boolean;
  discountRate: number;
}

// --- MOCK DATA ---
const mockInvoices: Invoice[] = [
  { id: 'INV-001', supplier: 'Global Parts Inc.', amount: 45000, issueDate: '2023-10-15', dueDate: '2023-12-14', status: 'Approved' },
  { id: 'INV-002', supplier: 'Stark Industries', amount: 120000, issueDate: '2023-10-20', dueDate: '2024-01-18', status: 'Funded' },
  { id: 'INV-003', supplier: 'Wayne Enterprises', amount: 75000, issueDate: '2023-11-01', dueDate: '2023-12-31', status: 'Pending' },
  { id: 'INV-004', supplier: 'Cyberdyne Systems', amount: 32000, issueDate: '2023-11-05', dueDate: '2024-01-04', status: 'Rejected' },
  { id: 'INV-005', supplier: 'Global Parts Inc.', amount: 55000, issueDate: '2023-11-10', dueDate: '2024-01-09', status: 'Approved' },
  { id: 'INV-006', supplier: 'Stark Industries', amount: 89000, issueDate: '2023-11-12', dueDate: '2024-02-10', status: 'Pending' },
];

const mockSuppliers: Supplier[] = [
  { id: 'SUP-01', name: 'Global Parts Inc.', tier: 'Tier 1', earlyPaymentEligible: true, discountRate: 2.5 },
  { id: 'SUP-02', name: 'Stark Industries', tier: 'Tier 1', earlyPaymentEligible: true, discountRate: 2.0 },
  { id: 'SUP-03', name: 'Wayne Enterprises', tier: 'Tier 2', earlyPaymentEligible: false, discountRate: 3.0 },
  { id: 'SUP-04', name: 'Cyberdyne Systems', tier: 'Tier 3', earlyPaymentEligible: true, discountRate: 3.5 },
];

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, change, changeType }: { title: string; value: string; icon: React.ElementType; change?: string; changeType?: 'increase' | 'decrease' }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {change && (
      <p className={`text-sm mt-2 flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
        {change} vs last month
      </p>
    )}
  </div>
);

const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5";
  switch (status) {
    case 'Approved':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle className="w-3 h-3" /> Approved</span>;
    case 'Funded':
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><DollarSign className="w-3 h-3" /> Funded</span>;
    case 'Pending':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock className="w-3 h-3" /> Pending</span>;
    case 'Rejected':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircle className="w-3 h-3" /> Rejected</span>;
    default:
      return null;
  }
};


// --- VIEW COMPONENTS ---
const DashboardView = () => {
    const totalFinanced = useMemo(() => mockInvoices.filter(inv => inv.status === 'Funded').reduce((acc, inv) => acc + inv.amount, 0), []);
    const pendingApproval = useMemo(() => mockInvoices.filter(inv => inv.status === 'Pending').length, []);
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Financed (YTD)" value={`$${(totalFinanced / 1_000_000).toFixed(2)}M`} icon={DollarSign} change="+5.2%" changeType="increase" />
                <StatCard title="Available Credit Line" value="$2.5M" icon={CreditCard} />
                <StatCard title="Invoices Pending Approval" value={String(pendingApproval)} icon={FileText} change="-10%" changeType="decrease" />
                <StatCard title="Active Suppliers" value={String(mockSuppliers.length)} icon={Users} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financing Activity</h3>
                {/* Placeholder for a chart */}
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <BarChart2 className="w-16 h-16 text-gray-300" />
                    <p className="text-gray-400 ml-4">Monthly Financing Volume Chart</p>
                </div>
            </div>
        </div>
    );
};

const InvoiceFactoringView = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Invoice Factoring</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" /> Submit New Invoice
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="text-lg font-semibold">Submitted Invoices</h3>
                    <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm">
                        <Filter className="w-4 h-4" /> Filter <ChevronDown className="w-4 h-4"/>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Invoice ID</th>
                                <th scope="col" className="px-6 py-3">Supplier</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockInvoices.map(invoice => (
                                <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{invoice.id}</th>
                                    <td className="px-6 py-4">{invoice.supplier}</td>
                                    <td className="px-6 py-4">${invoice.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">{invoice.dueDate}</td>
                                    <td className="px-6 py-4"><StatusBadge status={invoice.status} /></td>
                                    <td className="px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 hover:underline">View Details</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SupplierFinancingView = () => {
    const financiableInvoices = mockInvoices.filter(inv => inv.status === 'Approved');
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Supplier Financing</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-4 border-b">
                     <h3 className="text-lg font-semibold">Approved Invoices for Financing</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Invoice ID</th>
                                <th scope="col" className="px-6 py-3">Supplier</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financiableInvoices.map(invoice => (
                                <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                                    <td className="px-6 py-4">{invoice.supplier}</td>
                                    <td className="px-6 py-4">${invoice.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">{invoice.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition">Request Financing</button>
                                    </td>
                                </tr>
                            ))}
                             {financiableInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">No approved invoices available for financing.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const EarlyPaymentProgramsView = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Early Payment Programs</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" /> Add New Program
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-4 border-b">
                     <h3 className="text-lg font-semibold">Manage Supplier Programs</h3>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Supplier Name</th>
                                <th scope="col" className="px-6 py-3">Tier</th>
                                <th scope="col" className="px-6 py-3">Eligibility</th>
                                <th scope="col" className="px-6 py-3">Discount Rate</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockSuppliers.map(supplier => (
                                <tr key={supplier.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                                    <td className="px-6 py-4">{supplier.tier}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${supplier.earlyPaymentEligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {supplier.earlyPaymentEligible ? 'Eligible' : 'Not Eligible'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{supplier.discountRate}%</td>
                                    <td className="px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
type Tab = 'dashboard' | 'factoring' | 'financing' | 'programs';

export default function SupplyChainFinancePortal() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; name: string; icon: React.ElementType }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'factoring', name: 'Invoice Factoring', icon: FileText },
    { id: 'financing', name: 'Supplier Financing', icon: Users },
    { id: 'programs', name: 'Early Payment Programs', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'factoring':
        return <InvoiceFactoringView />;
      case 'financing':
        return <SupplierFinancingView />;
      case 'programs':
        return <EarlyPaymentProgramsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">SCF Portal</h1>
                <p className="text-xs text-gray-500">Supply Chain Finance</p>
            </div>
            <nav className="flex-1 px-4 py-4">
                <ul className="space-y-2">
                    {tabs.map(tab => (
                        <li key={tab.id}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">© 2024 Your Company</p>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
            <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h2 className="text-lg font-semibold text-gray-700">Welcome, Acme Corporation</h2>
                    <div className="flex items-center space-x-4">
                        {/* User profile placeholder */}
                        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            AC
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
```