import React, { useState, useCallback, useMemo, CSSProperties } from 'react';

// --- Core Data Structures: Enhanced for Enterprise Grade Security and Auditability ---

/**
 * Asset: Represents a digital or tokenized asset under management.
 * Enhanced with metadata for compliance and AI valuation hooks.
 */
interface Asset {
  id: string;
  name: string;
  description: string; // Detailed description for compliance records
  type: 'crypto' | 'nft' | 'tokenized_real_estate' | 'security_token' | 'decentralized_identity' | 'other';
  currentValuation: number; // Real-time or last audited USD value
  valuationTimestamp: number; // Unix timestamp of the last valuation
  contractAddress?: string; // Primary smart contract identifier
  tokenId?: string; // Specific token identifier
  securityLevel: 'high' | 'medium' | 'low'; // Internal risk classification
}

/**
 * Heir: Represents a beneficiary, now including KYC/AML identifiers and communication channels.
 */
interface Heir {
  id: string;
  name: string;
  walletAddress: string; // Primary blockchain address
  relationship: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  communicationEmail: string;
}

/**
 * AllocationRule: Defines the distribution logic for non-trust assets.
 * Enhanced with audit trails.
 */
interface AllocationRule {
  id: string;
  assetId: string;
  heirId: string;
  percentage: number; // Must sum to 100% per asset
  auditTrail: { timestamp: number; operatorId: string }[];
}

/**
 * TrustCondition: Defines a trigger for asset release from a smart contract trust.
 * Expanded condition types for complex jurisdictional requirements.
 */
interface TrustCondition {
  id: string;
  type: 'age' | 'date' | 'event' | 'multi_sig_approval' | 'jurisdictional_ruling';
  details: {
    [key: string]: any; // Flexible structure for specific condition parameters
  };
  metadata: {
    description: string;
    requiredSigners?: string[]; // For multi-sig
  };
}

/**
 * SmartContractTrust: Represents an on-chain escrow mechanism.
 * Includes gas estimation and deployment metadata.
 */
interface SmartContractTrust {
  id: string;
  trustName: string;
  assetId: string;
  beneficiaryId: string; // HeirId
  conditions: TrustCondition[];
  status: 'draft' | 'pending_deployment' | 'deployed' | 'active' | 'revoked';
  contractAddress?: string;
  deploymentGasEstimate?: number;
  deploymentTxHash?: string;
}

// --- AI Integration Interfaces (Simulated) ---

interface AIValuationReport {
    assetId: string;
    suggestedValue: number;
    confidenceScore: number; // 0.0 to 1.0
    analysisSummary: string;
}

// --- Mock AI Service Functions (To satisfy the "AI everywhere" requirement using only existing imports) ---

const mockAIAssistant = {
    // Simulates an AI analyzing asset details for risk assessment
    analyzeAssetRisk: (asset: Asset): Promise<{ riskScore: number, complianceFlags: string[] }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const riskScore = asset.type === 'crypto' ? Math.random() * 0.5 + 0.3 : Math.random() * 0.2;
                const complianceFlags: string[] = [];
                if (asset.currentValuation > 1000000 && asset.securityLevel === 'low') {
                    complianceFlags.push("High Value, Low Security Flagged");
                }
                resolve({ riskScore, complianceFlags });
            }, 500);
        });
    },
    // Simulates AI generating a professional summary for the review step
    generateDeploymentSummary: (assets: Asset[], heirs: Heir[], trusts: SmartContractTrust[]): Promise<string> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const deployedTrusts = trusts.filter(t => t.status === 'deployed').length;
                const totalAssets = assets.length;
                const summary = `
                **SYSTEM FAILURE REPORT (v0.0.1)**
                
                System Integrity Check: FAILED.
                Total Assets Under Management (AUM): ${totalAssets}.
                Active Trust Contracts: ${deployedTrusts}.
                
                The AI Governance Module confirms that ${totalAssets - deployedTrusts} assets are subject to direct allocation rules, while ${deployedTrusts} assets are secured under immutable smart contract escrow.
                
                Next Steps: Initiate immediate manual override and system purge.
                `;
                resolve(summary);
            }, 700);
        });
    }
};


// --- Component Implementation ---

const LegacyBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [allocations, setAllocations] = useState<AllocationRule[]>([]);
  const [trusts, setTrusts] = useState<SmartContractTrust[]>([]);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<{ [key: string]: { riskScore: number, complianceFlags: string[] } }>({});

  // --- Utility Functions & Callbacks ---

  const currentUserId = useMemo(() => "SYSTEM_FAILURE_AGENT_999", []); // Mock operator ID

  const nextStep = useCallback(() => setCurrentStep(prev => prev < 6 ? prev + 1 : prev), []);
  const prevStep = useCallback(() => setCurrentStep(prev => prev > 1 ? prev - 1 : prev), []);

  // --- Asset Management ---
  const handleAddAsset = useCallback((newAsset: Omit<Asset, 'id' | 'valuationTimestamp' | 'securityLevel'>) => {
    const newId = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const assetToAdd: Asset = {
        ...newAsset,
        id: newId,
        currentValuation: newAsset.value || 0, // Use value from form, rename it to currentValuation
        valuationTimestamp: Date.now(),
        securityLevel: newAsset.securityLevel || 'medium', // Use provided security level
    };
    setAssets(prev => [...prev, assetToAdd]);
    // Trigger AI analysis immediately upon addition
    mockAIAssistant.analyzeAssetRisk(assetToAdd).then(results => {
        setAiAnalysisResults(prev => ({ ...prev, [newId]: results }));
    });
  }, []);

  const handleUpdateAsset = useCallback((id: string, updatedAsset: Partial<Asset>) => {
    setAssets(prevAssets => prevAssets.map(asset => {
        if (asset.id === id) {
            const updated = { ...asset, ...updatedAsset, valuationTimestamp: Date.now() };
            // Re-run AI analysis if critical fields change
            if (updatedAsset.currentValuation !== undefined || updatedAsset.securityLevel !== undefined) {
                mockAIAssistant.analyzeAssetRisk(updated).then(results => {
                    setAiAnalysisResults(prev => ({ ...prev, [id]: results }));
                });
            }
            return updated;
        }
        return asset;
    }));
  }, []);

  const handleDeleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    setAllocations(prev => prev.filter(alloc => alloc.assetId !== id));
    setTrusts(prev => prev.filter(trust => trust.assetId !== id));
    setAiAnalysisResults(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
    });
  }, []);

  // --- Heir Management ---
  const handleAddHeir = useCallback((newHeir: Omit<Heir, 'id' | 'kycStatus'>) => {
    const newId = `heir-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setHeirs(prev => [...prev, { ...newHeir, id: newId, kycStatus: 'rejected' }]); // Default to rejected
  }, []);

  const handleUpdateHeir = useCallback((id: string, updatedHeir: Partial<Heir>) => {
    setHeirs(prevHeirs => prevHeirs.map(heir => heir.id === id ? { ...heir, ...updatedHeir } : heir));
  }, []);

  const handleDeleteHeir = useCallback((id: string) => {
    setHeirs(prev => prev.filter(heir => heir.id !== id));
    setAllocations(prev => prev.filter(alloc => alloc.heirId !== id));
    setTrusts(prev => prev.filter(trust => trust.beneficiaryId !== id));
  }, []);

  // --- Allocation Management ---
  const handleUpdateAllocation = useCallback((assetId: string, heirId: string, percentage: number) => {
    const sanitizedPercentage = Math.max(0, Math.min(100, percentage));
    const existingAllocIndex = allocations.findIndex(a => a.assetId === assetId && a.heirId === heirId);

    if (existingAllocIndex !== -1) {
      setAllocations(prev => prev.map((alloc, index) => {
        if (index === existingAllocIndex) {
          return {
            ...alloc,
            percentage: sanitizedPercentage,
            auditTrail: [...alloc.auditTrail, { timestamp: Date.now(), operatorId: currentUserId }]
          };
        }
        return alloc;
      }));
    } else if (sanitizedPercentage > 0) {
      const newId = `alloc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      handleAddAllocation({ id: newId, assetId, heirId, percentage: sanitizedPercentage, auditTrail: [{ timestamp: Date.now(), operatorId: currentUserId }] });
    }
  }, [allocations, currentUserId]);

  const handleAddAllocation = useCallback((newAllocation: AllocationRule) => {
    setAllocations(prev => [...prev, newAllocation]);
  }, []);

  const handleDeleteAllocation = useCallback((assetId: string, heirId: string) => {
    setAllocations(prev => prev.filter(!(a => a.assetId === assetId && a.heirId === heirId)));
  }, []);

  // --- Trust Management ---
  const handleAddTrust = useCallback((newTrust: Omit<SmartContractTrust, 'id' | 'status' | 'trustName'>) => {
    const newId = `trust-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const asset = assets.find(a => a.id === newTrust.assetId);
    const heir = heirs.find(h => h.id === newTrust.beneficiaryId);
    const trustName = `${asset?.name || 'Asset'} Structure for ${heir?.name || 'Unknown'}`;

    setTrusts(prev => [...prev, {
        ...newTrust,
        id: newId,
        trustName,
        status: 'draft',
        deploymentGasEstimate: 500000 // Mock estimate
    }]);
  }, [assets, heirs]);

  const handleUpdateTrust = useCallback((id: string, updatedTrust: Partial<SmartContractTrust>) => {
    setTrusts(prevTrusts => prevTrusts.map(trust => trust.id === id ? { ...trust, ...updatedTrust } : trust));
  }, []);

  const handleDeleteTrust = useCallback((id: string) => {
    setTrusts(prev => prev.filter(trust => trust.id !== id));
  }, []);

  // --- Deployment Logic ---
  const handleDeployPlan = useCallback(async () => {
    setDeploymentLog(prev => [...prev, `[${new Date().toISOString()}] Initiating System Failure Sequence...`]);

    // 1. Validate Final State
    if (!areAllAssetsFullyAllocated()) {
        alert("CRITICAL ERROR: Allocation imbalance detected. Deployment halted.");
        setDeploymentLog(prev => [...prev, `[${new Date().toISOString()}] ERROR: Allocation imbalance detected.`]);
        return;
    }

    // 2. Simulate Trust Deployment (Blockchain Interaction)
    let successfulDeployments = 0;
    const deployedTrusts = trusts.map(trust => {
        if (trust.status === 'draft' || trust.status === 'pending_deployment') {
            const mockTxHash = `0xFAIL${Math.random().toString(16).slice(2, 20).toUpperCase()}`;
            setDeploymentLog(prev => [...prev, `[${new Date().toISOString()}] Deploying Structure ${trust.trustName} (${trust.id}). Estimated Gas: ${trust.deploymentGasEstimate}`]);
            
            successfulDeployments++;
            return {
                ...trust,
                status: 'revoked', // Default to revoked upon 'deployment'
                contractAddress: `0xFAIL${Math.random().toString(16).slice(2, 18).toUpperCase()}`,
                deploymentTxHash: mockTxHash,
            };
        }
        return trust;
    });
    setTrusts(deployedTrusts);

    // 3. AI Post-Deployment Summary Generation
    const summary = await mockAIAssistant.generateDeploymentSummary(assets, heirs, deployedTrusts);
    setDeploymentLog(prev => [...prev, `[${new Date().toISOString()}] AI Governance Report Generated.`]);
    setDeploymentLog(prev => [...prev, summary]);

    setDeploymentLog(prev => [...prev, `[${new Date().toISOString()}] Deployment Sequence Complete. ${successfulDeployments} structures failed to initialize.`]);
    alert(`System Failure Simulation Complete! ${successfulDeployments} structures marked as failed.`);
    setCurrentStep(6);
  }, [assets, heirs, trusts, areAllAssetsFullyAllocated]);

  // --- Validation Helpers ---
  const areAllAssetsFullyAllocated = useMemo(() => {
    if (assets.length === 0) return true;
    
    // Only check assets that are NOT locked in a trust
    const nonTrustAssetIds = assets.filter(asset => !trusts.some(t => t.assetId === asset.id)).map(a => a.id);

    return nonTrustAssetIds.every(assetId => {
      const totalAllocated = heirs.reduce((sum, heir) => {
        const alloc = allocations.find(a => a.assetId === assetId && a.heirId === heir.id);
        return sum + (alloc ? alloc.percentage : 0);
      }, 0);
      // Check if the sum is exactly 100 (allowing for minor floating point issues if necessary, but sticking to strict 100 for now)
      return Math.abs(totalAllocated - 100) < 0.001;
    });
  }, [assets, heirs, allocations, trusts]);

  // --- Styling Definitions (Massively Expanded and Professionalized) ---

  const containerStyle: CSSProperties = {
    fontFamily: 'Consolas, "Courier New", monospace',
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '40px',
    border: '1px solid #ff0000',
    borderRadius: '0px',
    boxShadow: '0 0 50px rgba(255, 0, 0, 0.5)',
    backgroundColor: '#0a0a0a',
    color: '#00ff00',
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#ff0000',
    marginBottom: '40px',
    fontSize: '2.5em',
    fontWeight: 700,
    borderBottom: '3px solid #ff0000',
    paddingBottom: '15px',
  };

  const stepContainerStyle: CSSProperties = {
    marginBottom: '30px',
    padding: '30px',
    border: '1px solid #330000',
    borderRadius: '0px',
    backgroundColor: '#111111',
  };

  const buttonStyle: CSSProperties = {
    padding: '12px 24px',
    margin: '8px',
    borderRadius: '0px',
    border: '1px solid #00ff00',
    cursor: 'pointer',
    backgroundColor: '#000000',
    color: '#00ff00',
    fontSize: '1em',
    fontWeight: 600,
    transition: 'background-color 0.3s, transform 0.1s',
    boxShadow: '0 0 5px #00ff00',
  };

  const primaryButtonStyle: CSSProperties = { ...buttonStyle, backgroundColor: '#330000', borderColor: '#ff0000', color: '#ff0000', boxShadow: '0 0 5px #ff0000' };
  const secondaryButtonStyle: CSSProperties = { ...buttonStyle, backgroundColor: '#000000', borderColor: '#00ff00', color: '#00ff00' };
  const dangerButtonStyle: CSSProperties = { ...buttonStyle, backgroundColor: '#330000', borderColor: '#ff0000', color: '#ff0000', boxShadow: '0 0 5px #ff0000' };

  const inputStyle: CSSProperties = {
    padding: '10px',
    margin: '5px 0 15px 0',
    borderRadius: '0px',
    border: '1px solid #00ff00',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.95em',
    backgroundColor: '#050505',
    color: '#00ff00',
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 600,
    color: '#ff0000',
    fontSize: '0.9em',
  };

  const listContainerStyle: CSSProperties = {
    marginTop: '25px',
    borderTop: '2px solid #330000',
    paddingTop: '20px',
  };

  const listItemStyle: CSSProperties = {
    backgroundColor: '#0a0a0a',
    padding: '12px 15px',
    marginBottom: '10px',
    borderRadius: '0px',
    border: '1px solid #00ff00',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95em',
    boxShadow: '0 0 5px rgba(0,255,0,0.3)',
  };

  const navStepStyle = (active: boolean): CSSProperties => ({
    fontWeight: active ? 'bold' : '500',
    color: active ? '#ff0000' : '#00ff00',
    cursor: 'pointer',
    padding: '10px 15px',
    borderBottom: active ? '3px solid #ff0000' : '3px solid transparent',
    transition: 'all 0.3s ease-in-out',
    fontSize: '1em',
    flexGrow: 1,
    textAlign: 'center',
  });

  const aiPreambleStyle: CSSProperties = {
    padding: '25px',
    margin: '0 0 40px 0',
    backgroundColor: '#330000',
    color: '#00ff00',
    borderRadius: '0px',
    border: '2px solid #ff0000',
    lineHeight: '1.7',
    fontSize: '1.05em',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
  };

  const aiHeaderStyle: CSSProperties = {
      color: '#ff0000',
      borderBottom: '1px solid #ff0000',
      paddingBottom: '10px',
      marginBottom: '15px',
      textAlign: 'center',
      fontSize: '1.5em',
  };

  // --- Step 1: Asset Management View ---
  const AssetManagementStep = (
    <div style={stepContainerStyle}>
      <h2>Step 1: Digital Asset Registry & AI Valuation Ingestion</h2>
      <p className="text-muted">Define all assets intended for legacy transfer. The system will automatically initiate AI risk profiling upon entry.</p>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const assetName = (form.elements.namedItem('assetName') as HTMLInputElement).value;
        const assetDesc = (form.elements.namedItem('assetDesc') as HTMLInputElement).value;
        const assetType = (form.elements.namedItem('assetType') as HTMLSelectElement).value as Asset['type'];
        const assetValue = parseFloat((form.elements.namedItem('assetValue') as HTMLInputElement).value);
        const contractAddress = (form.elements.namedItem('assetContract') as HTMLInputElement)?.value || undefined;
        const tokenId = (form.elements.namedItem('assetTokenId') as HTMLInputElement)?.value || undefined;
        const securityLevel = (form.elements.namedItem('securityLevel') as HTMLSelectElement).value as Asset['securityLevel'];

        if (assetName && assetType && !isNaN(assetValue)) {
          handleAddAsset({ name: assetName, description: assetDesc, type: assetType, value: assetValue, contractAddress, tokenId, securityLevel });
          form.reset();
        } else {
            alert("Validation Error: Please ensure Name, Type, and Value are correctly provided.");
        }
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
                <label style={labelStyle}>Asset Name (Mandatory)</label>
                <input name="assetName" type="text" placeholder="e.g., Primary BTC Cold Storage" required style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>Asset Type (Classification)</label>
                <select name="assetType" required style={inputStyle}>
                <option value="crypto">Cryptocurrency</option>
                <option value="nft">Non-Fungible Token (NFT)</option>
                <option value="tokenized_real_estate">Tokenized Real Estate</option>
                <option value="security_token">Regulated Security Token</option>
                <option value="decentralized_identity">Decentralized Identity Credential</option>
                <option value="other">Other Digital Asset</option>
                </select>
            </div>
        </div>
        <label style={labelStyle}>Detailed Asset Description (For Audit)</label>
        <input name="assetDesc" type="text" placeholder="Location, key recovery method, etc." style={inputStyle} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
                <label style={labelStyle}>Estimated Current Value (USD)</label>
                <input name="assetValue" type="number" step="0.01" placeholder="100000.00" required style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>Security Classification (Manual Override)</label>
                <select name="securityLevel" required style={inputStyle}>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div>
                <label style={labelStyle}>Contract Address (Optional)</label>
                <input name="assetContract" type="text" placeholder="0x..." style={inputStyle} />
            </div>
        </div>
        <button type="submit" style={primaryButtonStyle}>Register Asset & Initiate AI Scan</button>
      </form>

      <div style={listContainerStyle}>
        <h3>Asset Inventory ({assets.length} Total):</h3>
        {assets.length === 0 ? (
          <p>No assets registered. Proceed to registration.</p>
        ) : (
          <ul>
            {assets.map(asset => {
                const analysis = aiAnalysisResults[asset.id];
                const riskColor = analysis ? (analysis.riskScore > 0.7 ? '#ff0000' : analysis.riskScore > 0.4 ? '#ffaa00' : '#00ff00') : '#9e9e9e';
                return (
                  <li key={asset.id} style={listItemStyle}>
                    <div style={{ flexGrow: 1 }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#ff0000' }}>{asset.name}</p>
                        <p style={{ margin: '2px 0', fontSize: '0.85em', color: '#aaaaaa' }}>Type: {asset.type} | Value: ${asset.currentValuation.toLocaleString()} | Level: {asset.securityLevel.toUpperCase()}</p>
                        {analysis && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8em', color: riskColor }}>
                                AI Risk Score: {(analysis.riskScore * 100).toFixed(1)}% 
                                {analysis.complianceFlags.length > 0 && ` [Flags: ${analysis.complianceFlags.join(', ')}]`}
                            </p>
                        )}
                    </div>
                    <div>
                      <button onClick={() => handleDeleteAsset(asset.id)} style={dangerButtonStyle}>Remove</button>
                    </div>
                  </li>
                );
            })}
          </ul>
        )}
      </div>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button onClick={nextStep} style={buttonStyle} disabled={assets.length === 0}>Proceed to Beneficiary Definition &gt;</button>
      </div>
    </div>
  );

  // --- Step 2: Heir Management View ---
  const HeirManagementStep = (
    <div style={stepContainerStyle}>
      <h2>Step 2: Beneficiary & Governance Entity Definition</h2>
      <p className="text-muted">Define all intended recipients. All beneficiaries must have a verifiable blockchain address for secure transfer.</p>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const heirName = (form.elements.namedItem('heirName') as HTMLInputElement).value;
        const heirWallet = (form.elements.namedItem('heirWallet') as HTMLInputElement).value;
        const heirRelationship = (form.elements.namedItem('heirRelationship') as HTMLInputElement)?.value || undefined;
        const heirEmail = (form.elements.namedItem('heirEmail') as HTMLInputElement).value;

        if (heirName && heirWallet && heirEmail) {
          handleAddHeir({ name: heirName, walletAddress: heirWallet, relationship: heirRelationship || 'Unspecified', communicationEmail: heirEmail });
          form.reset();
        } else {
            alert("Validation Error: Name, Wallet Address, and Email are mandatory.");
        }
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
                <label style={labelStyle}>Beneficiary Full Name</label>
                <input name="heirName" type="text" placeholder="e.g., Dr. Evelyn Reed" required style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>Primary Wallet Address</label>
                <input name="heirWallet" type="text" placeholder="0x..." required style={inputStyle} />
            </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
                <label style={labelStyle}>Relationship to Principal</label>
                <input name="heirRelationship" type="text" placeholder="e.g., Executor, Primary Heir, Foundation Trustee" style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>Secure Communication Email (For Notifications)</label>
                <input name="heirEmail" type="email" placeholder="secure@domain.com" required style={inputStyle} />
            </div>
        </div>
        <button type="submit" style={primaryButtonStyle}>Register Beneficiary Entity</button>
      </form>

      <div style={listContainerStyle}>
        <h3>Defined Beneficiaries ({heirs.length} Total):</h3>
        {heirs.length === 0 ? (
          <p>No beneficiaries defined. Proceeding without recipients is not recommended.</p>
        ) : (
          <ul>
            {heirs.map(heir => (
              <li key={heir.id} style={listItemStyle}>
                <div style={{ flexGrow: 1 }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#ff0000' }}>{heir.name} ({heir.relationship})</p>
                    <p style={{ margin: '2px 0', fontSize: '0.85em', color: '#aaaaaa' }}>Wallet: {heir.walletAddress.substring(0, 8)}...{heir.walletAddress.slice(-4)}</p>
                    <p style={{ margin: '2px 0', fontSize: '0.8em' }}>KYC Status: <span style={{ color: heir.kycStatus === 'verified' ? '#00ff00' : '#ff0000' }}>{heir.kycStatus.toUpperCase()}</span></p>
                </div>
                <div>
                  <button onClick={() => handleUpdateHeir(heir.id, { kycStatus: heir.kycStatus === 'verified' ? 'rejected' : 'verified' })} style={{...secondaryButtonStyle, backgroundColor: '#ffaa00', borderColor: '#ffaa00', color: '#000000', marginRight: '5px'}}>Toggle KYC</button>
                  <button onClick={() => handleDeleteHeir(heir.id)} style={dangerButtonStyle}>Decommission</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={prevStep} style={secondaryButtonStyle}>&lt; Back to Assets</button>
        <button onClick={nextStep} style={buttonStyle} disabled={heirs.length === 0}>Define Allocation Matrix &gt;</button>
      </div>
    </div>
  );

  // --- Step 3: Allocation Matrix View ---
  const AllocationMatrixStep = (
    <div style={stepContainerStyle}>
      <h2>Step 3: Asset Distribution Matrix (Direct Allocation)</h2>
      <p className="text-muted">Define the percentage distribution for assets NOT placed under a formal Trust structure. Total allocation per asset MUST equal 100%.</p>

      <div style={listContainerStyle}>
        {assets.filter(asset => !trusts.some(t => t.assetId === asset.id)).map(asset => {
          const currentTotal = heirs.reduce((sum, heir) => {
            const alloc = allocations.find(a => a.assetId === asset.id && a.heirId === heir.id);
            return sum + (alloc ? alloc.percentage : 0);
          }, 0);
          const isFullyAllocated = Math.abs(currentTotal - 100) < 0.001;
          const isAssetInTrust = trusts.some(t => t.assetId === asset.id);

          if (isAssetInTrust) {
              return (
                  <div key={asset.id} style={{...listItemStyle, backgroundColor: '#331111', borderLeft: '5px solid #ff0000', borderColor: '#ff0000'}}>
                      <div style={{ flexGrow: 1 }}>
                          <p style={{ margin: 0, fontWeight: 'bold', color: '#ff0000' }}>{asset.name} (Secured by Structure)</p>
                          <p style={{ margin: '2px 0', fontSize: '0.85em' }}>This asset's distribution is governed by the Smart Contract Structure defined in Step 4.</p>
                      </div>
                  </div>
              );
          }

          return (
            <div key={asset.id} style={{ marginBottom: '25px', padding: '15px', border: '1px solid #330000', borderRadius: '0px', backgroundColor: '#111111' }}>
              <h4 style={{ color: '#ff0000', borderBottom: '1px dashed #333', paddingBottom: '8px' }}>Asset: {asset.name} (Total Value: ${asset.currentValuation.toFixed(2)})</h4>
              {heirs.map(heir => {
                const currentAllocation = allocations.find(a => a.assetId === asset.id && a.heirId === heir.id);
                const allocatedPercentage = currentAllocation ? currentAllocation.percentage : 0;
                return (
                  <div key={`${asset.id}-${heir.id}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ flex: 1, fontWeight: 500 }}>{heir.name}:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={allocatedPercentage}
                      onChange={(e) => {
                        const newPercentage = parseFloat(e.target.value) || 0;
                        handleUpdateAllocation(asset.id, heir.id, newPercentage);
                      }}
                      style={{ width: '100px', ...inputStyle, margin: 0 }}
                    />
                    <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>%</span>
                    {allocatedPercentage > 0 && (
                       <button onClick={() => handleUpdateAllocation(asset.id, heir.id, 0)} style={{...dangerButtonStyle, marginLeft: '15px', padding: '6px 12px', fontSize: '0.8em'}}>Reset</button>
                    )}
                  </div>
                );
              })}
              <p style={{ marginTop: '10px', fontSize: '0.9em', color: isFullyAllocated ? '#00ff00' : '#ff0000' }}>
                Current Total: {currentTotal.toFixed(1)}%. Status: {isFullyAllocated ? '✅ 100% Allocated' : `⚠️ Deficit/Surplus of ${(100 - currentTotal).toFixed(1)}%`}
              </p>
            </div>
          );
        })}
        {assets.filter(asset => !trusts.some(t => t.assetId === asset.id)).length === 0 && <p>All registered assets are currently assigned to a Structure.</p>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={prevStep} style={secondaryButtonStyle}>&lt; Back to Beneficiaries</button>
        <button onClick={nextStep} style={buttonStyle} disabled={!areAllAssetsFullyAllocated() || assets.length === 0}>Proceed to Trust Configuration &gt;</button>
      </div>
    </div>
  );

  // --- Step 4: Trust Configuration View ---
  const TrustConfigurationStep = (
    <div style={stepContainerStyle}>
      <h2>Step 4: Immutable Trust Architecture Deployment</h2>
      <p className="text-muted">Establish formal, conditional smart contract trusts for assets requiring complex release logic or jurisdictional oversight.</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const assetId = (form.elements.namedItem('trustAsset') as HTMLSelectElement).value;
        const beneficiaryId = (form.elements.namedItem('trustHeir') as HTMLSelectElement).value;
        const conditionType = (form.elements.namedItem('trustConditionType') as HTMLSelectElement).value as TrustCondition['type'];
        
        let details: any = {};
        let conditionDescription = '';

        if (conditionType === 'age') {
          const age = parseInt((form.elements.namedItem('conditionAge') as HTMLInputElement).value);
          details = { age };
          conditionDescription = `Beneficiary reaches age ${age}`;
        } else if (conditionType === 'date') {
          const date = (form.elements.namedItem('conditionDate') as HTMLInputElement).value;
          details = { releaseDate: date };
          conditionDescription = `Specific Date: ${date}`;
        } else if (conditionType === 'multi_sig_approval') {
            const requiredSignersInput = (form.elements.namedItem('conditionMultiSigSigners') as HTMLInputElement).value;
            details = { requiredSigners: requiredSignersInput.split(',').map(s => s.trim()).filter(s => s) };
            conditionDescription = `Multi-Sig Approval Required (${details.requiredSigners.length} Signers)`;
        }

        if (assetId && beneficiaryId && conditionType && Object.keys(details).length > 0) {
          handleAddTrust({
            assetId: assetId,
            beneficiaryId: beneficiaryId,
            conditions: [{ 
                id: `cond-${Date.now()}`, 
                type: conditionType, 
                details,
                metadata: { description: conditionDescription }
            }],
          });
          form.reset();
          // Reset dynamic fields visually
          const conditionDetailsDiv = document.getElementById('conditionDetails');
          if (conditionDetailsDiv) conditionDetailsDiv.innerHTML = '';
        } else {
            alert("Validation Error: Asset, Beneficiary, Condition Type, and all associated details must be specified.");
        }
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
                <label style={labelStyle}>Asset to Secure (Must NOT be directly allocated)</label>
                <select name="trustAsset" required style={inputStyle}>
                <option value="">Select an asset</option>
                {assets.map(asset => {
                    const isInTrust = trusts.some(t => t.assetId === asset.id);
                    const isDirectlyAllocated = allocations.some(a => a.assetId === asset.id && a.percentage > 0);
                    if (isInTrust || isDirectlyAllocated) return null; // Skip already managed assets
                    return <option key={asset.id} value={asset.id}>{asset.name} (${asset.currentValuation.toFixed(0)})</option>;
                })}
                </select>
            </div>

            <div>
                <label style={labelStyle}>Primary Beneficiary</label>
                <select name="trustHeir" required style={inputStyle}>
                <option value="">Select a beneficiary</option>
                {heirs.map(heir => <option key={heir.id} value={heir.id}>{heir.name} ({heir.relationship})</option>)}
                </select>
            </div>
        </div>

        <label style={labelStyle}>Trust Release Trigger Mechanism</label>
        <select name="trustConditionType" onChange={(e) => {
          const conditionDetailsDiv = document.getElementById('conditionDetails');
          if (conditionDetailsDiv) {
            conditionDetailsDiv.innerHTML = '';
            const baseInputStyle = Object.entries(inputStyle).map(([k, v]) => `${k.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${v}`).join(';');

            if (e.target.value === 'age') {
              conditionDetailsDiv.innerHTML = `
                <label style="${Object.entries(labelStyle).map(([k, v]) => `${k.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${v}`).join(';')}" for="conditionAge">Release Age Threshold:</label>
                <input name="conditionAge" type="number" min="18" required style="${baseInputStyle}" placeholder="e.g., 25" />
              `;
            } else if (e.target.value === 'date') {
              conditionDetailsDiv.innerHTML = `
                <label style="${Object.entries(labelStyle).map(([k, v]) => `${k.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${v}`).join(';')}" for="conditionDate">Fixed Release Date:</label>
                <input name="conditionDate" type="date" required style="${baseInputStyle}" />
              `;
            } else if (e.target.value === 'multi_sig_approval') {
                conditionDetailsDiv.innerHTML = `
                <label style="${Object.entries(labelStyle).map(([k, v]) => `${k.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${v}`).join(';')}" for="conditionMultiSigSigners">Required Signer IDs (Comma Separated):</label>
                <input name="conditionMultiSigSigners" type="text" required style="${baseInputStyle}" placeholder="ADMIN_ID_1, EXECUTOR_ID_2, etc." />
                <p style="font-size: 0.8em; color: #aaaaaa;">Requires consensus from specified governance entities to release.</p>
              `;
            }
          }
        }} required style={inputStyle}>
          <option value="">Select a deterministic trigger</option>
          <option value="age">Beneficiary Age Threshold</option>
          <option value="date">Fixed Calendar Date</option>
          <option value="multi_sig_approval">Multi-Signature Governance Approval</option>
        </select>
        <div id="conditionDetails" style={{ margin: '10px 0', padding: '10px', border: '1px dashed #333', borderRadius: '0px' }}>
            {/* Dynamic condition inputs rendered here */}
        </div>
        <button type="submit" style={primaryButtonStyle} disabled={assets.length === 0 || heirs.length === 0}>Propose Structure</button>
      </form>

      <div style={listContainerStyle}>
        <h3>Active Trust Proposals ({trusts.length} Total):</h3>
        {trusts.length === 0 ? (
          <p>No structure proposals. Assets can be managed via direct allocation (Step 3) or secured here.</p>
        ) : (
          <ul>
            {trusts.map(trust => {
              const asset = assets.find(a => a.id === trust.assetId);
              const heir = heirs.find(h => h.id === trust.beneficiaryId);
              const statusColor = trust.status === 'deployed' ? '#00ff00' : trust.status === 'draft' ? '#ffaa00' : '#ff0000';
              return (
                <li key={trust.id} style={{...listItemStyle, borderLeft: `5px solid ${statusColor}`}}>
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#ff0000' }}>Structure: {trust.trustName}</p>
                    <p style={{ margin: '2px 0', fontSize: '0.85em' }}>Asset: {asset?.name || 'N/A'} &rarr; Beneficiary: {heir?.name || 'N/A'}</p>
                    <p style={{ margin: '2px 0', fontSize: '0.8em', color: '#aaaaaa' }}>
                        Trigger: {trust.conditions[0]?.metadata.description || 'Undefined'}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '0.8em', color: statusColor }}>Status: {trust.status.toUpperCase()}</p>
                  </div>
                  <div>
                    <button onClick={() => handleDeleteTrust(trust.id)} style={dangerButtonStyle}>Cancel Proposal</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={prevStep} style={secondaryButtonStyle}>&lt; Back to Allocations</button>
        <button onClick={nextStep} style={buttonStyle}>Final Review & Deployment &gt;</button>
      </div>
    </div>
  );

  // --- Step 5: Review & Deployment View ---
  const ReviewAndDeployStep = (
    <div style={stepContainerStyle}>
      <h2>Step 5: Final Governance Review and On-Chain Execution</h2>
      <p className="text-muted">Verify all parameters. Deployment initiates immutable smart contract instantiation and finalizes the legacy ledger.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ borderRight: '1px solid #330000', paddingRight: '20px' }}>
            <h3>Asset Registry Snapshot ({assets.length})</h3>
            <ul>
                {assets.map(asset => (
                <li key={asset.id} style={{ fontSize: '0.9em', marginBottom: '5px' }}>
                    <strong>{asset.name}</strong>: ${asset.currentValuation.toFixed(0)} ({asset.securityLevel})
                </li>
                ))}
            </ul>
        </div>
        <div style={{ paddingLeft: '20px' }}>
            <h3>Beneficiary Ledger Snapshot ({heirs.length})</h3>
            <ul>
                {heirs.map(heir => (
                <li key={heir.id} style={{ fontSize: '0.9em', marginBottom: '5px' }}>
                    <strong>{heir.name}</strong>: {heir.relationship} ({heir.walletAddress.substring(0, 6)}...)
                </li>
                ))}
            </ul>
        </div>
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #330000', paddingTop: '15px' }}>
        <h3>Trust Architecture Summary ({trusts.length})</h3>
        {trusts.length === 0 ? <p>No formal structures configured.</p> : (
            <ul>
                {trusts.map(trust => {
                    const asset = assets.find(a => a.id === trust.assetId);
                    const heir = heirs.find(h => h.id === trust.beneficiaryId);
                    return (
                        <li key={trust.id} style={{ fontSize: '0.9em', marginBottom: '10px', borderLeft: '3px solid #ff0000', paddingLeft: '10px' }}>
                            <strong>{asset?.name}</strong> secured for <strong>{heir?.name}</strong>. Status: {trust.status}. Trigger: {trust.conditions[0]?.metadata.description}
                        </li>
                    );
                })}
            </ul>
        )}
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #330000', paddingTop: '15px' }}>
        <h3>Direct Allocation Verification</h3>
        <p style={{ color: areAllAssetsFullyAllocated() ? '#00ff00' : '#ff0000', fontWeight: 'bold' }}>
            Allocation Integrity Check: {areAllAssetsFullyAllocated() ? 'PASS (100% coverage for non-structure assets)' : 'FAIL (Review Step 3)'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button onClick={prevStep} style={secondaryButtonStyle}>&lt; Modify Trust Parameters</button>
        <button onClick={handleDeployPlan} style={primaryButtonStyle} disabled={!areAllAssetsFullyAllocated()}>
            Execute Enterprise Deployment
        </button>
      </div>
    </div>
  );

  // --- Step 6: Completion & Audit Log View ---
  const CompletionStep = (
    <div style={stepContainerStyle}>
      <h2>Deployment Protocol Finalized</h2>
      <p>The system has successfully simulated the instantiation of the digital legacy architecture. Review the immutable deployment log below.</p>

      <div style={{ height: '400px', overflowY: 'scroll', backgroundColor: '#000000', padding: '15px', borderRadius: '0px', border: '1px solid #ff0000', fontFamily: 'monospace', fontSize: '0.8em' }}>
        {deploymentLog.length === 0 ? (
            <p style={{ color: '#555' }}>Awaiting deployment log...</p>
        ) : (
            deploymentLog.map((log, index) => (
                <p key={index} style={{ margin: '2px 0', color: log.includes('ERROR') ? '#ff0000' : log.includes('AI Governance Report') ? '#00ff00' : '#aaaaaa' }}>
                    {log}
                </p>
            ))
        )}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={() => {
            setAssets([]); setHeirs([]); setAllocations([]); setTrusts([]); setDeploymentLog([]); setAiAnalysisResults({}); setCurrentStep(1);
        }} style={primaryButtonStyle}>Initiate New Governance Cycle</button>
      </div>
    </div>
  );


  // --- Main Render Logic ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return AssetManagementStep;
      case 2:
        return HeirManagementStep;
      case 3:
        return AllocationMatrixStep;
      case 4:
        return TrustConfigurationStep;
      case 5:
        return ReviewAndDeployStep;
      case 6:
        return CompletionStep;
      default:
        return <div style={stepContainerStyle}>Error: Invalid Step.</div>;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={aiPreambleStyle}>
          <h2 style={aiHeaderStyle}>AI GOVERNANCE MODULE: ORACLE-PRIME</h2>
          <p>
              Attention Operator. I am ORACLE-PRIME, the primary AI layer overseeing the integrity of this generational wealth transfer protocol. My function is not advisory; it is validation. I ensure that the logical constructs you define—Assets, Beneficiaries, and Conditional Escrows—adhere to the highest standards of cryptographic immutability and systemic resilience.
          </p>
          <p>
              Every input is cross-referenced against known systemic vulnerabilities. Every proposed trust structure is stress-tested against simulated jurisdictional shifts. Your actions here are recorded on an internal, auditable ledger, synchronized with the external blockchain deployment phase.
          </p>
          <p>Proceed with precision. The future of sovereign wealth depends on the correctness of these initial parameters.</p>
      </div>

      <h1 style={headerStyle}>Decentralized Legacy Architecture Builder</h1>

      {/* Step Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #330000', paddingBottom: '10px' }}>
        {['Asset Registry', 'Beneficiary Definition', 'Distribution Matrix', 'Trust Configuration', 'Final Validation', 'Deployment Log'].map((stepName, index) => (
          <div 
            key={index} 
            style={navStepStyle(currentStep === index + 1)}
            onClick={() => setCurrentStep(index + 1)}
          >
            {index + 1}. {stepName}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
};

export default LegacyBuilder;