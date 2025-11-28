
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, Wallet, Users, CheckCircle, Clock, QrCode, Copy } from 'lucide-react';

// --- TYPES AND MOCK DATA ---

type Asset = 'USDC' | 'USDT' | 'DAI';
type TransactionStatus = 'Pending' | 'Completed' | 'Failed';

type Transaction = {
  id: string;
  date: string;
  type: 'Incoming' | 'Outgoing';
  asset: Asset;
  amount: number;
  usdValue: number;
  from?: string;
  to?: string;
  status: TransactionStatus;
  requiredSignatures: number;
  approvals: string[];
  initiator: string;
};

const mockSignatories = [
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6',
];
const requiredSignatures = 2;
const currentUser = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // We are this signatory
const walletAddress = "0x4e5b2e1e2e3f4g5h6i7j8k9l0m1n2o3p4q5r";

const mockBalances = {
  USDC: 1250678.55,
  USDT: 875432.10,
  DAI: 543210.98,
};
const totalBalance = Object.values(mockBalances).reduce((acc, val) => acc + val, 0);

const initialTransactions: Transaction[] = [
  {
    id: 'tx1234',
    date: '2023-10-27',
    type: 'Outgoing',
    asset: 'USDC',
    amount: 50000,
    usdValue: 50000,
    to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    status: 'Pending',
    requiredSignatures: 2,
    approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'],
    initiator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  },
  {
    id: 'tx5678',
    date: '2023-10-26',
    type: 'Incoming',
    asset: 'USDT',
    amount: 120000,
    usdValue: 120000,
    from: '0x9876543210987654321098765432109876543210',
    status: 'Completed',
    requiredSignatures: 2,
    approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
    initiator: 'N/A',
  },
  {
    id: 'tx9012',
    date: '2023-10-25',
    type: 'Outgoing',
    asset: 'DAI',
    amount: 25000,
    usdValue: 25000,
    to: '0x0987654321098765432109876543210987654321',
    status: 'Completed',
    requiredSignatures: 2,
    approvals: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6'],
    initiator: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6',
  },
  {
    id: 'tx3456',
    date: '2023-10-24',
    type: 'Outgoing',
    asset: 'USDC',
    amount: 10000,
    usdValue: 10000,
    to: '0xFedcba9876543210Fedcba9876543210Fedcba98',
    status: 'Failed',
    requiredSignatures: 2,
    approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'],
    initiator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  },
];

// --- HELPER COMPONENTS & FUNCTIONS ---

const AssetIcon = ({ asset }: { asset: Asset }) => {
    const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs";
    if (asset === 'USDC') return <div className={`${baseClasses} bg-blue-500`}>USDC</div>;
    if (asset === 'USDT') return <div className={`${baseClasses} bg-green-500`}>USDT</div>;
    if (asset === 'DAI') return <div className={`${baseClasses} bg-yellow-500 text-slate-800`}>DAI</div>;
    return null;
};

const getStatusBadgeVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Pending': return 'secondary';
        case 'Failed': return 'destructive';
        default: return 'outline';
    }
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

// --- MAIN COMPONENT ---

