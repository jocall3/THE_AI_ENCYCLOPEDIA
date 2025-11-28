import React, { useState, useMemo } from 'react';
import { 
    LayoutDashboard, FileText, Users, Settings, DollarSign, CreditCard, BarChart2, Filter, PlusCircle, ChevronDown, CheckCircle, Clock, XCircle,
    ArrowLeftRight, Send, Wallet, Target, HeartPulse, TrendingUp, Bitcoin, BrainCircuit, Landmark, Warehouse, Home, Paintbrush, CandlestickChart, Rocket, Briefcase, Shield, Building, Archive, Network, Key, Bot, Sparkles, ShoppingBag, Clapperboard, Palette, Globe, Building2, Server, ConciergeBell, Castle, ShieldCheck, UserCog, Eye
} from 'lucide-react';

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
  { id: 'INV-004', supplier: 'Cyberdyne Systems', amount: 32000, issueDate: '2023-10-25', dueDate: '2023-12-24', status: 'Rejected' },
  { id: 'INV-005', supplier: 'Global Parts Inc.', amount: 65000, issueDate: '2023-11-05', dueDate: '2024-01-04', status: 'Approved' },
  { id: 'INV-006', supplier: 'Stark Industries', amount: 250000, issueDate: '2023-11-10', dueDate: '2024-02-08', status: 'Pending' },
];

const mockSuppliers: Supplier[] = [
  { id: 'SUP-01', name: 'Global Parts Inc.', tier: 'Tier 1', earlyPaymentEligible: true, discountRate: 2.5 },
  { id: 'SUP-02', name: 'Stark Industries', tier: 'Tier 1', earlyPaymentEligible: true, discountRate: 2.0 },
  { id: 'SUP-03', name: 'Wayne Enterprises', tier: 'Tier 2', earlyPaymentEligible: false, discountRate: 0 },
  { id: 'SUP-04', name: 'Cyberdyne Systems', tier: 'Tier 3', earlyPaymentEligible: true, discountRate: 3.0 },
];

// --- UI COMPONENTS ---

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, change?: string }> = ({ icon: Icon, title, value, change }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
      <Icon className="text-blue-500 dark:text-blue-400" size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change && <p className="text-xs text-green-500">{change}</p>}
    </div>
  </div>
);

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const statusClasses = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Funded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};


const SupplyChainFinancePortal: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);

  const stats = useMemo(() => ({
    totalFinanced: invoices.filter(i => i.status === 'Funded').reduce((acc, i) => acc + i.amount, 0),
    pendingInvoices: invoices.filter(i => i.status === 'Pending').length,
    eligibleSuppliers: suppliers.filter(s => s.earlyPaymentEligible).length,
    averageDiscount: suppliers.filter(s => s.earlyPaymentEligible).reduce((acc, s, _, arr) => acc + s.discountRate / arr.length, 0),
  }), [invoices, suppliers]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supply Chain Finance</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline"><Filter size={16} className="mr-2" /> Filter</Button>
          <Button><PlusCircle size={16} className="mr-2" /> New Financing Request</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={DollarSign} title="Total Financed" value={`$${(stats.totalFinanced / 1000000).toFixed(2)}M`} change="+5.2% last month" />
        <StatCard icon={FileText} title="Pending Invoices" value={stats.pendingInvoices.toString()} />
        <StatCard icon={Users} title="Eligible Suppliers" value={stats.eligibleSuppliers.toString()} />
        <StatCard icon={TrendingUp} title="Avg. Discount Rate" value={`${stats.averageDiscount.toFixed(2)}%`} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Financing Dashboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{invoice.id}</td>
                  <td className="px-6 py-4">{invoice.supplier}</td>
                  <td className="px-6 py-4">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{invoice.dueDate}</td>
                  <td className="px-6 py-4"><InvoiceStatusBadge status={invoice.status} /></td>
                  <td className="px-6 py-4">
                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Details</button>
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

// This is a dummy Button component to make the example self-contained
const Button: React.FC<{ children: React.ReactNode; variant?: 'outline' | 'default' }> = ({ children, variant }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm flex items-center justify-center transition-colors";
  const variantClasses = variant === 'outline'
    ? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    : "bg-blue-600 text-white hover:bg-blue-700";
  return <button className={`${baseClasses} ${variantClasses}`}>{children}</button>;
};

export default SupplyChainFinancePortal;