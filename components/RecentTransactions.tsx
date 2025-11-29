import React from 'react';
import Card from './Card';
const RecentTransactions = ({ transactions }: any) => <Card title="Recent Transactions"><div>{transactions.map((t: any) => <div key={t.id}>{t.description} - ${t.amount}</div>)}</div></Card>;
export default RecentTransactions;