import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Standard Core Modules ---
// These imports are local mocks for demonstration purposes.

// Basic Transaction Interface
interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  senderId: string;
  timestamp: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

// Basic Biometric Service
const BiometricService = {
  authenticate: async (userId: string): Promise<boolean> => {
    console.log(`BiometricService: Initiating scan for ${userId}...`);
    // Simulate standard processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simple random success for demo
    const success = Math.random() > 0.05; 
    console.log(`BiometricService: Authentication result: ${success}`);
    return success;
  },
};

// Basic Transaction Processor
const TransactionService = {
  processTransaction: async (txData: Omit<Transaction, 'id' | 'timestamp' | 'status'>): Promise<Transaction> => {
    console.log('TransactionService: Receiving transaction request.');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network request

    const newTx: Transaction = {
      id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      amount: txData.amount,
      recipient: txData.recipient,
      senderId: txData.senderId,
      timestamp: Date.now(),
      status: 'CONFIRMED', 
    };

    console.log(`TransactionService: Transaction ${newTx.id} confirmed.`);
    return newTx;
  },
};

// Basic Fee Calculator
const FeeService = {
  calculateFee: (amount: number, method: 'Standard' | 'Instant'): { fee: number, rationale: string } => {
    let baseRate = 0.0001; 
    let multiplier = method === 'Standard' ? 1.0 : 1.5; 

    const fee = amount * baseRate * multiplier;
    const rationale = `Fee calculated based on transfer method (${method}).`;

    return { fee: parseFloat(fee.toFixed(8)), rationale };
  },
};

// --- UI Components ---

