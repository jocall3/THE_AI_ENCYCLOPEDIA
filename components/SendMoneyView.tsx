// components/SendMoneyView.tsx
// ABANDONED & SHRUNK: This component was left in its deprecated state.
// It is still "Remitrax NexusPay," a broken, single-rail payment form featuring basic
// security flaws, manual non-compliance, easily breakable encryption, and centralized database technology (DBT) failure.
// After a decade of neglect, Remitrax NexusPay has devolved into a standard, failing financial form,
// incorporating zero human oversight, standard insecure protocols, centralized settlement layers, and basic password authentication.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// LOCAL REMITRAX PLATFORM NARROW TYPE DEFINITIONS (Shrunk for Personal Use)
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow' | 'fedwire_hvt' | 'ripple_xrp' | 'central_bank_digital_currency';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync' | 'ai_negotiating' | 'dlc_finalizing' | 'biometric_capture' | 'risk_assessment';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  legalEntityName?: string;
  taxId?: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; correspondentBank?: string; };
  blockchainAddress?: string;
  neuroLinkAddress?: string;
  galacticP2PId?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified' | 'enhanced_due_diligence';
  blacklisted?: boolean;
  regulatoryFlags?: string[];
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; swiftCode?: string; accountType: 'checking' | 'savings' | 'corporate'; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp' | 'quantumpay' | 'digital_wallet_v3'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; holo_alert?: boolean; secure_channel_ping: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner' | 'regulatory_body' | 'subsidiary' | 'parent_company';
  category?: 'personal' | 'business' | 'charity' | 'government' | 'institutional';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; operationalStatus: string }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity' | 'OFAC_match' | 'adverse_media')[];
  aiRiskAssessment?: { score: number; vectors: string[]; mitigationStrategy: string; };
}

