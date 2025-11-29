import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccessMetadata, PlaidLinkOnExitMetadata } from 'react-plaid-link';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spinner,
    Text,
    VStack,
    HStack,
    Progress,
    Alert,
    AlertIcon,
    Box,
    Icon,
    useToast,
    Flex,
    Heading,
    Badge,
    Tooltip,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    useBreakpointValue,
} from '@chakra-ui/react';
import {
    FiLink,
    FiZap,
    FiShield,
    FiCpu,
    FiTrendingUp,
    FiUserCheck,
    FiAlertTriangle,
    FiCheckCircle,
    FiXCircle,
    FiInfo,
    FiSettings,
    FiChevronRight,
    FiChevronLeft,
    FiRefreshCw,
} from 'react-icons/fi';

// --- Core Sovereign AI Financial System Constants and Types ---

/**
 * Defines the operational status of the Plaid Link integration within the Sovereign AI ecosystem.
 */
export enum PlaidLinkStatus {
    IDLE = 'IDLE',
    INITIATING = 'INITIATING',
    LINKING = 'LINKING',
    SUCCESS = 'SUCCESS',
    EXITED = 'EXITED',
    ERROR = 'ERROR',
    PROCESSING_DATA = 'PROCESSING_DATA',
}

/**
 * Defines the structure for configuration parameters passed to the Plaid Link component.
 * This is an abstraction layer over PlaidLinkOptions for internal system consistency.
 */
interface SovereignPlaidConfig {
    linkToken: string;
    userToken: string; // Placeholder for internal user session token
    institutionId?: string;
    clientName: string;
    productType: 'transactions' | 'auth' | 'identity' | 'investments';
    apiVersion: string;
}

// --- Mock/Simulated Backend Services for AI Orchestration ---

/**
 * Simulates the secure, asynchronous exchange of the public token for a permanent access token
 * and subsequent data ingestion orchestration by the Sovereign AI Core.
 * @param publicToken The token received from Plaid Link upon successful user connection.
 * @param userId The unique identifier for the user in the Sovereign System.
 * @returns A promise resolving to the status of the backend processing.
 */
const mockBackendTokenExchangeAndIngestion = async (publicToken: string, userId: string): Promise<{ success: boolean, message: string, metadata?: any }> => {
    console.log(`[SovereignAI/Ingress] Received public token for user ${userId}. Initiating secure exchange...`);

    // Simulate network latency and secure handshake
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    if (publicToken.length < 10) {
        return { success: false, message: "Simulated token validation failure." };
    }

    // Simulate AI Core processing the data stream
    const ingestionDuration = 3000 + Math.random() * 4000;
    console.log(`[SovereignAI/Core] Ingesting data stream from Plaid. Estimated processing time: ${ingestionDuration / 1000}s.`);

    await new Promise(resolve => setTimeout(resolve, ingestionDuration));

    // Simulate successful AI analysis and integration into the user's financial profile
    const analysisResult = {
        transactionCount: Math.floor(Math.random() * 500) + 50,
        riskScoreAdjustment: (Math.random() * 0.5 - 0.25).toFixed(2), // +/- 0.25
        optimizationOpportunities: Math.floor(Math.random() * 10) + 1,
    };

    console.log(`[SovereignAI/Core] Data ingestion complete. Analysis summary:`, analysisResult);

    return {
        success: true,
        message: `Financial profile synchronized and optimized by Sovereign AI Core. ${analysisResult.transactionCount} records processed.`,
        metadata: analysisResult,
    };
};

// --- AI-Enhanced Plaid Link Button Component ---

interface PlaidLinkButtonProps {
    userId: string;
    config: SovereignPlaidConfig;
    onLinkSuccess: (metadata: PlaidLinkOnSuccessMetadata, config: SovereignPlaidConfig) => void;
    onLinkExit: (metadata: PlaidLinkOnExitMetadata, config: SovereignPlaidConfig) => void;
    buttonTextOverride?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * The PlaidLinkButton component, serving as the secure, AI-orchestrated ingress point
 * for connecting external financial accounts to the Sovereign AI Financial Operating System.
 * It manages the entire lifecycle from token fetching to backend data synchronization.
 */
const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
    userId,
    config,
    onLinkSuccess,
    onLinkExit,
    buttonTextOverride,
    variant = 'primary',
    iconOnly = false,
    size = 'md',
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [status, setStatus] = useState<PlaidLinkStatus>(PlaidLinkStatus.IDLE);
    const [linkToken, setLinkToken] = useState<string>(config.linkToken);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [modalTitle, setModalTitle] = useState("Initializing Sovereign Link");
    const [modalDescription, setModalDescription] = useState("Preparing secure connection parameters...");

