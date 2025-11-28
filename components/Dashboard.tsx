import React, { useContext, useMemo, useState, useEffect } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI, Type } from '@google/genai';

// ================================================================================================
// MODAL & OVERLAY COMPONENTS
// ================================================================================================
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ================================================================================================
// SVG ICONS (for widgets)
// ================================================================================================
const SendIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const BillIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const DepositIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);


// ================================================================================================
// DASHBOARD WIDGET SUB-COMPONENTS
// ================================================================================================

const QuickActions: React.FC<{ onAction: (view: View) => void }> = ({ onAction }) => {
    const actions = [
        { view: View.SendMoney, label: 'Send', icon: <SendIcon className="h-6 w-6" /> },
        { view: View.Transactions, label: 'Pay Bill', icon: <BillIcon className="h-6 w-6" /> },
        { view: View.Investments, label: 'Deposit', icon: <DepositIcon className="h-6 w-6" /> }
    ];
    return (
        <Card>
            <div className="flex justify-around items-center p-4">
                {actions.map(action => (
                    <button key={action.label} onClick={() => onAction(action.view)} className="flex flex-col items-center space-y-1 text-cyan-300 hover:text-white transition-colors">
                        {action.icon}
                        <span className="text-xs font-medium">{action.label}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ score: CreditScore }> = ({ score }) => (
    <Card>
        <div className="p-4 text-center">
            <p className="text-xs text-gray-400">Credit Score</p>
            <p className="text-3xl font-bold text-cyan-400">{score.score}</p>
            <p className="text-xs font-semibold text-gray-300">{score.rating}</p>
        </div>
    </Card>
);

const SavingsGoalsProgress: React.FC<{ goals: SavingsGoal[] }> = ({ goals }) => {
    if (!goals || goals.length === 0) {
        return (
            <Card title="Savings Goals">
                <div className="p-4 text-center text-gray-400">No savings goals set.</div>
            </Card>
        );
    }
    return (
        <Card title="Savings Goals">
            <div className="space-y-4 p-4">
                {goals.map(goal => (
                    <div key={goal.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-gray-200">{goal.name}</span>
                            <span className="text-gray-400">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MarketMovers: React.FC<{ movers: MarketMover[] }> = ({ movers }) => {
    return (
        <Card title="Market Movers">
            <div className="p-4">
                {(movers || []).map(mover => (
                    <div key={mover.ticker} className="flex justify-between items-center py-1.5">
                        <div>
                            <p className="font-bold text-sm text-white">{mover.ticker}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">{mover.name}</p>
                        </div>
                        <div className={`text-sm font-semibold ${mover.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {mover.change}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const UpcomingBillsWidget: React.FC<{ bills: UpcomingBill[] }> = ({ bills }) => {
    if (!bills || bills.length === 0) {
        return (
            <Card title="Upcoming Bills">
                <div className="p-4 text-center text-gray-400">No upcoming bills.</div>
            </Card>
        );
    }
    return (
        <Card title="Upcoming Bills">
            <div className="space-y-3 p-4">
                {bills.map(bill => (
                    <div key={bill.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-200">{bill.name}</p>
                            <p className="text-sm text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold text-lg text-white">${bill.amount.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard must be within a DataProvider");

    const {
        gamification,
        creditScore,
        savingsGoals,
        marketMovers,
        upcomingBills,
        setActiveView,
        plaidLinkToken,
        linkedAccounts,
        handlePlaidSuccess
    } = context;

    const gamificationData = useMemo(() => [
        { name: 'Score', value: gamification.score },
        { name: 'Remaining', value: 200 - gamification.score },
    ], [gamification.score]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            <BalanceSummary />
            
            <Card title="Financial Health">
                <div className="h-48 flex flex-col items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={gamificationData} dataKey="value" innerRadius="70%" outerRadius="85%" startAngle={90} endAngle={-270} paddingAngle={0} cornerRadius={50}>
                                <Cell fill="#22d3ee" />
                                <Cell fill="#374151" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold text-white">{gamification.score}</p>
                        <p className="text-xs text-gray-400">Level {gamification.level}</p>
                        <p className="text-xs font-semibold text-cyan-300">{gamification.levelName}</p>
                    </div>
                </div>
            </Card>

            <RecentTransactions />
            <WealthTimeline />
            <AIInsights />

            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-1 flex flex-col gap-4 sm:gap-6">
                 {!plaidLinkToken && linkedAccounts && linkedAccounts.length === 0 && (
                    <Card className="bg-cyan-900/50 border-cyan-700">
                        <div className="p-4 text-center">
                            <h4 className="font-bold text-white">Connect Your Bank</h4>
                            <p className="text-sm text-cyan-200/80 mt-1 mb-3">Link your external accounts securely with Plaid to get a full financial overview.</p>
                            <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                        </div>
                    </Card>
                )}
                <QuickActions onAction={setActiveView} />
                <CreditScoreMonitor score={creditScore} />
                <ImpactTracker />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                 <SavingsGoalsProgress goals={savingsGoals} />
            </div>
           
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                <UpcomingBillsWidget bills={upcomingBills} />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1">
                <MarketMovers movers={marketMovers} />
            </div>
        </div>
    );
};

export default Dashboard;