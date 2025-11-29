import React from 'react';
const PlaidLinkButton = ({ onSuccess }: any) => <button onClick={() => onSuccess('mock-token', {})} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Connect Bank Account</button>;
export default PlaidLinkButton;