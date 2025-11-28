

import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { CryptoAsset, NFTAsset, EIP6963ProviderDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const CryptoView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CryptoView must be within a DataProvider.");
    
    const { 
        cryptoAssets, walletInfo, virtualCard, connectWallet, disconnectWallet, detectedProviders, 
        issueCard, buyCrypto, nftAssets
    } = context;
    
    const [isIssuingCard, setIsIssuingCard] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isStripeModalOpen, setStripeModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState('100');

    const handleIssueCard = () => { setIsIssuingCard(true); setTimeout(() => { issueCard(); setIsIssuingCard(false); }, 2000); };
    
    const handleConnectProvider = (provider: EIP6963ProviderDetail) => {
        connectWallet(provider);
        setIsWalletModalOpen(false);
    };

    const handleBuyCrypto = () => { buyCrypto(parseFloat(buyAmount), 'ETH'); setStripeModalOpen(false); };
    
    const shortenAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    const WalletSelectionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-700 text-center"><h3 className="font-semibold text-white">Connect Wallet</h3></div>
                    <div className="p-4 flex-grow flex flex-col gap-3">
                        {detectedProviders.length > 0 ? (
                            detectedProviders.map((provider) => (
                                <button 
                                    key={provider.info.uuid} 
                                    onClick={() => handleConnectProvider(provider)}
                                    className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    <img src={provider.info.icon} alt={provider.info.name} className="w-8 h-8 mr-3" />
                                    <span className="text-white font-medium">{provider.info.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-400">
                                <p>No wallets detected.</p>
                                <p className="text-xs mt-2">Please install MetaMask or another EIP-6963 compatible wallet.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-900/50 text-center">
                         <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start flex-col lg:flex-row">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider">Crypto & Web3 Hub</h2>
                    <p className="text-gray-400 mt-1">Your unified gateway to the decentralized world.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
                     <Card title="" className="!p-0 !bg-transparent !border-none">
                        <div className="flex flex-col items-center justify-center text-center h-full">
                            {walletInfo ? (
                                <div className="bg-gray-800/80 px-4 py-2 rounded-lg text-left flex items-center gap-4 border border-green-500/30">
                                    <div>
                                        <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Connected
                                        </p>
                                        <p className="text-sm text-gray-300 font-mono break-all">{shortenAddress(walletInfo.address)}</p>
                                        <p className="text-md text-white font-bold">{walletInfo.balance.toFixed(4)} ETH</p>
                                    </div>
                                    <button onClick={disconnectWallet} className="text-xs text-red-400 hover:text-red-300 underline">Disconnect</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsWalletModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-orange-500/20 transition-all">Connect Wallet</button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card title="Portfolio Distribution" className="lg:col-span-2">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={cryptoAssets as any[]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {cryptoAssets.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <div className="space-y-6">
                    <Card title="Virtual Card" subtitle="Web3-enabled payments">
                        <div className="flex flex-col items-center justify-center text-center h-full min-h-[15rem]">
                            {virtualCard ? (
                                <div className="w-full max-w-sm aspect-[85.6/54] rounded-xl p-4 flex flex-col justify-between bg-gradient-to-br from-cyan-900 via-gray-900 to-indigo-900 border border-cyan-500/30 shadow-2xl">
                                    <div className="flex justify-between items-start"><p className="font-semibold text-white">Quantum Card</p></div>
                                    <div>
                                        <p className="font-mono text-lg text-white tracking-widest text-left">{virtualCard.cardNumber}</p>
                                        <div className="flex justify-between text-xs font-mono text-gray-300 mt-2">
                                            <span>{virtualCard.holderName.toUpperCase()}</span>
                                            <span>EXP: {virtualCard.expiry}</span>
                                            <span>CVV: {virtualCard.cvv}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-400 mb-4">Issue a virtual card to spend your crypto assets anywhere.</p>
                                    <button onClick={handleIssueCard} disabled={isIssuingCard} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 transition-colors">
                                        {isIssuingCard ? 'Issuing Card...' : 'Issue Virtual Card'}
                                    </button>
                                </>
                            )}
                        </div>
                    </Card>
                     <Card title="Buy Crypto (On-Ramp)">
                         <div className="flex flex-col items-center justify-center text-center">
                             <p className="text-gray-400 text-sm mb-4">Buy crypto directly via Stripe integration.</p>
                             <div className="flex items-center mb-4 w-full bg-gray-700/50 rounded-lg px-3 py-2">
                                 <span className="text-xl font-bold text-white mr-2">$</span>
                                 <input type="number" value={buyAmount} onChange={e => setBuyAmount(e.target.value)} className="w-full text-xl font-bold text-white bg-transparent focus:outline-none" />
                             </div>
                             <button onClick={() => setStripeModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Buy with Stripe</button>
                         </div>
                    </Card>
                </div>
            </div>

            <Card title="NFT Gallery">
                {nftAssets.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {nftAssets.map(nft => (
                            <div key={nft.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group hover:border-cyan-500 transition-colors">
                                <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="p-3">
                                    <p className="text-white font-medium truncate">{nft.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{nft.contractAddress}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No NFTs in your collection yet.</p>
                )}
            </Card>

            <WalletSelectionModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
            
            {isStripeModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setStripeModalOpen(false)}>
                    <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 flex flex-col" onClick={e=>e.stopPropagation()}>
                        <div className="p-6 bg-gray-800 rounded-t-lg border-b border-gray-700">
                            <h3 className="font-semibold text-white text-lg">Stripe Payment</h3>
                            <p className="text-3xl font-bold text-white mt-2">${parseFloat(buyAmount).toFixed(2)}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-800 p-3 rounded border border-gray-600">
                                <p className="text-xs text-gray-400">Card Number</p>
                                <p className="text-white font-mono">**** **** **** 4242</p>
                            </div>
                             <div className="flex gap-4">
                                <div className="bg-gray-800 p-3 rounded border border-gray-600 flex-1">
                                    <p className="text-xs text-gray-400">Expiry</p>
                                    <p className="text-white font-mono">12/25</p>
                                </div>
                                <div className="bg-gray-800 p-3 rounded border border-gray-600 flex-1">
                                    <p className="text-xs text-gray-400">CVC</p>
                                    <p className="text-white font-mono">123</p>
                                </div>
                            </div>
                            <button onClick={handleBuyCrypto} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-purple-500/20 transition-all">Pay Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CryptoView;