    const isProcessing = status === PlaidLinkStatus.LINKING || status === PlaidLinkStatus.PROCESSING_DATA;
    const isError = status === PlaidLinkStatus.ERROR;
    const isSuccess = status === PlaidLinkStatus.SUCCESS;

    // Determine button size props based on input
    const buttonSizeMap = useMemo(() => ({
        sm: { fontSize: 'sm', px: 3, py: 6 },
        md: { fontSize: 'md', px: 4, py: 7 },
        lg: { fontSize: 'lg', px: 6, py: 8 },
    }), []);

    const currentSizeProps = buttonSizeMap[size];

    // --- Plaid Link Configuration Memoization ---
    const plaidLinkOptions: PlaidLinkOptions = useMemo(() => ({
        token: linkToken,
        onSuccess: (public_token, metadata) => handlePlaidSuccess(public_token, metadata),
        onExit: (err, metadata) => handlePlaidExit(err, metadata),
        // AI-Enhanced Configuration Parameters (Hypothetical future use or advanced settings)
        clientName: config.clientName,
        product: [config.productType],
        apiVersion: config.apiVersion,
        user: { client_user_id: userId },
        // Optional: Customize UI elements for a seamless Sovereign OS experience
        // linkToken: config.linkToken, // Already set via 'token' prop
    }), [linkToken, userId, config.clientName, config.productType, config.apiVersion]);

    const { open, ready } = usePlaidLink(plaidLinkOptions);

    // --- AI Orchestration Handlers ---