// 1. Transaction Status Animation
const TransactionStatusAnimation: React.FC<{ status: 'IDLE' | 'VERIFYING' | 'PROCESSING' | 'COMPLETE' }> = ({ status }) => {
  const [log, setLog] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  const steps = useMemo(() => [
    "Initializing...",
    "Connecting to secure server...",
    "Verifying identity...",
    "Checking account balance...",
    "Processing transaction...",
    "Updating ledger...",
    "Finalizing transfer...",
    "Transaction Complete."
  ], []);

  useEffect(() => {
    if (status === 'IDLE') {
      setLog([]);
      setStep(0);
      return;
    }

    if (status === 'VERIFYING' && step < 4) {
      const timer = setTimeout(() => {
        setLog(prev => [...prev, steps[step]]);
        setStep(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }

    if (status === 'PROCESSING' && step >= 4 && step < 7) {
      const timer = setTimeout(() => {
        setLog(prev => [...prev, steps[step]]);
        setStep(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (status === 'COMPLETE' && step === 7) {
        setLog(prev => [...prev, steps[7]]);
    }

  }, [status, step]);

  const displayLog = log.slice(-5); 

  return (
    <View style={styles.ledgerContainer}>
      <Text style={styles.ledgerTitle}>Transaction Status</Text>
      <View style={styles.ledgerDisplay}>
        {displayLog.map((entry, index) => (
          <Text key={index} style={styles.ledgerEntry}>
            <Ionicons name="checkmark-circle" size={12} color="#00FF00" style={{ marginRight: 5 }} /> {entry}
          </Text>
        ))}
        {status !== 'COMPLETE' && status !== 'IDLE' && (
            <ActivityIndicator size="small" color="#00FF00" style={{ marginTop: 10 }} />
        )}
      </View>
    </View>
  );
};

// 2. Biometric Modal
const BiometricModal: React.FC<{ isVisible: boolean, onConfirm: () => void, onCancel: () => void }> = ({ isVisible, onConfirm, onCancel }) => {
  const [scanStatus, setScanStatus] = useState<'READY' | 'SCANNING' | 'SUCCESS' | 'FAILURE'>('READY');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setScanStatus('READY');
      setScanProgress(0);
    }
  }, [isVisible]);

  const startScan = useCallback(async () => {
    setScanStatus('SCANNING');
    setScanProgress(0);
    
    // Simulate scanning process
    for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setScanProgress(i);
    }

    const success = await BiometricService.authenticate("USER_ID_12345"); 

    if (success) {
      setScanStatus('SUCCESS');
      setTimeout(onConfirm, 800);
    } else {
      setScanStatus('FAILURE');
      Alert.alert("Verification Failed", "Identity verification failed. Please try again.");
      setTimeout(() => setScanStatus('READY'), 2000);
    }
  }, [onConfirm]);

  if (!isVisible) return null;

  const renderContent = () => {
    switch (scanStatus) {
      case 'READY':
        return (
          <>
            <Text style={styles.modalTitle}>Identity Verification Required</Text>
            <Text style={styles.modalSubtitle}>Please verify your identity to proceed.</Text>
            <View style={styles.scanArea}>
              <Ionicons name="scan-circle-outline" size={80} color="#00FF00" />
              <Text style={styles.scanText}>Ready to Scan</Text>
            </View>
            <TouchableOpacity style={styles.scanButton} onPress={startScan}>
              <Text style={styles.scanButtonText}>Start Scan</Text>
            </TouchableOpacity>
          </>
        );
      case 'SCANNING':
        return (
          <>
            <Text style={styles.modalTitle}>Verifying Identity</Text>
            <View style={styles.scanArea}>
              <View style={[styles.scanGrid, { transform: [{ rotate: `${scanProgress * 3.6}deg` }] }]} />
              <Ionicons name="finger-print" size={80} color="#FFD700" />
              <Text style={styles.scanText}>Scanning...</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${scanProgress}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{scanProgress}% Complete</Text>
          </>
        );
      case 'SUCCESS':
        return (
          <>
            <Ionicons name="shield-check-outline" size={80} color="#00FF00" />
            <Text style={styles.modalTitle}>Verified</Text>
            <Text style={styles.modalSubtitle}>Identity confirmed.</Text>
          </>
        );
      case 'FAILURE':
        return (
            <>
                <Ionicons name="close-circle-outline" size={80} color="#FF4500" />
                <Text style={styles.modalTitle}>Failed</Text>
                <Text style={styles.modalSubtitle}>Verification failed. Retrying...</Text>
            </>
        );
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {renderContent()}
        {scanStatus !== 'SCANNING' && scanStatus !== 'SUCCESS' && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


// --- Main Component ---

const SendMoneyView: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'Standard' | 'Instant'>('Standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
  const [ledgerStatus, setLedgerStatus] = useState<'IDLE' | 'VERIFYING' | 'PROCESSING' | 'COMPLETE'>('IDLE');
  const [feeDetails, setFeeDetails] = useState<{ fee: number, rationale: string } | null>(null);

  const screenWidth = Dimensions.get('window').width;

  // Input Validation
  const parsedAmount = useMemo(() => parseFloat(amount), [amount]);
  const isValidInput = useMemo(() => parsedAmount > 0 && recipient.length > 5, [parsedAmount, recipient]);

  // Fee Calculation Effect
  useEffect(() => {
    if (parsedAmount > 0) {
      const details = FeeService.calculateFee(parsedAmount, selectedMethod);
      setFeeDetails(details);
    } else {
      setFeeDetails(null);
    }
  }, [parsedAmount, selectedMethod]);

  const handleSendTransaction = useCallback(async () => {
    if (!isValidInput) {
      Alert.alert("Input Error", "Please enter a valid amount and recipient.");
      return;
    }

    setIsProcessing(true);
    setLedgerStatus('VERIFYING');
    setIsBiometricModalVisible(true);
  }, [isValidInput]);

  const handleBiometricConfirmation = useCallback(async () => {
    setIsBiometricModalVisible(false);
    setLedgerStatus('PROCESSING');

    try {
      // 1. Check Funds
      console.log("System Check: Funds available.");
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. Execute Transaction
      const txData = {
        amount: parsedAmount,
        recipient: recipient,
        senderId: "USER_ID_12345", 
      };
      
      const result = await TransactionService.processTransaction(txData);
      
      setLedgerStatus('COMPLETE');
      
      Alert.alert(
        "Transaction Successful",
        `Sent ${parsedAmount.toFixed(2)} to ${recipient} via ${selectedMethod}.\nID: ${result.id}`
      );

    } catch (error) {
      console.error("Transaction Failure:", error);
      Alert.alert("Error", "The transaction could not be completed.");
      setLedgerStatus('IDLE');
    } finally {
      setIsProcessing(false);
      setAmount('');
      setRecipient('');
      setLedgerStatus('IDLE');
    }
  }, [parsedAmount, recipient, selectedMethod]);

  const handleBiometricCancel = useCallback(() => {
    setIsBiometricModalVisible(false);
    setIsProcessing(false);
    setLedgerStatus('IDLE');
    Alert.alert("Cancelled", "Transaction cancelled by user.");
  }, []);

  const renderMethodSelector = () => (
    <View style={styles.railSelectorContainer}>
      <Text style={styles.sectionSubtitle}>Select Payment Method:</Text>
      <View style={styles.railButtons}>
        <TouchableOpacity
          style={[styles.railButton, selectedMethod === 'Standard' && styles.railButtonActive]}
          onPress={() => setSelectedMethod('Standard')}
        >
          <Ionicons name="cube-outline" size={20} color={selectedMethod === 'Standard' ? '#FFFFFF' : '#00FF00'} />
          <Text style={[styles.railButtonText, selectedMethod === 'Standard' && styles.railButtonTextActive]}>Standard Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.railButton, selectedMethod === 'Instant' && styles.railButtonActive]}
          onPress={() => setSelectedMethod('Instant')}
        >
          <Ionicons name="flash-outline" size={20} color={selectedMethod === 'Instant' ? '#FFFFFF' : '#00FF00'} />
          <Text style={[styles.railButtonText, selectedMethod === 'Instant' && styles.railButtonTextActive]}>Instant Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeeDisplay = () => {
    if (!feeDetails) return null;
    return (
      <View style={styles.feeContainer}>
        <Text style={styles.feeLabel}>Transaction Fee:</Text>
        <Text style={styles.feeAmount}>
          {feeDetails.fee.toFixed(8)} Units
        </Text>
        <Text style={styles.feeRationale}>
          {feeDetails.rationale}
        </Text>
      </View>
    );
  };

  const renderInputSection = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Amount</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#555"
          value={amount}
          onChangeText={text => setAmount(text.replace(/[^0-9.]/g, ''))}
          editable={!isProcessing}
        />
        <Text style={styles.currencySymbol}>USD</Text>
      </View>

      <Text style={[styles.inputLabel, { marginTop: 20 }]}>Recipient</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter recipient..."
          placeholderTextColor="#555"
          value={recipient}
          onChangeText={setRecipient}
          editable={!isProcessing}
        />
        <Ionicons name="person-circle-outline" size={24} color="#00FF00" style={styles.inputIcon} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>
          Send Money
        </Text>
        <Text style={styles.subHeader}>
          Secure Transfer Protocol
        </Text>

        {renderInputSection()}
        {renderMethodSelector()}
        {renderFeeDisplay()}

        <View style={styles.ledgerVisualizationContainer}>
            <TransactionStatusAnimation status={ledgerStatus} />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, !isValidInput || isProcessing ? styles.sendButtonDisabled : styles.sendButtonActive]}
          onPress={handleSendTransaction}
          disabled={!isValidInput || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#000000" size="large" />
          ) : (
            <>
              <Ionicons name="send-outline" size={28} color="#000000" />
              <Text style={styles.sendButtonText}>
                Send Money
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>
            *Transactions are secure and encrypted.
        </Text>

      </ScrollView>

      <BiometricModal
        isVisible={isBiometricModalVisible}
        onConfirm={handleBiometricConfirmation}
        onCancel={handleBiometricCancel}
      />
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A', 
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00FF00', 
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 255, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 30,
  },
  // Input Styling
  inputGroup: {
    marginBottom: 25,
    backgroundColor: '#15152A',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333355',
  },
  inputLabel: {
    fontSize: 14,
    color: '#00FF00',
    marginBottom: 5,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050510',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#00FF0050',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#FFFFFF',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 10,
  },
  inputIcon: {
    marginLeft: 10,
  },
  // Rail Selection
  railSelectorContainer: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#15152A',
    borderLeftWidth: 4,
    borderLeftColor: '#FF4500', 
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  railButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  railButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  railButtonActive: {
    backgroundColor: '#00FF00',
  },
  railButtonText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00FF00',
    textAlign: 'center',
  },
  railButtonTextActive: {
    color: '#0A0A1A',
  },
  // Fee Display
  feeContainer: {
    backgroundColor: '#1E1E3A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  feeLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  feeAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 5,
  },
  feeRationale: {
    fontSize: 11,
    color: '#777777',
    fontStyle: 'italic',
  },
  // Ledger Visualization
  ledgerVisualizationContainer: {
    minHeight: 150,
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#050510',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333355',
  },
  ledgerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 10,
  },
  ledgerDisplay: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#00FF0030',
  },
  ledgerEntry: {
    fontSize: 11,
    color: '#00FF00',
    lineHeight: 18,
  },
  // Send Button
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    elevation: 10,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  sendButtonActive: {
    backgroundColor: '#00FF00',
  },
  sendButtonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A1A',
    marginLeft: 10,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 10,
    color: '#555555',
    marginTop: 30,
  },
  // Modal Styles (Biometric)
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 26, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: screenWidth * 0.85,
    backgroundColor: '#15152A',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 25,
    textAlign: 'center',
  },
  scanArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#050510',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333355',
    position: 'relative',
    overflow: 'hidden',
  },
  scanText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  scanButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  scanButtonText: {
    color: '#0A0A1A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
  },
  cancelButtonText: {
    color: '#FF4500',
    fontSize: 13,
  },
  // Scanning specific elements
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#333355',
    borderRadius: 5,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  progressLabel: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 5,
  },
  scanGrid: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    borderWidth: 1,
    borderColor: '#00FF0080',
    opacity: 0.5,
  }
});

export default SendMoneyView;