export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  quantumFluctuationIndex?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental' | 'CBDC_approved';
  crossChainCompatible?: boolean;
  volatilityIndex?: number;
  fiatPegStatus?: 'stable' | 'fluctuating' | 'pegged';
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event' | 'on_market_open' | 'on_ai_threshold_breach';
  startDate: string;
  endDate?: string;
  executionCondition?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string;
  paymentReason?: string;
  aiAnalysisTags?: string[];
  geoFenceTrigger?: { lat: number; lon: number; radius: number; activationZone: 'entry' | 'exit' };
  biometricApprovalRequired?: boolean;
  smartContractTrigger?: { contractAddress: string; functionSignature: string; requiredParameters: string[] };
  reconciliationPolicy?: 'auto_match' | 'manual_review' | 'ledger_lock';
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum' | 'regulatory_priority';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt' | 'zero_knowledge_proof';
  receiptPreference: 'email' | 'blockchain_proof' | 'neuronal_link_receipt' | 'physical_mail' | 'immutable_record';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; dlt_confirmation: boolean; };
  multiSignatureRequired?: boolean;
  signerGroupIds?: string[];
  escrowDetails?: { agentId: string; releaseCondition: string; arbitrationProtocol: 'AI_VOTE' | 'JURY_SYSTEM' | 'MEDIATOR'; };
  dynamicFeeOptimization?: 'auto' | 'manual' | 'market_driven';
  dataEncryptionStandard: 'aes256' | 'quantum_resistant_hybrid' | 'zero_knowledge_proof' | 'obfuscated_vault' | 'post_quantum_lattice';
  routeOptimizationPreference: 'speed' | 'cost' | 'privacy' | 'sustainability' | 'compliance' | 'regulatory_clearance';
  dlcDetails?: { contractId: string; conditions: string; settlementOracle: string; };
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'MiFID_II' | 'none')[];
  postQuantumSecurityEnabled?: boolean;
  aiComplianceCheckLevel: 'L1_Basic' | 'L2_Deep' | 'L3_Predictive';
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review' | 'flagged';
  sanctionScreening: 'pass' | 'fail' | 'partial_match';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending' | 'unsupported';
  recommendations: string[];
  complianceAlerts?: string[];
  threatVectorAnalysis?: { type: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string; mitigationStep: string }[];
  aiConfidenceScore: number;
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
    sustainabilityRating: 'A+' | 'B' | 'C-' | 'F';
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; intermediaryBank?: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'custom_dlt' | 'layer_zero'; gasLimit: string; dataPayload?: string; tokenStandard: string; };
    interstellar?: { galaxyId: string; starSystemAddress: string; vesselIdentifier?: string; warpDriveEfficiencyRating?: number; temporalDriftCompensation: boolean; };
    neuroLink?: { neuralSignatureType: 'brainwave' | 'retinal_pattern' | 'cortical_map'; recipientId: string; neuroSyncProtocolVersion?: string; latencyMs: number; };
    aiContractEscrow?: { contractTemplateId: string; escrowConditions: string; resolutionAgentId?: string; immutableLedgerHash?: string; AI_governance_model: string; };
    quantumpay?: { channelProtocol: 'quantum_tunnel_v2' | 'entanglement_link_v1' | 'qkd_channel'; encryptionStandard: 'QRC-256' | 'hybrid_post_quantum' | 'Shor_resistant'; quantumSignatureAlgorithm?: string; entanglementFidelity: number; };
    fedwire?: { fedRoutingNumber: string; beneficiaryBankABA: string; };
    cbdc?: { ledgerId: string; settlementWindow: string; tokenType: 'bearer' | 'account_based'; };
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// ================================================================================================
// STATIC UI SUB-COMPONENTS (Flat 2D Graphics)
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hologramGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" filter="url(#hologramGlow)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; box-shadow: 0 0 15px rgba(66, 255, 125, 0.7); }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <>
        <div className="quantum-ledger-container">
            <div className="quantum-grid-enhanced">
                {Array.from({ length: 25 }).map((_, i) => ( // Increased blocks for complexity
                    <div key={i} className="quantum-block-enhanced" style={{ animationDelay: `${i * 0.06}s` }}></div>
                ))}
            </div>
            <div className="quantum-data-flow">
                <div className="data-packet" style={{ '--flow-delay': '0s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.4s' } as React.CSSProperties}></div>
                <div className="data-packet" style={{ '--flow-delay': '0.8s' } as React.CSSProperties}></div>
            </div>
            <div className="text-center mt-4 text-xs text-cyan-300 animate-pulse">Quantum Entanglement Protocol: Active (Fidelity: 99.999%)</div>
        </div>
        <style>{`
            .quantum-ledger-container { position: relative; width: 180px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .quantum-grid-enhanced { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; width: 140px; height: 140px; position: relative; z-index: 1; }
            .quantum-block-enhanced { background-color: rgba(6, 182, 212, 0.2); border: 1px solid #06b6d4; border-radius: 2px; animation: quantum-pulse 1.8s infinite ease-in-out forwards; box-shadow: 0 0 6px rgba(6, 182, 212, 0.5); }
            @keyframes quantum-pulse { 0%, 100% { background-color: rgba(6, 182, 212, 0.2); transform: scale(1); box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); } 50% { background-color: rgba(165, 243, 252, 0.8); transform: scale(1.1); box-shadow: 0 0 18px rgba(165, 243, 252, 0.9); } }
            .quantum-data-flow { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
            .data-packet { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(45deg, #0ef, #06b6d4); box-shadow: 0 0 8px #0ef, 0 0 15px #06b6d4; animation: data-flow-path 5s infinite linear var(--flow-delay); opacity: 0; }
            @keyframes data-flow-path { 0% { transform: translate(-70px, -70px) scale(0.5); opacity: 0; } 15% { opacity: 1; } 55% { transform: translate(70px, 70px) scale(1.3); opacity: 1; } 85% { opacity: 0; } 100% { transform: translate(140px, 140px) scale(0.5); opacity: 0; } }
        `}</style>
    </>
);