    const handlePlaidSuccess = useCallback(async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
        setStatus(PlaidLinkStatus.PROCESSING_DATA);
        setModalTitle("Data Ingress & AI Synchronization");
        setModalDescription("Securely exchanging token and initiating Sovereign AI Core analysis. This process optimizes your financial topology.");
        setProgress(10);

        try {
            // 1. Backend Exchange and AI Processing Simulation
            const result = await mockBackendTokenExchangeAndIngestion(public_token, userId);

            if (result.success) {
                setProgress(100);
                setStatus(PlaidLinkStatus.SUCCESS);
                setModalTitle("Sovereign Connection Established");
                setModalDescription(result.message);
                toast({
                    title: "Connection Verified",
                    description: `Account linked successfully. AI optimization initiated for ${metadata.institution.name}.`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                onLinkSuccess(metadata, config);
            } else {
                throw new Error(result.message || "Unknown backend processing error.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unhandled error occurred during data ingestion.";
            setError(errorMessage);
            setStatus(PlaidLinkStatus.ERROR);
            setModalTitle("Ingress Failure Detected");
            setModalDescription(`Critical error during AI synchronization: ${errorMessage}`);
            toast({
                title: "Sovereign Link Interrupted",
                description: "Data ingestion failed. Please try again or contact support.",
                status: "error",
                duration: 10000,
                isClosable: true,
            });
            onLinkExit({ error: { message: errorMessage, type: 'backend_error' } }, config);
        }
    }, [userId, onLinkSuccess, config, toast]);

    const handlePlaidExit = useCallback((error: PlaidLinkOnExitMetadata['error'], metadata: PlaidLinkOnExitMetadata) => {
        if (error && error.type !== 'user_closed_modal') {
            setError(error.message || "Plaid Link closed unexpectedly.");
            setStatus(PlaidLinkStatus.ERROR);
            setModalTitle("Link Interruption");
            setModalDescription(`Link process exited with error: ${error.type}.`);
            toast({
                title: "Link Interrupted",
                description: `Plaid Link closed: ${error.type}.`,
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        } else if (metadata.exit_status === 'complete') {
            // User successfully completed the flow but perhaps didn't select an account, or flow finished naturally.
            setStatus(PlaidLinkStatus.EXITED);
            setModalTitle("Link Session Concluded");
            setModalDescription("The Plaid Link session has concluded. No new data was synchronized.");
        } else {
            // User closed the modal manually before completion
            setStatus(PlaidLinkStatus.IDLE); // Return to initial state if user closes before any attempt
            setModalTitle("Link Session Cancelled");
            setModalDescription("You cancelled the connection process. Data synchronization aborted.");
        }
        onLinkExit(metadata, config);
    }, [onLinkExit, config, toast]);

    // --- Orchestration Logic for Opening Link ---

    const initiateLink = useCallback(() => {
        if (!ready || isProcessing) return;

        setError(null);
        setProgress(0);
        setStatus(PlaidLinkStatus.INITIATING);
        setModalTitle("Establishing Secure Channel");
        setModalDescription("Requesting fresh link token from Sovereign API Gateway...");

        // In a real system, this would call an endpoint to generate a fresh link_token
        // For this simulation, we assume config.linkToken is valid or we refresh it here.
        // Since we cannot call a real backend, we rely on the provided token or simulate a refresh.

        // Simulate token refresh/validation delay
        setTimeout(() => {
            if (config.linkToken) {
                setStatus(PlaidLinkStatus.LINKING);
                setModalTitle("Launching Sovereign Interface");
                setModalDescription("Launching the secure Plaid interface for credential input.");
                open(); // Opens the Plaid Link modal
            } else {
                const refreshError = "Link token missing or expired. System requires token refresh.";
                setError(refreshError);
                setStatus(PlaidLinkStatus.ERROR);
                toast({ title: "Configuration Error", description: refreshError, status: "error" });
            }
        }, 500);

    }, [ready, isProcessing, open, config.linkToken, toast]);

    // --- UI Rendering Logic ---

    const getButtonContent = () => {
        if (iconOnly) {
            return <Icon as={FiLink} w={5} h={5} />;
        }
        if (buttonTextOverride) {
            return buttonTextOverride;
        }
        switch (status) {
            case PlaidLinkStatus.IDLE:
            case PlaidLinkStatus.EXITED:
                return (
                    <HStack>
                        <Icon as={FiLink} />
                        <Text>Connect Financial Source</Text>
                    </HStack>
                );
            case PlaidLinkStatus.INITIATING:
                return <HStack><Spinner size="sm" mr={2} /> {iconOnly ? <Icon as={FiZap} /> : "Preparing..."}</HStack>;
            case PlaidLinkStatus.LINKING:
                return <HStack><Spinner size="sm" mr={2} /> {iconOnly ? <Icon as={FiZap} /> : "Launching Link..."}</HStack>;
            case PlaidLinkStatus.PROCESSING_DATA:
                return <HStack><Spinner size="sm" mr={2} /> {iconOnly ? <Icon as={FiCpu} /> : "AI Processing..."}</HStack>;
            case PlaidLinkStatus.SUCCESS:
                return <HStack><Icon as={FiCheckCircle} /> {iconOnly ? <Icon as={FiCheckCircle} /> : "Source Linked"}</HStack>;
            case PlaidLinkStatus.ERROR:
                return <HStack><Icon as={FiXCircle} /> {iconOnly ? <Icon as={FiXCircle} /> : "Link Failed"}</HStack>;
            default:
                return <HStack><Icon as={FiLink} /> Connect Account</HStack>;
        }
    };

    const getButtonVariant = () => {
        switch (variant) {
            case 'primary':
                return {
                    bg: isProcessing ? 'gray.500' : 'blue.600',
                    color: 'white',
                    _hover: { bg: isProcessing ? 'gray.600' : 'blue.700' },
                };
            case 'secondary':
                return {
                    bg: isProcessing ? 'yellow.300' : 'yellow.500',
                    color: 'gray.900',
                    _hover: { bg: isProcessing ? 'yellow.400' : 'yellow.600' },
                };
            case 'ghost':
                return {
                    bg: 'transparent',
                    color: isProcessing ? 'gray.400' : 'blue.500',
                    _hover: { bg: isProcessing ? 'gray.700' : 'gray.800' },
                };
        }
    };

    const isDisabled = isProcessing || !ready;

    // --- Modal Content Rendering ---

    const renderModalContent = () => {
        if (isSuccess) {
            return (
                <VStack spacing={6} py={8}>
                    <Icon as={FiCheckCircle} w={16} h={16} color="green.500" />
                    <Heading size="lg">Synchronization Complete</Heading>
                    <Text textAlign="center" color="gray.600">{modalDescription}</Text>
                    <Badge colorScheme="green" variant="solid" fontSize="md">
                        Sovereign AI Profile Updated
                    </Badge>
                </VStack>
            );
        }

        if (isError) {
            return (
                <VStack spacing={6} py={8}>
                    <Icon as={FiAlertTriangle} w={16} h={16} color="red.500" />
                    <Heading size="lg">Critical Ingress Error</Heading>
                    <Text textAlign="center" color="red.600">{modalDescription}</Text>
                    <Box p={3} bg="red.50" borderRadius="md" w="full">
                        <Text fontSize="sm" fontFamily="mono">{error}</Text>
                    </Box>
                </VStack>
            );
        }

        // Loading/Initiating States
        return (
            <VStack spacing={6} py={8} px={4}>
                <Heading size="md" color="blue.600">{modalTitle}</Heading>
                <Text textAlign="center" color="gray.600">{modalDescription}</Text>

                {status === PlaidLinkStatus.PROCESSING_DATA && (
                    <VStack w="full" spacing={4}>
                        <Progress
                            hasStripe
                            value={progress}
                            isAnimated
                            width="100%"
                            colorScheme="blue"
                            size="lg"
                        />
                        <HStack justify="space-between" w="full" fontSize="sm" color="gray.500">
                            <Text>Data Acquisition</Text>
                            <Text>{Math.round(progress)}%</Text>
                        </HStack>
                        <Alert status="info" borderRadius="lg" p={3}>
                            <AlertIcon boxSize="4" mr={2} />
                            <Text fontSize="sm">AI Core is analyzing transaction patterns for immediate optimization.</Text>
                        </Alert>
                    </VStack>
                )}

                {(status === PlaidLinkStatus.INITIATING || status === PlaidLinkStatus.LINKING) && (
                    <VStack spacing={3}>
                        <Spinner size="xl" color="blue.500" />
                        <Text fontSize="sm" color="gray.500">Awaiting secure channel establishment...</Text>
                    </VStack>
                )}

                <Box pt={4} borderTop="1px solid" borderColor="gray.100" w="full">
                    <HStack justifyContent="space-between" fontSize="sm" color="gray.500">
                        <Text>User ID: {userId.substring(0, 8)}...</Text>
                        <Text>Product: {config.productType}</Text>
                    </HStack>
                </Box>
            </VStack>
        );
    };

    // --- Main Render ---

    return (
        <>
            {/* 1. The Primary Action Button */}
            <Button
                onClick={initiateLink}
                isDisabled={isDisabled}
                isLoading={isProcessing && !iconOnly}
                loadingText={iconOnly ? "" : "Processing..."}
                spinnerPlacement={iconOnly ? "none" : "start"}
                variant="solid"
                {...getButtonVariant()}
                {...currentSizeProps}
                width={iconOnly ? 'auto' : 'full'}
                title={isDisabled ? "System busy or link token invalid" : "Initiate Sovereign Financial Link"}
            >
                {getButtonContent()}
            </Button>

            {/* 2. The Orchestration Modal (PlaidModal Simulation) */}
            <Modal isOpen={isOpen} onClose={isProcessing ? () => {} : onClose} size="lg" isCentered>
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
                <ModalContent borderRadius="xl" shadow="2xl" p={0}>
                    <ModalHeader borderBottom="1px solid" borderColor="gray.100" py={4}>
                        <Flex align="center">
                            <Icon as={FiShield} color="blue.500" mr={3} w={6} h={6} />
                            <Heading size="md">Sovereign AI Data Ingress Protocol</Heading>
                        </Flex>
                    </ModalHeader>
                    <ModalBody p={0}>
                        {renderModalContent()}
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="gray.100">
                        <Button
                            variant="outline"
                            onClick={isProcessing ? () => {} : onClose}
                            isDisabled={isProcessing}
                            leftIcon={isSuccess ? <Icon as={FiSettings} /> : isError ? <Icon as={FiRefreshCw} /> : <Icon as={FiXCircle} />}
                        >
                            {isSuccess ? "View Profile" : isError ? "Retry Connection" : "Cancel & Close"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PlaidLinkButton;

// --- Extended Component: AI-Driven Link Status Dashboard Widget ---

interface LinkStatusWidgetProps {
    userId: string;
    lastLinkedDate?: Date | null;
    institutionName?: string;
    status: PlaidLinkStatus;
}

/**
 * A high-value dashboard widget providing real-time, AI-contextualized status of the Plaid Link integration.
 * This component demonstrates the integration of status monitoring directly into the Sovereign OS UI layer.
 */
const AIStatusWidget: React.FC<LinkStatusWidgetProps> = ({ userId, lastLinkedDate, institutionName, status }) => {
    const isConnected = status === PlaidLinkStatus.SUCCESS;
    const isSyncing = status === PlaidLinkStatus.PROCESSING_DATA || status === PlaidLinkStatus.LINKING;

    const getStatusBadge = () => {
        switch (status) {
            case PlaidLinkStatus.SUCCESS:
                return <Badge colorScheme="green" variant="solid"><HStack><Icon as={FiCheckCircle} /> <span>Active & Optimized</span></HStack></Badge>;
            case PlaidLinkStatus.PROCESSING_DATA:
                return <Badge colorScheme="orange" variant="solid"><HStack><Spinner size="xs" mr={1} /> <span>AI Syncing</span></HStack></Badge>;
            case PlaidLinkStatus.ERROR:
                return <Badge colorScheme="red" variant="solid"><HStack><Icon as={FiAlertTriangle} /> <span>Connection Error</span></HStack></Badge>;
            case PlaidLinkStatus.IDLE:
            case PlaidLinkStatus.EXITED:
            default:
                return <Badge colorScheme="gray" variant="outline"><HStack><Icon as={FiInfo} /> <span>Pending Link</span></HStack></Badge>;
        }
    };

    const formatLastSync = useMemo(() => {
        if (!lastLinkedDate) return "Never Synchronized";
        return lastLinkedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }, [lastLinkedDate]);

    const aiInsight = useMemo(() => {
        if (isConnected) {
            return `Data integrity verified by Sovereign AI Core. Last optimization cycle completed at ${formatLastSync}.`;
        }
        if (isSyncing) {
            return "Real-time data stream established. Awaiting final AI validation and feature activation.";
        }
        return "Link required to unlock predictive modeling and automated wealth management features.";
    }, [isConnected, isSyncing, formatLastSync]);

    return (
        <Flex
            p={6}
            bg="white"
            borderRadius="xl"
            shadow="lg"
            border="1px solid"
            borderColor={isConnected ? "green.200" : "gray.200"}
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            transition="all 0.3s"
            _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
        >
            <VStack align="flex-start" spacing={2} flex={1} minW="0">
                <HStack spacing={3}>
                    <Icon as={FiTrendingUp} w={6} h={6} color="blue.500" />
                    <Heading size="md">Financial Data Ingress Status</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    User ID: <Text as="span" fontWeight="medium" color="gray.700">{userId.substring(0, 12)}...</Text>
                </Text>
                <Box mt={2}>
                    {getStatusBadge()}
                </Box>
            </VStack>

            <VStack align="flex-start" spacing={1} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} flexShrink={0} w={{ base: "full", md: "auto" }}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Institution: {institutionName || "N/A"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                    Last Sync: {formatLastSync}
                </Text>
                <Tooltip label={aiInsight} placement="top">
                    <HStack spacing={1} mt={1} color="blue.500">
                        <Icon as={FiCpu} w={3} h={3} />
                        <Text fontSize="xs" fontStyle="italic" noOfLines={1}>{aiInsight}</Text>
                    </HStack>
                </Tooltip>
            </VStack>
        </Flex>
    );
};

// --- Example Usage Context (Not part of the final file, but for demonstration of integration) ---
/*
const AppContext = () => {
    const [linkStatus, setLinkStatus] = useState<PlaidLinkStatus>(PlaidLinkStatus.IDLE);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [institution, setInstitution] = useState<string | undefined>(undefined);
    const userId = "user_sovereign_987654321";

    const mockConfig: SovereignPlaidConfig = {
        linkToken: "link-sandbox-token-12345", // Replace with dynamic token fetching
        userToken: "user_session_xyz",
        clientName: "Sovereign AI Bank OS",
        productType: 'transactions',
        apiVersion: 'v2',
    };

    const handleSuccess = (metadata: PlaidLinkOnSuccessMetadata, config: SovereignPlaidConfig) => {
        setLinkStatus(PlaidLinkStatus.SUCCESS);
        setLastSync(new Date());
        setInstitution(metadata.institution.name);
        // In a real app, you'd use the public_token here to finalize backend setup
    };

    const handleExit = (metadata: PlaidLinkOnExitMetadata, config: SovereignPlaidConfig) => {
        if (metadata.error && metadata.error.type !== 'user_closed_modal') {
            setLinkStatus(PlaidLinkStatus.ERROR);
        } else {
            setLinkStatus(PlaidLinkStatus.IDLE);
        }
    };

    return (
        <Box p={10}>
            <AIStatusWidget
                userId={userId}
                lastLinkedDate={lastSync}
                institutionName={institution}
                status={linkStatus}
            />
            <Box mt={8} w="300px">
                <PlaidLinkButton
                    userId={userId}
                    config={mockConfig}
                    onLinkSuccess={handleSuccess}
                    onLinkExit={handleExit}
                    variant="primary"
                    size="lg"
                />
            </Box>
        </Box>
    );
};
*/