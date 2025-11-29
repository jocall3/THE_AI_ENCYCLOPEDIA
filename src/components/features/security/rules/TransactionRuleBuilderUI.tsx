import React, { useState, useCallback } from 'react';

// --- CORE DATA STRUCTURES (EXPANDED FOR ENTERPRISE AI GOVERNANCE) ---

// 1. Condition Definition (Expanded)
interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator: 'AND' | 'OR';
  // AI Context
  confidenceThreshold?: number; // Required for ML/Behavioral fields
  dataSource?: 'REAL_TIME' | 'HISTORICAL' | 'ML_FEATURE_STORE' | 'EXTERNAL_THREAT_FEED';
}

// 2. AI Model Integration
interface AIModelConfig {
  modelId: string;
  version: string;
  riskScoreWeight: number; // How much this model influences the final decision
  isActive: boolean;
  inputFeaturesUsed: string[];
}

// 3. Complex Action Definition (Expanded)
interface ComplexAction {
  type: 'BLOCK' | 'FLAG' | 'ALERT' | 'REQUIRE_2FA' | 'ADAPTIVE_CHALLENGE' | 'DYNAMIC_PRICING_ADJUSTMENT' | 'TEMPORARY_ACCOUNT_LOCK' | 'NOTIFY_COMPLIANCE' | 'DEGRADE_SERVICE' | 'MODEL_RETRAIN_DATA_CAPTURE';
  details: {
    targetUserGroup?: string;
    alertChannel?: 'EMAIL' | 'SMS' | 'SLACK' | 'PAGERDUTY' | 'INTERNAL_QUEUE';
    challengeType?: 'BIOMETRIC' | 'OTP' | 'KBA' | 'AI_DYNAMIC';
    durationMinutes?: number; // For temporary blocks/challenges
    fallbackAction?: 'BLOCK' | 'FLAG' | 'ALLOW';
    lockReasonCode?: string;
    adjustmentPercentage?: string;
    justificationModel?: string;
    // AI Feedback Loop
    modelRetrainTrigger?: boolean; // Should this action trigger a model retraining event?
  };
}

// 4. Rule Definition (Massively Expanded)
interface Rule {
  ruleId: string;
  name: string;
  description: string;
  triggerEvent: string;
  conditions: Condition[];
  action: ComplexAction;
  isEnabled: boolean;
  priorityLevel: number; // 1 (Highest) to 100 (Lowest)
  owner: string;
  lastModified: string;
  // AI/ML Integration Fields
  riskScoreMin: number; // Only trigger if calculated risk score exceeds this
  riskScoreMax: number;
  associatedModels: AIModelConfig[];
  // Governance
  approvalStatus: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  auditLog: string[];
}

// 5. Simulation & Testing Structures
interface SimulationInput {
  testCaseName: string;
  transactionData: Record<string, any>; // Mock transaction data
  expectedOutcome: 'BLOCK' | 'ALLOW' | 'FLAG';
}

interface SimulationResult {
  input: SimulationInput;
  actualOutcome: 'BLOCK' | 'ALLOW' | 'FLAG';
  riskScoreCalculated: number;
  triggeredConditions: string[];
  passed: boolean;
  timestamp: string;
}

// 6. AI Suggestion Structure
interface AISuggestion {
    suggestionId: string;
    type: 'OPTIMIZATION' | 'NEW_COVERAGE' | 'DEPRECATION';
    description: string;
    proposedRule: Partial<Rule>;
    impactEstimate: {
        falsePositivesReduction: number; // Percentage
        fraudCoverageIncrease: number; // Percentage
        estimatedSavings: string; // Monetary value
    };
}

// --- INITIAL STATE DEFINITIONS ---

const initialCondition: Condition = {
  id: String(Date.now()),
  field: '',
  operator: '',
  value: '',
  logicalOperator: 'AND',
  confidenceThreshold: 0.8,
  dataSource: 'REAL_TIME',
};

const initialComplexAction: ComplexAction = {
  type: 'FLAG',
  details: {
    alertChannel: 'SLACK',
    modelRetrainTrigger: false,
  },
};

const initialRuleState: Rule = {
  ruleId: `RULE-${Date.now()}`,
  name: '',
  description: '',
  triggerEvent: '',
  conditions: [{ ...initialCondition }],
  action: initialComplexAction,
  isEnabled: true,
  priorityLevel: 5,
  owner: 'Risk Analyst 1',
  lastModified: new Date().toISOString(),
  riskScoreMin: 0,
  riskScoreMax: 100,
  associatedModels: [],
  approvalStatus: 'DRAFT',
  auditLog: [`Created rule draft on ${new Date().toLocaleString()}`],
};

// --- COMPONENT STATE ---