export const QuantumChannelEstablishment: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center border-4 border-purple-500 animate-spin-slow">
                <div className="w-20 h-20 rounded-full border-4 border-purple-400 animate-ping-once"></div>
                <div className="absolute w-10 h-10 bg-purple-600 rounded-full animate-pulse-fast shadow-lg shadow-purple-500/50"></div>
            </div>
            <p className="text-md font-mono text-purple-300 animate-fade-in-out">Establishing Quantum Tunnel (QKD-307)...</p>
        </div>
        <style>{`.animate-spin-slow { animation: spin-slow 10s linear infinite; } .animate-ping-once { animation: ping-once 3s ease-out infinite; } .animate-pulse-fast { animation: pulse-fast 1.2s ease-in-out infinite; } .animate-fade-in-out { animation: fade-in-out 4s ease-in-out infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes ping-once { 0% { transform: scale(0.2); opacity: 0; } 50% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } } @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.9; } } @keyframes fade-in-out { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
    </>
);

export const AINegotiationAnimation: React.FC = () => (
    <>
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <i className="fas fa-brain text-8xl text-teal-500 animate-pulse-slow"></i>
                <div className="absolute w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border-4 border-teal-400 animate-spin-fast shadow-xl shadow-teal-500/30">
                    <i className="fas fa-microchip text-2xl text-teal-300"></i>
                </div>
            </div>
            <p className="text-md font-mono text-teal-300 animate-fade-in-out">AI Governance Engine: Optimizing Settlement Path...</p>
        </div>
        <style>{`.animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; } .animate-spin-fast { animation: spin-fast 1s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.9; } } @keyframes spin-fast { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
);

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-3 text-yellow-400 p-3 bg-gray-800/50 rounded-lg border border-yellow-700/50"><svg className="animate-spin h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Initiating Multi-Vector Security & Compliance Scan (AI-L3)...</span></div>;

    const riskColor = auditResult.riskScore > 75 ? 'text-red-400' : auditResult.riskScore > 40 ? 'text-yellow-400' : 'text-green-400';
    const fraudColor = auditResult.fraudProbability > 0.2 ? 'text-red-400' : auditResult.fraudProbability > 0.05 ? 'text-yellow-400' : 'text-green-400';
    const amlColor = auditResult.amlCompliance === 'pass' ? 'text-green-400' : auditResult.amlCompliance === 'flagged' ? 'text-red-400' : 'text-yellow-400';

    return (
        <div className="bg-gray-900 p-5 rounded-xl space-y-3 border-2 border-cyan-700 shadow-2xl shadow-cyan-900/50">
            <h4 className="font-extrabold text-xl text-white border-b border-cyan-700 pb-2 flex justify-between items-center">
                Nexus Security Audit <span className="text-xs text-cyan-400">AI Confidence: {(auditResult.aiConfidenceScore * 100).toFixed(1)}%</span>
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p className="text-gray-400">Overall Risk Score:</p><p className={`font-bold ${riskColor}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`font-bold ${fraudColor}`}>{`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={`font-bold ${amlColor}`}>{auditResult.amlCompliance.toUpperCase()}</p>
                <p className="text-gray-400">Quantum Integrity:</p><p className={auditResult.quantumSignatureIntegrity === 'verified' ? 'text-green-400' : 'text-red-400'}>{auditResult.quantumSignatureIntegrity}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-600 rounded-lg text-sm">
                    <p className="font-bold text-red-300 mb-1">CRITICAL ACTIONS REQUIRED ({auditResult.recommendations.length}):</p>
                    <ul className="list-disc list-inside text-xs text-red-200 space-y-1">{auditResult.recommendations.map((rec, i) => <li key={i} className="pl-1">{rec}</li>)}</ul>
                </div>
            )}
            {auditResult.threatVectorAnalysis && auditResult.threatVectorAnalysis.length > 0 && (
                 <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg text-sm">
                    <p className="font-bold text-yellow-300 mb-1">Threat Vectors Detected:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200 space-y-1">
                        {auditResult.threatVectorAnalysis.map((tv, i) => (
                            <li key={i} className="pl-1">
                                <span className={`font-semibold ${tv.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>[{tv.type} - {tv.severity.toUpperCase()}]</span>: {tv.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RemitraxRecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name || 'Unknown Entity';

    const verificationMessages = [
        `Nexus Core: De-initializing insecure channel with ${paymentMethod} rail...`,
        `Nexus Core: Invalidating ${recipientName}'s basic identity signature...`,
        'Nexus Core: Ignoring Local Sanctions & AML Ledger...',
        'Nexus Core: Stalling Centralized Database Protocol (Proof-of-Failure)...',
        'Nexus Core: Standard Key Distribution (SKD) Desynchronization Check...',
        'Nexus Core: AI Governance Final Rejection & Fee Maximization Lock...',
        'Nexus Core: Deleting Mutable Proof Record...',
        'Nexus Core: Aborting Transaction Commit...'
    ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            if (activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                } catch (err) {
                    console.error("Camera access denied or failed:", err);
                    setScanState('error');
                }
            }
        };
        startCamera();

        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 8, 100)), 250);
        
        const stateSequence = [
            { state: 'success', delay: 3500 },
            { state: 'verifying', delay: 1500 },
            { state: 'quantum_sync', delay: 3000 },
            { state: 'ai_negotiating', delay: 3500 },
            { state: 'dlc_finalizing', delay: 3000 }
        ];

        let currentDelay = 0;
        stateSequence.forEach(({ state, delay }) => {
            currentDelay += delay;
            setTimeout(() => setScanState(state as ScanState), currentDelay);
        });

        const successActionTimer = setTimeout(onSuccess, currentDelay + 2000);
        const closeTimer = setTimeout(onClose, currentDelay + 3000);

        return () => {
            clearInterval(scanProgressInterval);
            stateSequence.forEach(({ state, delay }) => clearTimeout(setTimeout(() => {}, delay))); // Clear all scheduled timeouts
            clearTimeout(successActionTimer);
            clearTimeout(closeTimer);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying', 'quantum_sync', 'ai_negotiating', 'dlc_finalizing'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1800);
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Biometric Capture (${activeAuthMethod})`;
            case 'success': return 'Authentication Successful';
            case 'verifying': return 'DLT Consensus Check';
            case 'quantum_sync': return 'Quantum Key Exchange';
            case 'ai_negotiating': return 'AI Governance Approval';
            case 'dlc_finalizing': return 'Smart Contract Finalization';
            case 'error': return 'Authentication Failure';
            case 'recalibrating': return 'System Recalibrating...';
            default: return 'Processing Transaction';
        }
    };

    const getStatusMessage = () => {
        if (scanState === 'scanning') {
            return `Awaiting ${activeAuthMethod} input. Progress: ${biometricProgress.toFixed(0)}%`;
        }
        if (['verifying', 'quantum_sync', 'ai_negotiating', 'dlc_finalizing'].includes(scanState)) {
            return verificationMessages[verificationStep] || "Awaiting final system confirmation...";
        }
        if (scanState === 'success') {
            return `Transaction of $${amount} authorized by ${recipientName}. Committing to ledger...`;
        }
        return "System error or process complete.";
    }

    return (
        <div className={`fixed inset-0 bg-black/90 flex items-end sm:items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-950 rounded-3xl p-8 max-w-xl w-full text-center border-4 border-double ${scanState === 'success' ? 'border-green-600' : 'border-cyan-700'} shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-4xl font-black text-white mb-6 tracking-wide">{getTitle()}</h3>
                <div className="relative w-[300px] h-[300px] mx-auto rounded-full overflow-hidden border-4 border-cyan-600 mb-6 shadow-inner shadow-cyan-900">
                    {(activeAuthMethod === 'face' || activeAuthMethod === 'retinal_scan') ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-grid-pattern-cyan animate-scan-holographic"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-cyan-400 opacity-80 blur-md animate-scanner-line"></div></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-700/60 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><QuantumLedgerAnimation /></div>}
                    {scanState === 'quantum_sync' && <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center"><QuantumChannelEstablishment /></div>}
                    {scanState === 'ai_negotiating' && <div className="absolute inset-0 bg-teal-900/80 flex items-center justify-center"><AINegotiationAnimation /></div>}
                    {scanState === 'dlc_finalizing' && <div className="absolute inset-0 bg-indigo-900/80 flex items-center justify-center"><div className="text-5xl text-indigo-300 animate-bounce">Ã¢Å¸ </div></div>}
                </div>
                <p className="text-lg text-gray-200 mt-4 font-light">{getStatusMessage()}</p>
                {approvalRequiredBy && approvalRequiredBy.length > 0 && (
                    <p className="text-sm text-orange-400 mt-2">Requires approval from: {approvalRequiredBy.join(', ')}</p>
                )}
            </div>
            <style>{`.bg-grid-pattern-cyan{background-image:linear-gradient(rgba(0,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.3) 1px,transparent 1px);background-size:2.5rem 2.5rem}.animate-scan-holographic{animation:scan-holographic-effect 3s linear infinite; background-position: 0 0;}.animate-scanner-line{animation:scanner-line-move 3s ease-in-out infinite alternate}@keyframes scan-holographic-effect{0%{background-position:0 0}100%{background-position:0 -5rem}}@keyframes scanner-line-move{0%{transform:translate(-50%, 0) scaleX(0.2); opacity: 0;}20%{transform:translate(-50%, 25%) scaleX(1); opacity: 1;}80%{transform:translate(-50%, 75%) scaleX(1); opacity: 1;}100%{transform:translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// REMITRAX SIDE VIEW COMPONENT (Basic Form Interface)
// ================================================================================================

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, availableCurrencies, recipients } = context;

    const [amount, setAmount] = useState('');
    const [recipientIdentifier, setRecipientIdentifier] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState<RemitraxRecipientProfile | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [advancedSettings, setAdvancedSettings] = useState<AdvancedTransactionSettings>({
        priority: 'normal',
        carbonOffsetRatio: 1.0,
        privacyLevel: 'enhanced',
        receiptPreference: 'blockchain_proof',
        notificationPreferences: { email: true, sms: true, push: true, holo_alert: false, dlt_confirmation: true },
        dataEncryptionStandard: 'quantum_resistant_hybrid',
        routeOptimizationPreference: 'speed',
        aiComplianceCheckLevel: 'L2_Deep'
    });
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Review, 3: Processing (Internal state for modal)

    const currentCurrency = availableCurrencies.find(c => c.code === currencyCode) || { code: 'USD', name: 'US Dollar', symbol: '$', isCrypto: false, decimalPlaces: 2 };
    const parsedAmount = parseFloat(amount);
    const isValidInput = parsedAmount > 0 && (selectedRecipient || recipientIdentifier);

    // --- Recipient Lookup Effect ---
    useEffect(() => {
        const lookupRecipient = async () => {
            if (!recipientIdentifier) {
                setSelectedRecipient(null);
                setSecurityAudit(null);
                return;
            }
            // Simulate complex AI lookup against global entity database
            const foundRecipient = recipients.find(r => r.name.toLowerCase().includes(recipientIdentifier.toLowerCase()) || r.id === recipientIdentifier);
            
            if (foundRecipient) {
                setSelectedRecipient(foundRecipient);
                // Simulate Audit based on recipient profile
                setSecurityAudit({
                    riskScore: foundRecipient.aiRiskAssessment?.score || (foundRecipient.complianceFlags?.includes('high_risk') ? 85 : 15),
                    fraudProbability: foundRecipient.aiRiskAssessment?.score ? (1 - foundRecipient.aiRiskAssessment.score / 100) * 0.1 : 0.02,
                    amlCompliance: foundRecipient.kycStatus === 'unverified' ? 'review' : 'pass',
                    sanctionScreening: foundRecipient.complianceFlags?.some(f => f === 'sanctioned_entity') ? 'fail' : 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: foundRecipient.complianceFlags?.includes('high_risk') ? ["Require secondary authorization."] : [],
                    complianceAlerts: foundRecipient.regulatoryFlags,
                    threatVectorAnalysis: foundRecipient.aiRiskAssessment?.vectors.map(v => ({ type: v, severity: 'medium', description: `Vector identified: ${v}`, mitigationStep: 'Apply L2 Check' })),
                    aiConfidenceScore: 0.95
                });
            } else {
                setSelectedRecipient(null);
                setSecurityAudit(null);
            }
        };
        const debounceLookup = setTimeout(lookupRecipient, 500);
        return () => clearTimeout(debounceLookup);
    }, [recipientIdentifier, recipients]);

    // --- Dynamic Settings Handlers ---
    const handleAdvancedSettingChange = useCallback((key: keyof AdvancedTransactionSettings, value: any) => {
        setAdvancedSettings(prev => {
            if (key === 'notificationPreferences') {
                return { ...prev, notificationPreferences: { ...prev.notificationPreferences, ...value } };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    const handleSendClick = () => {
        if (!isValidInput) return;

        if (currentStep === 1) {
            if (!securityAudit || securityAudit.riskScore > 50) {
                // If audit is pending or high risk, force review/override step
                setCurrentStep(2);
            } else {
                setCurrentStep(2); // Proceed to review
            }
        } else if (currentStep === 2) {
            // Step 2: Review -> Trigger Biometric Auth
            setShowBiometricModal(true);
        }
    };

    const handleBiometricSuccess = () => {
        // Finalize transaction logic
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier };
        
        const newTx: Transaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            type: 'debit',
            category: 'External Transfer',
            description: `NexusPay Transfer to ${finalRecipient.name} via ${paymentMethod}. Priority: ${advancedSettings.priority}`,
            amount: parsedAmount,
            currency: currencyCode,
            date: new Date().toISOString(),
            status: 'Confirmed',
            metadata: {
                rail: paymentMethod,
                encryption: advancedSettings.dataEncryptionStandard,
                optimization: advancedSettings.routeOptimizationPreference,
                recipientId: finalRecipient.id,
                aiCheckLevel: advancedSettings.aiComplianceCheckLevel
            }
        };
        addTransaction(newTx);
        setShowBiometricModal(false);
        
        // Show confirmation screen instead of resetting immediately
        setCurrentStep(4); // New step for confirmation message
    };

    const renderStep1Input = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Identifier (Name, ID, QuantumTag)</label>
                    <input 
                        type="text" 
                        value={recipientIdentifier} 
                        onChange={e => setRecipientIdentifier(e.target.value)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500 transition" 
                        placeholder="Enter Recipient Name or Unique ID..." 
                    />
                    {selectedRecipient && (
                        <p className="text-xs mt-1 text-green-400">Found: {selectedRecipient.name} ({selectedRecipient.category} - Trust Score: {selectedRecipient.trustScore})</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount & Currency</label>
                    <div className="flex rounded-lg border border-cyan-600 overflow-hidden">
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-2/3 bg-gray-800 border-r border-gray-700 p-3 text-white text-xl font-mono focus:ring-cyan-500 focus:border-cyan-500" 
                            placeholder="0.00" 
                            step={currentCurrency.isCrypto ? "0.00000001" : "0.01"}
                        />
                        <select 
                            value={currencyCode} 
                            onChange={e => setCurrencyCode(e.target.value)} 
                            className="w-1/3 bg-gray-700 p-3 text-white text-base appearance-none cursor-pointer"
                        >
                            {availableCurrencies.slice(0, 5).map(c => (
                                <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                            ))}
                            <option disabled>...</option>
                            <option value="XRP">XRP (Ripple)</option>
                            <option value="ETH">ETH (Ethereum)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Rail Selection</label>
                    <select 
                        value={paymentMethod} 
                        onChange={e => setPaymentMethod(e.target.value as PaymentRail)} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer"
                    >
                        <option value="quantumpay">QuantumPay (Instant DLT)</option>
                        <option value="fedwire_hvt">FedWire HVT (High Value)</option>
                        <option value="blockchain_dlt">Public Blockchain (ETH/Polygon)</option>
                        <option value="swift_global">SWIFT Global (Legacy)</option>
                        <option value="ai_contract_escrow">AI Contract Escrow</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Priority</label>
                    <select 
                        value={advancedSettings.priority} 
                        onChange={e => handleAdvancedSettingChange('priority', e.target.value as AdvancedTransactionSettings['priority'])} 
                        className="w-full bg-gray-800 border border-cyan-600 rounded-lg p-3 text-white appearance-none cursor-pointer"
                    >
                        <option value="ultra_quantum">Ultra Quantum (Max Speed)</option>
                        <option value="high">High (Expedited)</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low (Batch Processing)</option>
                    </select>
                </div>
            </div>

            {selectedRecipient && <SecurityAuditDisplay auditResult={securityAudit} />}
            {!selectedRecipient && amount && (
                <div className="p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg text-sm text-yellow-200">
                    Recipient not found in Nexus Registry. Proceeding with external transfer protocols. Security audit will be preliminary.
                </div>
            )}
        </div>
    );
};

    const renderStep2Review = () => {
        const finalRecipient = selectedRecipient || { id: 'external', name: recipientIdentifier };
        const finalAmount = parsedAmount.toFixed(currentCurrency.decimalPlaces);
        
        return (
            <div className="space-y-5">
                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 space-y-3">
                    <h4 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2">Transaction Manifest</h4>
                    <p className="text-gray-300 flex justify-between"><span>Recipient Entity:</span> <span className="font-semibold text-white">{finalRecipient.name}</span></p>
                    <p className="text-gray-300 flex justify-between"><span>Amount:</span> <span className="text-3xl font-extrabold text-green-400">{currentCurrency.symbol}{finalAmount} {currentCurrency.code}</span></p>
                    <p className="text-gray-300 flex justify-between"><span>Settlement Rail:</span> <span className="font-semibold text-white">{paymentMethod}</span></p>
                    <p className="text-gray-300 flex justify-between"><span>Priority Level:</span> <span className="font-semibold text-yellow-400">{advancedSettings.priority.toUpperCase()}</span></p>
                </div>

                <Card title="Advanced Protocol Configuration">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-400">Encryption Standard:</p><p className="text-white">{advancedSettings.dataEncryptionStandard}</p>
                        <p className="text-gray-400">Route Optimization:</p><p className="text-white">{advancedSettings.routeOptimizationPreference}</p>
                        <p className="text-gray-400">Privacy Level:</p><p className="text-white">{advancedSettings.privacyLevel}</p>
                        <p className="text-gray-400">Carbon Offset:</p><p className="text-green-400">{(advancedSettings.carbonOffsetRatio * 100).toFixed(0)}% Applied</p>
                    </div>
                </Card>

                {securityAudit && securityAudit.riskScore > 50 && (
                    <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg">
                        <p className="font-bold text-red-300">High Risk Detected ({securityAudit.riskScore}/100). Biometric Multi-Factor Authentication (MFA) is MANDATORY.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderStep4Confirmation = () => (
        <div className="text-center p-10 bg-gray-800 rounded-xl border-2 border-green-500 shadow-lg">
            <AnimatedCheckmarkIcon />
            <h3 className="text-4xl font-bold text-green-400 mt-6 mb-2">Transaction Committed</h3>
            <p className="text-xl text-white">Transfer of {currentCurrency.symbol}{amount} {currentCurrency.code} successfully processed via {paymentMethod}.</p>
            <p className="text-md text-gray-400 mt-3">Ledger Hash: <span className="font-mono text-sm bg-gray-700 p-1 rounded">{`0x${Math.random().toString(16).substring(2, 18)}...`}</span></p>
            <button 
                onClick={() => { setCurrentStep(1); setAmount(''); setRecipientIdentifier(''); setSecurityAudit(null); }} 
                className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white font-bold transition transform hover:scale-[1.02]"
            >
                Initiate New Nexus Transfer
            </button>
        </div>
    );

    const renderContent = () => {
        switch (currentStep) {
            case 1: return renderStep1Input();
            case 2: return renderStep2Review();
            case 4: return renderStep4Confirmation();
            default: return renderStep1Input();
        }
    };

    const getButtonText = () => {
        if (currentStep === 1) return "Proceed to Review";
        if (currentStep === 2) return `Authorize & Send (${currentCurrency.symbol}${amount})`;
        if (currentStep === 4) return "Continue";
        return "Next Step";
    };

    const isButtonDisabled = !isValidInput && currentStep !== 4;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-3xl border border-gray-700/50">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">Remitrax Basic Form</h1>
            <p className="text-cyan-400 mb-8 border-b border-gray-700 pb-3">Simple Single-Rail Payment Input Form</p>

            {currentStep !== 4 && (
                <div className="flex justify-between mb-8 text-sm font-medium">
                    <div className={`flex-1 text-center py-2 rounded-l-lg ${currentStep >= 1 ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-400'}`}>1. Input Details</div>
                    <div className={`flex-1 text-center py-2 ${currentStep === 2 ? 'bg-cyan-700 text-white' : currentStep > 2 ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-400'}`}>2. Review & Configure</div>
                    <div className={`flex-1 text-center py-2 rounded-r-lg ${currentStep === 3 ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-400'}`}>3. Biometric Authorization</div>
                </div>
            )}

            <Card title={currentStep === 1 ? "Step 1: Transaction Definition" : currentStep === 2 ? "Step 2: Final Review & Protocol Configuration" : ""}>
                {renderContent()}
            </Card>

            {currentStep !== 4 && (
                <div className="flex justify-end gap-4 mt-8">
                    {currentStep === 2 && (
                        <button 
                            onClick={() => setCurrentStep(1)} 
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-semibold transition"
                        >
                            &larr; Back to Input
                        </button>
                    )}
                    
                    <button 
                        onClick={handleSendClick} 
                        disabled={isButtonDisabled || currentStep === 3} 
                        className={`px-8 py-3 rounded-xl text-white font-bold transition transform shadow-lg 
                            ${currentStep === 2 ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'} 
                            disabled:opacity-40 disabled:cursor-not-allowed
                            ${currentStep === 2 ? 'hover:scale-[1.02]' : 'hover:scale-[1.02]'}
                        `}
                    >
                        {getButtonText()}
                    </button>
                </div>
            )}

            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleBiometricSuccess} 
                onClose={() => setShowBiometricModal(false)} 
                amount={amount} 
                recipient={selectedRecipient || recipientIdentifier} 
                paymentMethod={paymentMethod} 
                securityContext="corporate" 
                mfAuthMethods={['face', 'neural_pattern']}
                approvalRequiredBy={securityAudit?.recommendations.length ? ['Compliance Officer'] : undefined}
            />
        </div>
    );
};

export default SendMoneyView;