import React from 'react';
import Card from './Card';

const SSOView: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-wider">Single Sign-On (SSO)</h2>
            <p className="text-gray-400">
                Manage your organization's single sign-on configuration to allow users to log in with their corporate credentials.
            </p>

            <Card title="SAML Configuration">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white">Identity Provider (IdP) Details</h4>
                        <p className="text-sm text-gray-400 mt-2">
                            Configure your IdP with the following information to establish a trusted connection with Demo Bank.
                        </p>
                        <div className="mt-3 space-y-2 text-sm">
                            <div>
                                <label className="text-gray-500">Assertion Consumer Service (ACS) URL</label>
                                <p className="font-mono text-cyan-300 bg-gray-900/50 p-2 rounded">https://auth.demobank.com/login/callback?connection=saml</p>
                            </div>
                            <div>
                                <label className="text-gray-500">Entity ID / Audience URI</label>
                                <p className="font-mono text-cyan-300 bg-gray-900/50 p-2 rounded">urn:auth0:demobank:saml-connection</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white">Service Provider (SP) Metadata</h4>
                        <p className="text-sm text-gray-400 mt-2">
                            Provide your IdP's metadata URL or upload the XML file to configure the connection.
                        </p>
                        <div className="mt-3">
                            <label htmlFor="metadata-url" className="text-gray-500 text-sm">IdP Metadata URL</label>
                            <input
                                id="metadata-url"
                                type="text"
                                placeholder="https://idp.example.com/saml/metadata"
                                className="w-full mt-1 bg-gray-900/50 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                         <div className="mt-3 text-center">
                            <span className="text-gray-500">OR</span>
                        </div>
                         <div className="mt-3">
                            <button className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                                Upload Metadata XML
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Connection Status">
                 <div className="flex items-center p-4 bg-green-900/30 rounded-lg border border-green-700">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">Connected to Google Workspace</h4>
                        <p className="text-sm text-gray-400">Last synced: Just now</p>
                    </div>
                    <button className="ml-auto px-3 py-1 bg-red-800/50 hover:bg-red-700/50 text-red-300 rounded-md text-xs">Disconnect</button>
                </div>
            </Card>
        </div>
    );
};

export default SSOView;