export default function Web3CorporateWallet() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleApprove = (txId: string) => {
    setTransactions(prevTxs =>
      prevTxs.map(tx => {
        if (tx.id === txId && tx.status === 'Pending' && !tx.approvals.includes(currentUser)) {
          const newApprovals = [...tx.approvals, currentUser];
          const newStatus: TransactionStatus = newApprovals.length >= tx.requiredSignatures ? 'Completed' : 'Pending';
          return { ...tx, approvals: newApprovals, status: newStatus };
        }
        return tx;
      })
    );

    setSelectedTx(prevTx => {
      if (!prevTx || prevTx.id !== txId) return prevTx;
      const newApprovals = [...prevTx.approvals, currentUser];
      const newStatus: TransactionStatus = newApprovals.length >= prevTx.requiredSignatures ? 'Completed' : 'Pending';
      return { ...prevTx, approvals: newApprovals, status: newStatus };
    });
  };
  
  const handleSendSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTx: Transaction = {
        id: `tx${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Outgoing',
        asset: formData.get('asset') as Asset,
        amount: Number(formData.get('amount')),
        usdValue: Number(formData.get('amount')), // Assuming 1:1 for stablecoins
        to: formData.get('recipient') as string,
        status: 'Pending',
        requiredSignatures,
        approvals: [currentUser], // Initiator automatically approves
        initiator: currentUser,
    };
    setTransactions(prev => [newTx, ...prev]);
    setIsSendModalOpen(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };


  return (
    <Card className="w-full max-w-4xl mx-auto my-8 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-100">
                    <Wallet className="mr-3 h-7 w-7 text-blue-500" />
                    Corporate Treasury Wallet
                </CardTitle>
                <CardDescription className="mt-1 font-mono">{truncateAddress(walletAddress)}</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Balance</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{formatCurrency(totalBalance)}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col gap-4">
                <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="w-full">
                            <ArrowUpRight className="mr-2 h-5 w-5" /> Send Funds
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Initiate New Transaction</DialogTitle>
                            <DialogDescription>
                                This transaction will require {requiredSignatures} of {mockSignatories.length} signatures to be executed.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSendSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="recipient" className="text-right">Recipient</Label>
                                <Input id="recipient" name="recipient" placeholder="0x..." className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="asset" className="text-right">Asset</Label>
                                <Select name="asset" defaultValue='USDC'>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select an asset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USDC">USDC</SelectItem>
                                        <SelectItem value="USDT">USDT</SelectItem>
                                        <SelectItem value="DAI">DAI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Amount</Label>
                                <Input id="amount" name="amount" type="number" placeholder="0.00" className="col-span-3" required step="0.01" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Initiate Transaction</Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" variant="outline" className="w-full">
                            <ArrowDownLeft className="mr-2 h-5 w-5" /> Receive Funds
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Wallet Address</DialogTitle>
                        <DialogDescription>
                            Send funds to this address. Use the QR code or copy the address below.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-4 space-y-4">
                            <div className="p-4 bg-white rounded-lg">
                                {/* In a real app, this would be a generated QR code */}
                                <QrCode size={160} />
                            </div>
                            <div className="flex items-center space-x-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-800 w-full">
                                <span className="text-sm font-mono truncate">{walletAddress}</span>
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4" />
                                    <span className="ml-2">{isCopied ? "Copied!" : "Copy"}</span>
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(mockBalances).map(([asset, balance]) => (
                    <Card key={asset}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{asset}</CardTitle>
                            <AssetIcon asset={asset as Asset} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(balance).replace('$', '')}</div>
                            <p className="text-xs text-muted-foreground">{formatCurrency(balance)} USD</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Transaction History</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                    <Users className="h-5 w-5" />
                    <span><strong>{requiredSignatures} of {mockSignatories.length}</strong> signatures required</span>
                </div>
            </div>
            
            <Dialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                        <DialogTrigger asChild key={tx.id} onClick={() => setSelectedTx(tx)}>
                            <TableRow className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className={`mr-3 rounded-full p-2 ${tx.type === 'Outgoing' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                                            {tx.type === 'Outgoing' ? <ArrowUpRight className="h-4 w-4 text-red-500" /> : <ArrowDownLeft className="h-4 w-4 text-green-500" />}
                                        </div>
                                        <div>
                                            <div className="font-medium">{tx.asset} {tx.type}</div>
                                            <div className="text-sm text-muted-foreground">{tx.date}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${tx.type === 'Outgoing' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {tx.type === 'Outgoing' ? '-' : '+'} {formatCurrency(tx.amount)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusBadgeVariant(tx.status)}>{tx.status}</Badge>
                                </TableCell>
                            </TableRow>
                        </DialogTrigger>
                        ))}
                    </TableBody>
                </Table>

                {selectedTx && (
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <DialogDescription>ID: {selectedTx.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                             <div>
                                <h4 className="font-semibold mb-2">Summary</h4>
                                <div className="text-sm space-y-1 rounded-md border p-3 bg-slate-50 dark:bg-slate-800">
                                    <p><strong>Type:</strong> {selectedTx.type}</p>
                                    <p><strong>Amount:</strong> {selectedTx.amount} {selectedTx.asset} ({formatCurrency(selectedTx.usdValue)})</p>
                                    <p><strong>Date:</strong> {selectedTx.date}</p>
                                    {selectedTx.from && <p><strong>From:</strong> <span className="font-mono">{truncateAddress(selectedTx.from)}</span></p>}
                                    {selectedTx.to && <p><strong>To:</strong> <span className="font-mono">{truncateAddress(selectedTx.to)}</span></p>}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Signature Status ({selectedTx.approvals.length}/{selectedTx.requiredSignatures})</h4>
                                <ul className="space-y-2">
                                    {mockSignatories.map(signer => {
                                        const hasSigned = selectedTx.approvals.includes(signer);
                                        return (
                                            <li key={signer} className="flex items-center text-sm">
                                                {hasSigned ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                                                <span className="font-mono">{truncateAddress(signer)}</span>
                                                {signer === currentUser && <Badge variant="outline" className="ml-2">You</Badge>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                         <DialogFooter>
                            {selectedTx.status === 'Pending' && mockSignatories.includes(currentUser) && !selectedTx.approvals.includes(currentUser) && (
                                <Button onClick={() => handleApprove(selectedTx.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4"/> Approve Transaction
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setSelectedTx(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