const TransactionRuleBuilderUI: React.FC = () => {
  const [rule, setRule] = useState<Rule>(initialRuleState);
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'AI_GOVERNANCE' | 'SIMULATION' | 'AUDIT'>('BUILDER');
  const [simulationInputs, setSimulationInputs] = useState<SimulationInput[]>([
    { testCaseName: 'High Value Foreign Transfer', transactionData: { amount: 15000, currency: 'EUR', locationCountry: 'NG', behavioralAnomalyScore: 0.95, velocityCount_24h: 1 }, expectedOutcome: 'BLOCK' },
    { testCaseName: 'Standard Domestic Purchase', transactionData: { amount: 50, currency: 'USD', locationCountry: 'US', behavioralAnomalyScore: 0.1, velocityCount_24h: 3 }, expectedOutcome: 'ALLOW' },
  ]);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [governanceWorkflow, setGovernanceWorkflow] = useState({
    reviewers: ['Alice (Risk)', 'Bob (Compliance)', 'AI Oversight Engine'],
    currentStep: 1,
    totalSteps: 3,
    comments: '',
  });
  const [modelLibrary, setModelLibrary] = useState<AIModelConfig[]>([
    { modelId: 'BEHAVIOR_ANOMALY_V3', version: '3.1.2', riskScoreWeight: 0.4, isActive: true, inputFeaturesUsed: ['deviceType', 'timeOfDay', 'transactionHistory'] },
    { modelId: 'GEO_VELOCITY_CHECK', version: '1.0.5', riskScoreWeight: 0.2, isActive: true, inputFeaturesUsed: ['locationCountry', 'ipAddress'] },
    { modelId: 'MERCHANT_RISK_SCORE', version: '2.5.0', riskScoreWeight: 0.3, isActive: false, inputFeaturesUsed: ['merchantCategory'] },
    { modelId: 'SYNTHETIC_IDENTITY_V4', version: '4.0.1', riskScoreWeight: 0.1, isActive: true, inputFeaturesUsed: ['accountAgeDays', 'emailDomainRisk'] },
  ]);

// --- MASSIVE OPTIONS EXPANSION (100+ FIELDS, 50+ ACTIONS) ---

  const triggerEventOptions = [
    { value: '', label: 'Select Event' },
    { value: 'TRANSACTION_ATTEMPT', label: 'Any Transaction Attempt' },
    { value: 'WITHDRAWAL_REQUEST', label: 'Withdrawal Request' },
    { value: 'DEPOSIT_INITIATED', label: 'Deposit Initiated' },
    { value: 'PURCHASE', label: 'Purchase' },
    { value: 'TRANSFER_OUT', label: 'Transfer Out' },
    { value: 'ACCOUNT_LOGIN_FAILURE', label: 'Login Failure Spike' },
    { value: 'PROFILE_UPDATE_SENSITIVE', label: 'Sensitive Profile Update' },
    { value: 'NEW_DEVICE_REGISTRATION', label: 'New Device Registration' },
    { value: 'API_KEY_ACCESS', label: 'API Key Usage' },
    { value: 'BATCH_PAYMENT_INITIATION', label: 'Batch Payment Initiation' },
    { value: 'EVENT_11', label: 'Card Activation' },
    { value: 'EVENT_12', label: 'Address Change' },
    { value: 'EVENT_13', label: 'Password Reset' },
    { value: 'EVENT_14', label: 'Large Data Export' },
    { value: 'EVENT_15', label: 'High Frequency API Call' },
    { value: 'EVENT_16', label: 'Cross-Border Login' },
    { value: 'EVENT_17', label: 'Wallet Top-Up' },
    { value: 'EVENT_18', label: 'Subscription Cancellation' },
    { value: 'EVENT_19', label: 'Refund Request' },
    { value: 'EVENT_20', label: 'Internal System Alert' },
  ];

  const fieldOptions = [
    { value: '', label: 'Select Field' },
    // Transactional Fields (10)
    { value: 'amount', label: 'Transaction Amount' },
    { value: 'currency', label: 'Currency' },
    { value: 'merchantCategory', label: 'Merchant Category Code (MCC)' },
    { value: 'transactionType', label: 'Transaction Type' },
    { value: 'cardPresent', label: 'Card Present Flag' },
    { value: 'settlementTime', label: 'Settlement Time (Hours)' },
    { value: 'paymentMethodType', label: 'Payment Method Type' },
    { value: 'transactionIdLength', label: 'Transaction ID Length' },
    { value: 'isRecurring', label: 'Is Recurring Transaction' },
    { value: 'fundingSourceType', label: 'Funding Source Type' },
    // Geo/IP Fields (10)
    { value: 'locationCountry', label: 'Location (Country)' },
    { value: 'locationCity', label: 'Location (City)' },
    { value: 'ipAddress', label: 'IP Address' },
    { value: 'ipGeolocationRisk', label: 'IP Geolocation Risk Score (AI)' },
    { value: 'proxyDetection', label: 'Proxy/VPN Detected' },
    { value: 'ipASN', label: 'IP ASN Organization' },
    { value: 'ipDistanceKm', label: 'IP Distance from Home (Km)' },
    { value: 'billingShippingMismatch', label: 'Billing/Shipping Mismatch' },
    { value: 'countryRiskScore', label: 'Country Risk Score (External Feed)' },
    { value: 'isTorExitNode', label: 'Is TOR Exit Node' },
    // Time/Velocity Fields (10)
    { value: 'timeOfDay', label: 'Time of Day (HH:MM)' },
    { value: 'velocityCount_24h', label: 'Tx Count (Last 24h)' },
    { value: 'velocityAmount_7d', label: 'Tx Amount Sum (Last 7d)' },
    { value: 'timeSinceLastTx', label: 'Time Since Last Transaction (Min)' },
    { value: 'velocityCount_1h_unique_merchants', label: 'Tx Count (1h, Unique Merchants)' },
    { value: 'velocityCount_30d_failed', label: 'Failed Tx Count (30d)' },
    { value: 'timeSinceAccountCreation', label: 'Time Since Account Creation (Days)' },
    { value: 'timeSinceLastPasswordReset', label: 'Time Since Last Password Reset (Days)' },
    { value: 'timeSinceLastKycUpdate', label: 'Time Since Last KYC Update (Days)' },
    { value: 'velocityCount_10m_login_attempts', label: 'Login Attempts (10m)' },
    // User/Account Fields (10)
    { value: 'accountAgeDays', label: 'Account Age (Days)' },
    { value: 'userRiskProfile', label: 'User Risk Profile (AI Score)' },
    { value: 'kycStatus', label: 'KYC Verification Status' },
    { value: 'deviceType', label: 'Device Type' },
    { value: 'deviceFingerprintMatch', label: 'Device Fingerprint Match' },
    { value: 'emailDomainRisk', label: 'Email Domain Risk Score' },
    { value: 'averageBalance_30d', label: 'Average Balance (30 Days)' },
    { value: 'isEmployeeAccount', label: 'Is Internal Employee Account' },
    { value: 'accountTier', label: 'Account Tier Level' },
    { value: 'hasActiveSuspension', label: 'Has Active Suspension' },
    // ML/Behavioral Features (10)
    { value: 'behavioralAnomalyScore', label: 'Behavioral Anomaly Score (ML)' },
    { value: 'sessionHijackProbability', label: 'Session Hijack Probability (ML)' },
    { value: 'syntheticIdentityMatch', label: 'Synthetic Identity Match (ML)' },
    { value: 'peerGroupDeviation', label: 'Peer Group Deviation (ML)' },
    { value: 'modelConfidenceScore', label: 'Overall Model Confidence Score' },
    { value: 'xaiFeatureImportance', label: 'XAI Feature Importance (Top Feature)' },
    { value: 'fraudRingMatch', label: 'Known Fraud Ring Match (ML)' },
    { value: 'botDetectionScore', label: 'Bot Detection Score' },
    { value: 'accountTakeoverProbability', label: 'Account Takeover Probability' },
    { value: 'transactionEmbeddingDistance', label: 'Transaction Embedding Distance (ML)' },
    // Placeholder Fields (60 more to reach 100)
    { value: 'FIELD_41', label: 'User Agent String Length' },
    { value: 'FIELD_42', label: 'Browser Language Match' },
    { value: 'FIELD_43', label: 'OS Version Risk' },
    { value: 'FIELD_44', label: 'Payment Instrument Age (Days)' },
    { value: 'FIELD_45', label: 'Card Issuer Country' },
    { value: 'FIELD_46', label: 'BIN Risk Score' },
    { value: 'FIELD_47', label: 'A/B Test Group ID' },
    { value: 'FIELD_48', label: 'Referral Source Type' },
    { value: 'FIELD_49', label: 'Customer Lifetime Value' },
    { value: 'FIELD_50', label: 'Transaction Description Keywords' },
    { value: 'FIELD_51', label: 'Risk Model Output 51' },
    { value: 'FIELD_52', label: 'Risk Model Output 52' },
    { value: 'FIELD_53', label: 'Risk Model Output 53' },
    { value: 'FIELD_54', label: 'Risk Model Output 54' },
    { value: 'FIELD_55', label: 'Risk Model Output 55' },
    { value: 'FIELD_56', label: 'Risk Model Output 56' },
    { value: 'FIELD_57', label: 'Risk Model Output 57' },
    { value: 'FIELD_58', label: 'Risk Model Output 58' },
    { value: 'FIELD_59', label: 'Risk Model Output 59' },
    { value: 'FIELD_60', label: 'Risk Model Output 60' },
    { value: 'FIELD_61', label: 'Risk Model Output 61' },
    { value: 'FIELD_62', label: 'Risk Model Output 62' },
    { value: 'FIELD_63', label: 'Risk Model Output 63' },
    { value: 'FIELD_64', label: 'Risk Model Output 64' },
    { value: 'FIELD_65', label: 'Risk Model Output 65' },
    { value: 'FIELD_66', label: 'Risk Model Output 66' },
    { value: 'FIELD_67', label: 'Risk Model Output 67' },
    { value: 'FIELD_68', label: 'Risk Model Output 68' },
    { value: 'FIELD_69', label: 'Risk Model Output 69' },
    { value: 'FIELD_70', label: 'Risk Model Output 70' },
    { value: 'FIELD_71', label: 'Risk Model Output 71' },
    { value: 'FIELD_72', label: 'Risk Model Output 72' },
    { value: 'FIELD_73', label: 'Risk Model Output 73' },
    { value: 'FIELD_74', label: 'Risk Model Output 74' },
    { value: 'FIELD_75', label: 'Risk Model Output 75' },
    { value: 'FIELD_76', label: 'Risk Model Output 76' },
    { value: 'FIELD_77', label: 'Risk Model Output 77' },
    { value: 'FIELD_78', label: 'Risk Model Output 78' },
    { value: 'FIELD_79', label: 'Risk Model Output 79' },
    { value: 'FIELD_80', label: 'Risk Model Output 80' },
    { value: 'FIELD_81', label: 'Risk Model Output 81' },
    { value: 'FIELD_82', label: 'Risk Model Output 82' },
    { value: 'FIELD_83', label: 'Risk Model Output 83' },
    { value: 'FIELD_84', label: 'Risk Model Output 84' },
    { value: 'FIELD_85', label: 'Risk Model Output 85' },
    { value: 'FIELD_86', label: 'Risk Model Output 86' },
    { value: 'FIELD_87', label: 'Risk Model Output 87' },
    { value: 'FIELD_88', label: 'Risk Model Output 88' },
    { value: 'FIELD_89', label: 'Risk Model Output 89' },
    { value: 'FIELD_90', label: 'Risk Model Output 90' },
    { value: 'FIELD_91', label: 'Risk Model Output 91' },
    { value: 'FIELD_92', label: 'Risk Model Output 92' },
    { value: 'FIELD_93', label: 'Risk Model Output 93' },
    { value: 'FIELD_94', label: 'Risk Model Output 94' },
    { value: 'FIELD_95', label: 'Risk Model Output 95' },
    { value: 'FIELD_96', label: 'Risk Model Output 96' },
    { value: 'FIELD_97', label: 'Risk Model Output 97' },
    { value: 'FIELD_98', label: 'Risk Model Output 98' },
    { value: 'FIELD_99', label: 'Risk Model Output 99' },
    { value: 'FIELD_100', label: 'Risk Model Output 100' },
  ];

  const operatorOptions = {
    // General operators applicable to most types
    DEFAULT: [
      { value: '', label: 'Select Operator' },
      { value: 'EQ', label: 'Equals' },
      { value: 'NEQ', label: 'Does Not Equal' },
      { value: 'IS_NULL', label: 'Is Missing Data' },
      { value: 'IS_NOT_NULL', label: 'Is Present' },
    ],
    // Numeric specific operators
    NUMERIC: [
      { value: 'GT', label: 'Greater Than' },
      { value: 'LT', label: 'Less Than' },
      { value: 'GTE', label: 'Greater Than Or Equal To' },
      { value: 'LTE', label: 'Less Than Or Equal To' },
      { value: 'BETWEEN', label: 'Is Between (Inclusive)' },
      { value: 'OUTSIDE_RANGE', label: 'Is Outside Range' },
    ],
    // String specific operators
    STRING: [
      { value: 'CONTAINS', label: 'Contains Substring' },
      { value: 'NOT_CONTAINS', label: 'Does Not Contain Substring' },
      { value: 'STARTS_WITH', label: 'Starts With' },
      { value: 'ENDS_WITH', label: 'Ends With' },
      { value: 'REGEX_MATCH', label: 'Matches Regex Pattern' },
    ],
    // List/Categorical operators
    LIST: [
      { value: 'IN', label: 'Is one of (List Match)' },
      { value: 'NOT_IN', label: 'Is not one of (List Exclusion)' },
    ],
    // Boolean operators
    BOOLEAN: [
      { value: 'IS_TRUE', label: 'Is True' },
      { value: 'IS_FALSE', label: 'Is False' },
    ],
    // ML/Score operators
    SCORE: [
      { value: 'SCORE_GT', label: 'Score > Threshold' },
      { value: 'SCORE_LT', label: 'Score < Threshold' },
      { value: 'CONFIDENCE_GT', label: 'Confidence > Threshold' },
    ]
  };

  const getOperatorsForField = useCallback((field: string) => {
    let ops = [...operatorOptions.DEFAULT];
    if (field.includes('amount') || field.includes('velocity') || field.includes('AgeDays') || field.includes('Balance') || field.includes('TimeSince') || field.includes('Distance') || field.includes('Length')) {
      ops = [...ops, ...operatorOptions.NUMERIC];
    } else if (field.includes('locationCity') || field.includes('ipAddress') || field.includes('emailDomainRisk') || field.includes('ipASN') || field.includes('transactionDescriptionKeywords') || field.includes('xaiFeatureImportance')) {
      ops = [...ops, ...operatorOptions.STRING];
    } else if (field.includes('currency') || field.includes('merchantCategory') || field.includes('transactionType') || field.includes('locationCountry') || field.includes('deviceType') || field.includes('paymentMethodType') || field.includes('kycStatus') || field.includes('fundingSourceType') || field.includes('cardIssuerCountry') || field.includes('accountTier') || field.includes('referralSourceType')) {
      ops = [...ops, ...operatorOptions.LIST];
    } else if (field.includes('cardPresent') || field.includes('proxyDetection') || field.includes('deviceFingerprintMatch') || field.includes('isRecurring') || field.includes('isTorExitNode') || field.includes('billingShippingMismatch') || field.includes('isEmployeeAccount') || field.includes('hasActiveSuspension')) {
      ops = [...operatorOptions.BOOLEAN];
    } else if (field.includes('Score') || field.includes('Probability') || field.includes('Match') || field.includes('Risk')) {
      ops = [...ops, ...operatorOptions.NUMERIC, ...operatorOptions.SCORE];
    }
    return ops;
  }, [operatorOptions]);

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'BLOCK', label: 'Hard Block Transaction (High Severity)' },
    { value: 'FLAG', label: 'Flag for Manual Review (Medium Severity)' },
    { value: 'ALERT', label: 'Send High Priority Alert' },
    { value: 'REQUIRE_2FA', label: 'Require Additional Verification (2FA)' },
    { value: 'ADAPTIVE_CHALLENGE', label: 'Adaptive Challenge (AI Driven)' },
    { value: 'DYNAMIC_PRICING_ADJUSTMENT', label: 'Adjust Pricing/Fees (Risk Mitigation)' },
    { value: 'TEMPORARY_ACCOUNT_LOCK', label: 'Temporary Account Lockout (1 Hour)' },
    { value: 'NOTIFY_COMPLIANCE', label: 'Notify Compliance Team (SAR Potential)' },
    { value: 'DEGRADE_SERVICE', label: 'Degrade Service Quality (Rate Limit)' },
    { value: 'MODEL_RETRAIN_DATA_CAPTURE', label: 'Capture Data for Model Retraining' },
    { value: 'ACTION_11', label: 'Soft Decline (Retry Allowed)' },
    { value: 'ACTION_12', label: 'Require Biometric Re-Auth' },
    { value: 'ACTION_13', label: 'Force Password Reset' },
    { value: 'ACTION_14', label: 'Geofence Restriction' },
    { value: 'ACTION_15', label: 'Update User Risk Profile (High)' },
    { value: 'ACTION_16', label: 'Send Customer Warning Email' },
    { value: 'ACTION_17', label: 'Initiate KYC Re-Verification' },
    { value: 'ACTION_18', label: 'Route to Dedicated Fraud Queue' },
    { value: 'ACTION_19', label: 'Apply Velocity Limit Override' },
    { value: 'ACTION_20', label: 'Block Specific Payment Instrument' },
    { value: 'ACTION_21', label: 'Action 21: Dynamic Fee Adjustment (0.1%)' },
    { value: 'ACTION_22', label: 'Action 22: Dynamic Fee Adjustment (0.2%)' },
    { value: 'ACTION_23', label: 'Action 23: Dynamic Fee Adjustment (0.3%)' },
    { value: 'ACTION_24', label: 'Action 24: Dynamic Fee Adjustment (0.4%)' },
    { value: 'ACTION_25', label: 'Action 25: Dynamic Fee Adjustment (0.5%)' },
    { value: 'ACTION_26', label: 'Action 26: Dynamic Fee Adjustment (0.6%)' },
    { value: 'ACTION_27', label: 'Action 27: Dynamic Fee Adjustment (0.7%)' },
    { value: 'ACTION_28', label: 'Action 28: Dynamic Fee Adjustment (0.8%)' },
    { value: 'ACTION_29', label: 'Action 29: Dynamic Fee Adjustment (0.9%)' },
    { value: 'ACTION_30', label: 'Action 30: Dynamic Fee Adjustment (1.0%)' },
    { value: 'ACTION_31', label: 'Action 31: Dynamic Fee Adjustment (1.1%)' },
    { value: 'ACTION_32', label: 'Action 32: Dynamic Fee Adjustment (1.2%)' },
    { value: 'ACTION_33', label: 'Action 33: Dynamic Fee Adjustment (1.3%)' },
    { value: 'ACTION_34', label: 'Action 34: Dynamic Fee Adjustment (1.4%)' },
    { value: 'ACTION_35', label: 'Action 35: Dynamic Fee Adjustment (1.5%)' },
    { value: 'ACTION_36', label: 'Action 36: Dynamic Fee Adjustment (1.6%)' },
    { value: 'ACTION_37', label: 'Action 37: Dynamic Fee Adjustment (1.7%)' },
    { value: 'ACTION_38', label: 'Action 38: Dynamic Fee Adjustment (1.8%)' },
    { value: 'ACTION_39', label: 'Action 39: Dynamic Fee Adjustment (1.9%)' },
    { value: 'ACTION_40', label: 'Action 40: Dynamic Fee Adjustment (2.0%)' },
    { value: 'ACTION_41', label: 'Action 41: Dynamic Fee Adjustment (2.1%)' },
    { value: 'ACTION_42', label: 'Action 42: Dynamic Fee Adjustment (2.2%)' },
    { value: 'ACTION_43', label: 'Action 43: Dynamic Fee Adjustment (2.3%)' },
    { value: 'ACTION_44', label: 'Action 44: Dynamic Fee Adjustment (2.4%)' },
    { value: 'ACTION_45', label: 'Action 45: Dynamic Fee Adjustment (2.5%)' },
    { value: 'ACTION_46', label: 'Action 46: Dynamic Fee Adjustment (2.6%)' },
    { value: 'ACTION_47', label: 'Action 47: Dynamic Fee Adjustment (2.7%)' },
    { value: 'ACTION_48', label: 'Action 48: Dynamic Fee Adjustment (2.8%)' },
    { value: 'ACTION_49', label: 'Action 49: Dynamic Fee Adjustment (2.9%)' },
    { value: 'ACTION_50', label: 'Action 50: Dynamic Fee Adjustment (3.0%)' },
  ];

// --- CORE HANDLERS ---

  const handleRuleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'isEnabled') {
      setRule((prev) => ({ ...prev, isEnabled: (e.target as HTMLInputElement).checked }));
    } else if (name === 'priorityLevel' || name === 'riskScoreMin' || name === 'riskScoreMax') {
      setRule((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setRule((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleActionTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ComplexAction['type'];
    setRule((prev) => ({
      ...prev,
      action: {
        type: newType,
        details: {}, // Reset details based on new type for simplicity
      },
    }));
  }, []);

  const handleActionDetailChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRule((prev) => ({
      ...prev,
      action: {
        ...prev.action,
        details: {
          ...prev.action.details,
          [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        },
      },
    }));
  }, []);

  const handleConditionChange = useCallback((index: number, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setRule((prev) => {
      const newConditions = [...prev.conditions];
      let updatedCondition = { ...newConditions[index], [name]: value };

      // Reset operator/value if field changes
      if (name === 'field') {
        updatedCondition.operator = '';
        updatedCondition.value = '';
        updatedCondition.confidenceThreshold = updatedCondition.field.includes('Score') || updatedCondition.field.includes('Probability') ? 0.8 : undefined;
      }

      newConditions[index] = updatedCondition;
      return { ...prev, conditions: newConditions };
    });
  }, []);

  const handleConditionConfidenceChange = useCallback((index: number, value: string) => {
    setRule((prev) => {
      const newConditions = [...prev.conditions];
      newConditions[index] = { ...newConditions[index], confidenceThreshold: Number(value) };
      return { ...prev, conditions: newConditions };
    });
  }, []);

  const addCondition = useCallback(() => {
    setRule((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { ...initialCondition, id: String(Date.now()) }],
    }));
  }, []);

  const removeCondition = useCallback((index: number) => {
    setRule((prev) => {
      const newConditions = prev.conditions.filter((_, i) => i !== index);
      if (newConditions.length === 0) {
        return { ...prev, conditions: [{ ...initialCondition, id: String(Date.now()) }] };
      }
      return { ...prev, conditions: newConditions };
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rule.approvalStatus === 'APPROVED') {
        alert('Rule is already approved. Create a new version.');
        return;
    }
    setRule(prev => ({
        ...prev,
        approvalStatus: 'PENDING_REVIEW',
        auditLog: [...prev.auditLog, `Submitted for review by ${prev.owner} on ${new Date().toLocaleString()}`]
    }));
    console.log('Submitting Rule for Governance Review:', JSON.stringify(rule, null, 2));
    alert('Rule submitted for governance review.');
  };

// --- AI GOVERNANCE & MODEL MANAGEMENT LOGIC (Simulated) ---

  const handleModelToggle = useCallback((modelId: string) => {
    setRule(prevRule => {
      const existingIndex = prevRule.associatedModels.findIndex(m => m.modelId === modelId);
      let newModels = [...prevRule.associatedModels];

      if (existingIndex !== -1) {
        // Remove model if already associated
        newModels = newModels.filter(m => m.modelId !== modelId);
      } else {
        // Add model
        const modelToAdd = modelLibrary.find(m => m.modelId === modelId);
        if (modelToAdd) {
          newModels.push(modelToAdd);
        }
      }
      return { ...prevRule, associatedModels: newModels };
    });
  }, [modelLibrary]);

  const handleSimulateRule = useCallback(() => {
    // Simulate running the rule against all test cases
    const results: SimulationResult[] = simulationInputs.map(input => {
        // Extremely simplified simulation logic based on risk score and condition count
        const riskScore = Math.floor(Math.random() * 100);
        const triggered = rule.conditions.length > 0 && Math.random() > 0.3;
        let actualOutcome: 'BLOCK' | 'ALLOW' | 'FLAG' = 'ALLOW';

        if (riskScore > rule.riskScoreMin && triggered) {
            actualOutcome = rule.action.type === 'BLOCK' ? 'BLOCK' : 'FLAG';
        } else if (riskScore > 80) {
            actualOutcome = 'FLAG';
        }

        const passed = actualOutcome === input.expectedOutcome;

        return {
            input,
            actualOutcome,
            riskScoreCalculated: riskScore,
            triggeredConditions: triggered ? [rule.conditions[0].field] : [],
            passed,
            timestamp: new Date().toISOString(),
        };
    });
    setSimulationResults(results);
  }, [rule, simulationInputs]);

  const handleAddTestCase = useCallback(() => {
    const newCase: SimulationInput = {
        testCaseName: `Test Case ${simulationInputs.length + 1}`,
        transactionData: {
            amount: 500,
            currency: 'USD',
            locationCountry: 'US',
            behavioralAnomalyScore: 0.9,
        },
        expectedOutcome: 'FLAG',
    };
    setSimulationInputs(prev => [...prev, newCase]);
  }, [simulationInputs.length]);

  const handleTestCaseDataChange = useCallback((index: number, key: string, value: any) => {
    setSimulationInputs(prev => {
        const newInputs = [...prev];
        newInputs[index] = {
            ...newInputs[index],
            transactionData: {
                ...newInputs[index].transactionData,
                [key]: value,
            }
        };
        return newInputs;
    });
  }, []);

  const handleFetchAISuggestions = useCallback(() => {
    // Simulate fetching AI-driven rule suggestions based on current rule gaps
    const suggestions: AISuggestion[] = [
        {
            suggestionId: 'AI-OPT-001',
            type: 'OPTIMIZATION',
            description: 'High false positive rate detected for transactions under $500 originating from trusted IPs. Suggest raising the amount threshold.',
            proposedRule: {
                conditions: [{ ...initialCondition, field: 'amount', operator: 'GTE', value: '550' }],
            },
            impactEstimate: {
                falsePositivesReduction: 15,
                fraudCoverageIncrease: 0,
                estimatedSavings: '$15,000/month',
            },
        },
        {
            suggestionId: 'AI-NEW-002',
            type: 'NEW_COVERAGE',
            description: 'Uncovered fraud pattern: high velocity of small deposits followed by immediate withdrawal to a new crypto wallet. Suggest adding a velocity condition.',
            proposedRule: {
                triggerEvent: 'DEPOSIT_INITIATED',
                conditions: [
                    { ...initialCondition, field: 'velocityCount_24h', operator: 'GT', value: '10' },
                    { ...initialCondition, field: 'timeSinceLastTx', operator: 'LT', value: '5', logicalOperator: 'AND' },
                ],
                action: { type: 'TEMPORARY_ACCOUNT_LOCK', details: { durationMinutes: 60, lockReasonCode: 'AI_VELOCITY_BREACH' } },
            },
            impactEstimate: {
                falsePositivesReduction: 0,
                fraudCoverageIncrease: 8,
                estimatedSavings: '$45,000/month',
            },
        },
    ];
    setAiSuggestions(suggestions);
  }, []);

// --- RENDER HELPERS ---

  const renderConditionValueInput = useCallback((condition: Condition, index: number) => {
    let placeholder = 'Enter value';
    let inputType: React.HTMLInputTypeAttribute = 'text';
    let isRequired = true;

    const isBooleanOperator = operatorOptions.BOOLEAN.some(op => op.value === condition.operator) || condition.operator === 'IS_NULL' || condition.operator === 'IS_NOT_NULL';
    const isRangeOperator = condition.operator === 'BETWEEN' || condition.operator === 'OUTSIDE_RANGE';

    if (isBooleanOperator) {
        return null;
    }

    switch (condition.field) {
      case 'amount':
      case 'velocityCount_24h':
      case 'velocityAmount_7d':
      case 'accountAgeDays':
      case 'riskScoreMin':
      case 'riskScoreMax':
      case 'userRiskProfile':
      case 'ipGeolocationRisk':
      case 'behavioralAnomalyScore':
      case 'sessionHijackProbability':
      case 'timeSinceLastTx':
      case 'ipDistanceKm':
        inputType = 'number';
        placeholder = isRangeOperator ? 'Min,Max (e.g., 100,500)' : 'e.g., 100.00';
        break;
      case 'timeOfDay':
        inputType = 'time';
        placeholder = 'e.g., 14:30';
        break;
      case 'merchantCategory':
      case 'currency':
      case 'locationCountry':
      case 'deviceType':
      case 'paymentMethodType':
      case 'kycStatus':
        placeholder = 'Comma-separated list (e.g., US, CA, MX)';
        break;
      case 'ipAddress':
        placeholder = 'IP address, CIDR, or list (e.g., 192.168.1.1/24)';
        break;
      default:
        placeholder = isRangeOperator ? 'Value 1, Value 2' : 'Enter specific value or list';
        break;
    }

    return (
      <input
        type={inputType}
        name="value"
        value={condition.value}
        onChange={(e) => handleConditionChange(index, e)}
        placeholder={placeholder}
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        required={isRequired}
      />
    );
  }, [handleConditionChange, operatorOptions]);

  const renderAIConditionControls = useCallback((condition: Condition, index: number) => {
    if (condition.field.includes('Score') || condition.field.includes('Probability') || condition.field.includes('Match')) {
        return (
            <div className="flex-1 min-w-[150px] mt-1">
                <label className="block text-xs font-medium text-gray-500">AI Confidence Threshold (0.0 - 1.0)</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    name="confidenceThreshold"
                    value={condition.confidenceThreshold || 0.8}
                    onChange={(e) => handleConditionConfidenceChange(index, e.target.value)}
                    placeholder="0.8"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                    required
                />
            </div>
        );
    }
    return null;
  }, [handleConditionConfidenceChange]);

  const renderComplexActionDetails = useCallback(() => {
    const actionType = rule.action.type;
    const details = rule.action.details;

    const renderInput = (name: string, label: string, type: string = 'text', placeholder: string = '', options?: { value: string, label: string }[]) => (
      <div className="mb-3">
        <label htmlFor={`action-detail-${name}`} className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'select' && options ? (
          <select
            id={`action-detail-${name}`}
            name={name}
            value={details[name] || ''}
            onChange={handleActionDetailChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
          >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : type === 'checkbox' ? (
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id={`action-detail-${name}`}
              name={name}
              checked={!!details[name]}
              onChange={handleActionDetailChange}
              className="h-4 w-4 text-purple-600 border-gray-300 rounded"
            />
            <label htmlFor={`action-detail-${name}`} className="ml-2 text-sm text-gray-700">Enable</label>
          </div>
        ) : (
          <input
            type={type}
            id={`action-detail-${name}`}
            name={name}
            value={details[name] || ''}
            onChange={handleActionDetailChange}
            placeholder={placeholder}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        )}
      </div>
    );

    switch (actionType) {
      case 'ALERT':
        return (
          <>
            {renderInput('alertChannel', 'Notification Channel', 'select', '', [
              { value: 'EMAIL', label: 'Email' },
              { value: 'SMS', label: 'SMS' },
              { value: 'SLACK', label: 'Slack (High Priority)' },
              { value: 'PAGERDUTY', label: 'PagerDuty (Critical)' },
              { value: 'INTERNAL_QUEUE', label: 'Internal Review Queue' },
            ])}
            {renderInput('targetUserGroup', 'Target Review Group', 'text', 'e.g., Tier 1 Fraud Analysts')}
          </>
        );
      case 'ADAPTIVE_CHALLENGE':
        return (
          <>
            {renderInput('challengeType', 'Primary Challenge Type', 'select', '', [
              { value: 'BIOMETRIC', label: 'Biometric Scan' },
              { value: 'OTP', label: 'One-Time Password' },
              { value: 'KBA', label: 'Knowledge-Based Authentication' },
              { value: 'AI_DYNAMIC', label: 'AI Dynamic Question Set' },
            ])}
            {renderInput('fallbackAction', 'If Challenge Fails', 'select', '', [
                { value: 'BLOCK', label: 'Block Transaction' },
                { value: 'FLAG', label: 'Flag for Review' },
                { value: 'ALLOW', label: 'Allow (Log Only)' },
            ])}
          </>
        );
      case 'TEMPORARY_ACCOUNT_LOCK':
        return (
          <>
            {renderInput('durationMinutes', 'Lock Duration (Minutes)', 'number', '60')}
            {renderInput('lockReasonCode', 'Reason Code', 'text', 'VELOCITY_BREACH_001')}
          </>
        );
      case 'DYNAMIC_PRICING_ADJUSTMENT':
        return (
            <>
                {renderInput('adjustmentPercentage', 'Fee Increase (%)', 'number', '5.0')}
                {renderInput('justificationModel', 'Justification Model ID', 'text', 'RISK_PRICING_V1')}
            </>
        );
      case 'MODEL_RETRAIN_DATA_CAPTURE':
        return (
            <>
                {renderInput('modelRetrainTrigger', 'Trigger Retraining Pipeline', 'checkbox')}
                <p className="text-xs text-gray-500 mt-1">This action ensures the transaction data is prioritized for the next ML model update cycle.</p>
            </>
        );
      default:
        return <p className="text-sm text-gray-500">No specific configuration required for this action type.</p>;
    }
  }, [rule.action.type, rule.action.details, handleActionDetailChange]);

// --- RENDER SECTIONS ---

  const renderRuleDetailsSection = () => (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">1. Core Rule Definition</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Rule Name (Unique Identifier)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={rule.name}
            onChange={handleRuleChange}
            placeholder="e.g., High-Risk Geo Velocity Block V2.1"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            required
          />
        </div>
        <div>
          <label htmlFor="priorityLevel" className="block text-sm font-medium text-gray-700">Execution Priority (1=Highest)</label>
          <input
            type="number"
            id="priorityLevel"
            name="priorityLevel"
            value={rule.priorityLevel}
            onChange={handleRuleChange}
            min="1"
            max="100"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="triggerEvent" className="block text-sm font-medium text-gray-700">Primary Trigger Event</label>
          <select
            id="triggerEvent"
            name="triggerEvent"
            value={rule.triggerEvent}
            onChange={handleRuleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
            required
          >
            {triggerEventOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Rule Owner/Department</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={rule.owner}
            onChange={handleRuleChange}
            placeholder="e.g., Risk Operations Team 3"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description & Business Justification</label>
        <textarea
          id="description"
          name="description"
          value={rule.description}
          onChange={handleRuleChange}
          rows={4}
          placeholder="Explain the specific fraud vector or compliance requirement this rule addresses. This is crucial for auditability."
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
    </div>
  );

  const renderConditionsSection = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
      <h2 className="text-2xl font-bold mb-6 text-purple-800 border-b pb-2">2. Conditional Logic Engine (If/Then)</h2>
      <p className="text-sm text-gray-600 mb-4">Define the precise criteria using advanced transactional, behavioral, and ML features.</p>

      {rule.conditions.map((condition, index) => (
        <div key={condition.id} className="relative mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50 transition duration-300 hover:shadow-md">
          <div className="flex flex-wrap items-start gap-4">
            {/* Logical Operator (If not first) */}
            {index > 0 && (
              <div className="w-full md:w-auto flex-shrink-0">
                <label htmlFor={`logical-operator-${condition.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Combine With Previous</label>
                <select
                  id={`logical-operator-${condition.id}`}
                  name="logicalOperator"
                  value={rule.conditions[index - 1].logicalOperator} // Operator applies to the previous condition linking to this one
                  onChange={(e) => handleConditionChange(index - 1, e)}
                  className="block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white font-bold text-sm"
                >
                  <option value="AND">AND (All must be true)</option>
                  <option value="OR">OR (Any can be true)</option>
                </select>
              </div>
            )}

            {/* Field Selection */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor={`field-${condition.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Feature Field</label>
              <select
                id={`field-${condition.id}`}
                name="field"
                value={condition.field}
                onChange={(e) => handleConditionChange(index, e)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                required
              >
                {fieldOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Operator Selection */}
            <div className="flex-1 min-w-[150px]">
              <label htmlFor={`operator-${condition.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Operator</label>
              <select
                id={`operator-${condition.id}`}
                name="operator"
                value={condition.operator}
                onChange={(e) => handleConditionChange(index, e)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                required
              >
                {getOperatorsForField(condition.field).map((option) => (
                  <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Value Input */}
            {renderConditionValueInput(condition, index) && (
              <div className="flex-2 min-w-[250px]">
                <label htmlFor={`value-${condition.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Target Value(s)</label>
                {renderConditionValueInput(condition, index)}
              </div>
            )}

            {/* AI Confidence Control */}
            {renderAIConditionControls(condition, index)}

            {/* Remove Button */}
            {rule.conditions.length > 1 && (
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="flex-shrink-0 mt-6 p-2 h-10 w-10 text-red-600 hover:bg-red-100 rounded-full transition duration-150"
                title="Remove Condition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addCondition}
        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Advanced Condition Group
      </button>
    </div>
  );

  const renderActionSection = () => (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">3. Action & Mitigation Strategy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700">Primary Action When Conditions Are Met:</label>
          <select
            id="action"
            name="action"
            value={rule.action.type}
            onChange={handleActionTypeChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white transition duration-150"
            required
          >
            {actionOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="riskScoreMin" className="block text-sm font-medium text-gray-700">Minimum Required Risk Score (0-100)</label>
          <input
            type="number"
            id="riskScoreMin"
            name="riskScoreMin"
            value={rule.riskScoreMin}
            onChange={handleRuleChange}
            min="0"
            max="100"
            placeholder="0"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">The rule only executes if the combined ML risk score meets this threshold AND conditions are met.</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white border border-dashed border-green-300 rounded-lg">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Action Configuration Details</h3>
        {renderComplexActionDetails()}
      </div>

      <div className="mt-6 flex items-center p-3 bg-white rounded-lg shadow-inner">
        <input
          type="checkbox"
          id="isEnabled"
          name="isEnabled"
          checked={rule.isEnabled}
          onChange={handleRuleChange}
          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="isEnabled" className="ml-3 block text-base font-medium text-gray-700 cursor-pointer">
          Enable Rule Immediately Upon Approval
        </label>
      </div>
    </div>
  );

  const renderAIGovernanceTab = () => (
    <div className="space-y-8">
      {/* AI Model Association */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-300">
        <h3 className="text-xl font-bold text-purple-700 mb-4">AI Model Association & Weighting</h3>
        <p className="text-sm text-gray-600 mb-4">Select which active ML models contribute to the overall risk score evaluated by this rule.</p>
        <div className="space-y-4">
          {modelLibrary.map(model => {
            const isAssociated = rule.associatedModels.some(m => m.modelId === model.modelId);
            return (
              <div key={model.modelId} className={`flex items-center justify-between p-3 rounded-lg transition duration-150 ${isAssociated ? 'bg-purple-50 border-l-4 border-purple-500' : 'bg-gray-50 border'}`}>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{model.modelId} (v{model.version})</p>
                  <p className="text-xs text-gray-500">Features: {model.inputFeaturesUsed.join(', ')}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {isAssociated && (
                    <div className="w-24">
                      <label className="block text-xs text-gray-500">Weight</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rule.associatedModels.find(m => m.modelId === model.modelId)?.riskScoreWeight || model.riskScoreWeight}
                        onChange={(e) => {
                            const weight = Number(e.target.value);
                            setRule(prev => ({
                                ...prev,
                                associatedModels: prev.associatedModels.map(m => m.modelId === model.modelId ? { ...m, riskScoreWeight: weight } : m)
                            }));
                        }}
                        className="w-full p-1 border rounded text-sm"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleModelToggle(model.modelId)}
                    className={`px-3 py-1 text-sm rounded transition duration-150 ${isAssociated ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  >
                    {isAssociated ? 'Remove' : 'Associate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Rule Suggestions */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-300">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold text-blue-700">AI Rule Optimization Suggestions</h3>
            <button
                type="button"
                onClick={handleFetchAISuggestions}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
            >
                Analyze & Fetch Suggestions
            </button>
        </div>
        {aiSuggestions.length === 0 ? (
            <p className="text-gray-500">Click 'Analyze & Fetch Suggestions' to run the AI Governance Engine against historical performance data and identify optimization opportunities.</p>
        ) : (
            <div className="space-y-4">
                {aiSuggestions.map(suggestion => (
                    <div key={suggestion.suggestionId} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-blue-800">{suggestion.type === 'OPTIMIZATION' ? 'Optimization Recommended' : 'New Coverage Gap'}</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${suggestion.type === 'OPTIMIZATION' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                {suggestion.suggestionId}
                            </span>
                        </div>
                        <p className="text-sm mt-1 mb-2">{suggestion.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-700 border-t pt-2">
                            <div><span className="font-medium">FP Reduction:</span> {suggestion.impactEstimate.falsePositivesReduction}%</div>
                            <div><span className="font-medium">Fraud Coverage:</span> +{suggestion.impactEstimate.fraudCoverageIncrease}%</div>
                            <div><span className="font-medium">Est. Savings:</span> {suggestion.impactEstimate.estimatedSavings}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                // Simulate applying the suggestion
                                setRule(prev => ({
                                    ...prev,
                                    conditions: suggestion.proposedRule.conditions || prev.conditions,
                                    action: suggestion.proposedRule.action || prev.action,
                                    description: `${prev.description} [AI Suggested Update: ${suggestion.description}]`
                                }));
                                alert(`Suggestion ${suggestion.suggestionId} applied to rule draft.`);
                            }}
                            className="mt-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Apply Suggestion to Draft
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );

  const renderSimulationTab = () => (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-300">
        <h3 className="text-xl font-bold text-orange-700 mb-4 border-b pb-2">Rule Simulation & Backtesting</h3>
        <p className="text-sm text-gray-600 mb-4">Test the rule logic against predefined or custom transaction scenarios before deployment.</p>

        <div className="flex justify-end space-x-4 mb-4">
            <button
                type="button"
                onClick={handleAddTestCase}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
                + Add Custom Test Case
            </button>
            <button
                type="button"
                onClick={handleSimulateRule}
                disabled={simulationInputs.length === 0}
                className="px-6 py-2 text-lg bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
                Run Simulation ({simulationInputs.length} Cases)
            </button>
        </div>

        {/* Test Case Input Management */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-2 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-700">Defined Test Cases:</h4>
            {simulationInputs.map((input, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md bg-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{input.testCaseName}</span>
                        <select
                            value={input.expectedOutcome}
                            onChange={(e) => setSimulationInputs(prev => {
                                const newInputs = [...prev];
                                newInputs[index].expectedOutcome = e.target.value as 'BLOCK' | 'ALLOW' | 'FLAG';
                                return newInputs;
                            })}
                            className="text-xs p-1 border rounded"
                        >
                            <option value="ALLOW">Expect ALLOW</option>
                            <option value="FLAG">Expect FLAG</option>
                            <option value="BLOCK">Expect BLOCK</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        {Object.entries(input.transactionData).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-gray-500">{key}</label>
                                <input
                                    type={typeof value === 'number' ? 'number' : 'text'}
                                    value={value as any}
                                    onChange={(e) => handleTestCaseDataChange(index, key, e.target.value)}
                                    className="w-full p-1 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Simulation Results Display */}
      {simulationResults.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-300">
          <h3 className="text-xl font-bold text-green-700 mb-4">Simulation Results Summary</h3>
          <div className="grid grid-cols-4 gap-4 mb-4 text-center font-semibold">
            <div className="p-2 bg-green-100 rounded">Passed: {simulationResults.filter(r => r.passed).length}</div>
            <div className="p-2 bg-red-100 rounded">Failed: {simulationResults.filter(r => !r.passed).length}</div>
            <div className="p-2 bg-blue-100 rounded">Avg Risk Score: {(simulationResults.reduce((sum, r) => sum + r.riskScoreCalculated, 0) / simulationResults.length).toFixed(2)}</div>
            <div className="p-2 bg-yellow-100 rounded">Total Cases: {simulationResults.length}</div>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Case</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Expected</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actual</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Risk Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {simulationResults.map((result, index) => (
                  <tr key={index} className={result.passed ? 'hover:bg-green-50' : 'bg-red-50 hover:bg-red-100'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{result.input.testCaseName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.input.expectedOutcome}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-700">{result.actualOutcome}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.riskScoreCalculated}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderAuditTab = () => (
    <div className="space