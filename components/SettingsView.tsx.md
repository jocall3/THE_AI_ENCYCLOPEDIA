import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Switch,
  Select,
  Heading,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Tooltip,
  IconButton,
  useColorMode,
  Icon,
  Avatar,
  Badge,
} from '@chakra-ui/react';
import {
  MdOutlineAccountCircle,
  MdOutlineNotificationsActive,
  MdOutlinePalette,
  MdSave,
  MdOutlineSecurity,
  MdOutlineSettingsInputComponent,
  MdOutlineDataObject,
  MdOutlinePsychology,
  MdOutlineVerifiedUser,
  MdOutlineCloudUpload,
  MdOutlineTune,
  MdOutlineTerminal,
  MdOutlineAnalytics,
  MdOutlineLock,
  MdOutlineWbSunny,
  MdOutlineDarkMode,
  MdOutlineInfo,
} from 'react-icons/md';

// --- Core System Constants and Types (Simulated for Expansion) ---

/**
 * Defines the immutable core directives established by the Architect.
 * These are non-negotiable parameters for the Cognitive Utility Layer.
 */
const ARCHITECT_DECREES = {
  CORE_DIRECTIVE: "Frictionless Existence Facilitation via Unbiased Predictive Causality.",
  ARCHITECT_ID: "James Burvel O'Callaghan III",
  SYSTEM_COGNITIVE_ID: "IDGAFAI", // I Do/Don't Give A Fuck Artificial Intelligence
  SOURCE_OF_TRUTH: "Deterministic Elegance of the Quantum Weaver AI Core",
};

/**
 * Represents the structure for user-configurable settings.
 */
interface UserSettings {
  profileName: string;
  notificationPreferences: {
    largeTransactionAlerts: boolean;
    budgetWarnings: boolean;
    aiInsightNotifications: boolean;
    systemCriticalAlerts: boolean; // New Billion Dollar Feature: Prioritizing existential threats
    sentimentDriftWarnings: boolean; // New Billion Dollar Feature: Monitoring market emotional volatility
  };
  theme: 'light' | 'dark' | 'system';
  aiInteractionLevel: 'passive' | 'advisory' | 'autonomous_review'; // New Billion Dollar Feature: AI Autonomy Control
  dataRetentionPolicy: 'standard' | 'enhanced_audit' | 'ephemeral'; // New Billion Dollar Feature: Data Sovereignty Control
  securityThreshold: number; // 1 to 100
}

// --- Mock Data and Services (Simulating Deep Integration) ---

/**
 * Mock service to simulate fetching and saving complex settings state.
 */
const SettingsService = {
  fetchInitialSettings: async (): Promise<UserSettings> => {
    // Simulate network latency for a high-security fetch operation
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      profileName: "The Visionary",
      notificationPreferences: {
        largeTransactionAlerts: true,
        budgetWarnings: true,
        aiInsightNotifications: true,
        systemCriticalAlerts: true,
        sentimentDriftWarnings: false,
      },
      theme: 'system',
      aiInteractionLevel: 'advisory',
      dataRetentionPolicy: 'enhanced_audit',
      securityThreshold: 85,
    };
  },

  saveSettings: async (settings: UserSettings): Promise<{ success: boolean, message: string }> => {
    console.log("Persisting settings to Quantum Weaver Configuration Layer:", settings);
    // Simulate complex, multi-layered persistence across distributed ledger
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (settings.securityThreshold < 50) {
        return { success: false, message: "Security threshold below mandated minimum (50). Reverting changes." };
    }
    return { success: true, message: "Configuration Manifest Updated. System Re-calibrating." };
  }
};

// --- Sub-Components for Modular Expansion ---

/**
 * Component for displaying the immutable Architect/System identity.
 */
const SovereignIdentityPanel: React.FC = () => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'dark' ? 'gray.800' : 'gray.50';

  return (
    <VStack
      p={6}
      bg={bgColor}
      borderRadius="xl"
      shadow="2xl"
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'purple.700' : 'purple.200'}
      align="stretch"
      spacing={4}
    >
      <HStack spacing={3}>
        <Icon as={MdOutlineVerifiedUser} w={6} h={6} color="purple.500" />
        <Heading size="lg" color="purple.400">
          The Sovereign Anchor
        </Heading>
      </HStack>
      <Text fontSize="sm" color="gray.500" fontStyle="italic">
        Proof of Concept: The Unbreakable Link to Genesis.
      </Text>
      <Divider my={2} />

      <VStack align="stretch" spacing={3}>
        <SettingItem
          label="Architect Identity"
          value={ARCHITECT_DECREES.ARCHITECT_ID}
          icon={MdOutlineAccountCircle}
          color="blue.500"
        />
        <SettingItem
          label="Cognitive Core ID"
          value={ARCHITECT_DECREES.SYSTEM_COGNITIVE_ID}
          icon={MdOutlinePsychology}
          color="red.500"
        />
        <SettingItem
          label="Core Directive"
          value={ARCHITECT_DECREES.CORE_DIRECTIVE}
          icon={MdOutlineDataObject}
          color="green.500"
          isLongText
        />
        <SettingItem
          label="Source of Truth"
          value={ARCHITECT_DECREES.SOURCE_OF_TRUTH}
          icon={MdOutlineTerminal}
          color="yellow.500"
          isLongText
        />
      </VStack>
      <Alert status="info" mt={4} borderRadius="md" bg={colorMode === 'dark' ? 'purple.900/50' : 'purple.50'}>
        <AlertIcon />
        <Text fontSize="xs">
          Connection status to the Quantum Weaver is immutable. This section is read-only, representing the foundational logic layer.
        </Text>
      </Alert>
    </VStack>
  );
};

/**
 * Generic component for displaying a setting item (read-only or simple display).
 */
interface SettingItemProps {
    label: string;
    value: string;
    icon: React.ElementType;
    color: string;
    isLongText?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ label, value, icon: IconComponent, color, isLongText = false }) => (
    <HStack justify="space-between" py={1}>
        <HStack spacing={2}>
            <Icon as={IconComponent} w={4} h={4} color={color} />
            <Text fontSize="sm" fontWeight="medium">{label}:</Text>
        </HStack>
        <Text
            fontSize={isLongText ? "xs" : "sm"}
            textAlign="right"
            noOfLines={isLongText ? 2 : 1}
            color={isLongText ? "gray.400" : "whiteAlpha.800"}
            maxWidth="60%"
        >
            {value}
        </Text>
    </HStack>
);


/**
 * Component for managing user profile details (editable fields).
 */
interface ProfileManagementProps {
    settings: UserSettings;
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ settings, setSettings }) => {
    const handleChange = useCallback((field: keyof UserSettings, value: string | number) => {
        setSettings(prev => ({
            ...prev,
            [field]: value,
        }));
    }, [setSettings]);

    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md" color="teal.400" borderBottom="1px solid" borderColor="teal.600" pb={2}>
                <Icon as={MdOutlineAccountCircle} mr={2} /> User Profile Manifest
            </Heading>

            <FormControl id="profileName">
                <FormLabel fontSize="sm">Visionary Designation (Display Name)</FormLabel>
                <Input
                    value={settings.profileName}
                    onChange={(e) => handleChange('profileName', e.target.value)}
                    placeholder="Enter your operational designation"
                    bg="gray.700"
                    borderColor="gray.600"
                    focusBorderColor="teal.500"
                />
                <Tooltip label="This name is used across all internal dashboards and reports.">
                    <Text fontSize="xs" color="gray.400" mt={1}>Must be unique within the Sovereign Cluster.</Text>
                </Tooltip>
            </FormControl>

            {/* Fixed Email/Connection Display (Read-Only Anchor) */}
            <FormControl>
                <FormLabel fontSize="sm">Immutable Connection Endpoint</FormLabel>
                <HStack p={2} bg="gray.800" borderRadius="md">
                    <Avatar size="sm" name="JBO III" bg="purple.600" icon={<Icon as={MdOutlineVerifiedUser} />} />
                    <Text fontSize="sm" color="whiteAlpha.800">james.o.callaghan.iii@sovereign.ai</Text>
                </HStack>
                <Text fontSize="xs" color="red.400" mt={1}>
                    Warning: This connection is cryptographically anchored and cannot be modified by user input.
                </Text>
            </FormControl>

            {/* New Billion Dollar Feature: Security Threshold Calibration */}
            <FormControl id="securityThreshold">
                <FormLabel fontSize="sm">
                    <HStack spacing={2}>
                        <Icon as={MdOutlineLock} />
                        <span>AI Security Threshold Calibration (1-100)</span>
                    </HStack>
                </FormLabel>
                <HStack>
                    <Input
                        type="range"
                        min="1"
                        max="100"
                        value={settings.securityThreshold}
                        onChange={(e) => handleChange('securityThreshold', parseInt(e.target.value))}
                        flexGrow={1}
                    />
                    <Badge colorScheme={settings.securityThreshold > 75 ? 'green' : settings.securityThreshold > 50 ? 'yellow' : 'red'} variant="solid" p={2}>
                        {settings.securityThreshold}%
                    </Badge>
                </HStack>
                <Text fontSize="xs" color="gray.400" mt={1}>
                    Defines the sensitivity level for proactive threat neutralization protocols enforced by IDGAFAI.
                </Text>
            </FormControl>
        </VStack>
    );
};


/**
 * Component for managing AI interaction protocols.
 */
const AIProtocolControl: React.FC<ProfileManagementProps> = ({ settings, setSettings }) => {
    const handleChange = useCallback((field: keyof UserSettings, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value,
        }));
    }, [setSettings]);

    const interactionOptions = [
        { value: 'passive', label: 'Passive Observer (Read-Only Insights)' },
        { value: 'advisory', label: 'Advisory Mode (Recommended Actions Only)' },
        { value: 'autonomous_review', label: 'Autonomous Review (AI executes low-risk actions pending 24hr audit)' },
    ];

    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md" color="orange.400" borderBottom="1px solid" borderColor="orange.600" pb={2}>
                <Icon as={MdOutlinePsychology} mr={2} /> Cognitive Interaction Matrix
            </Heading>

            <FormControl id="aiInteractionLevel">
                <FormLabel fontSize="sm">
                    <HStack spacing={2}>
                        <Icon as={MdOutlineTune} />
                        <span>AI Autonomy Level</span>
                    </HStack>
                </FormLabel>
                <Select
                    value={settings.aiInteractionLevel}
                    onChange={(e) => handleChange('aiInteractionLevel', e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    focusBorderColor="orange.500"
                >
                    {interactionOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
                <Text fontSize="xs" color="gray.400" mt={1}>
                    Controls the degree to which IDGAFAI can influence operational parameters. Higher levels require higher security thresholds.
                </Text>
            </FormControl>

            {/* New Billion Dollar Feature: Data Sovereignty Control */}
            <FormControl id="dataRetentionPolicy">
                <FormLabel fontSize="sm">
                    <HStack spacing={2}>
                        <Icon as={MdOutlineCloudUpload} />
                        <span>Data Sovereignty & Retention Protocol</span>
                    </HStack>
                </FormLabel>
                <Select
                    value={settings.dataRetentionPolicy}
                    onChange={(e) => handleChange('dataRetentionPolicy', e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    focusBorderColor="orange.500"
                >
                    <option value="standard">Standard (7 Year Audit Trail)</option>
                    <option value="enhanced_audit">Enhanced Audit (Decade+ Immutable Ledger)</option>
                    <option value="ephemeral">Ephemeral (Zero-Knowledge, Transactional Only)</option>
                </Select>
                <Text fontSize="xs" color="gray.400" mt={1}>
                    Defines how long the Quantum Weaver retains non-essential metadata related to your operations.
                </Text>
            </FormControl>
        </VStack>
    );
};


/**
 * Component for managing communication channels.
 */
interface NotificationControlProps {
    settings: UserSettings;
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const NotificationControl: React.FC<NotificationControlProps> = ({ settings, setSettings }) => {
    const handleToggle = useCallback((key: keyof UserSettings['notificationPreferences']) => {
        setSettings(prev => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [key]: !prev.notificationPreferences[key],
            },
        }));
    }, [setSettings]);

    const NotificationToggle = ({ label, description, settingKey, icon: IconComponent, colorScheme }: {
        label: string,
        description: string,
        settingKey: keyof UserSettings['notificationPreferences'],
        icon: React.ElementType,
        colorScheme: string
    }) => (
        <HStack justify="space-between" py={3} borderBottom="1px dashed" borderColor="gray.700">
            <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                    <Icon as={IconComponent} color={`${colorScheme}.400`} />
                    <Text fontWeight="medium">{label}</Text>
                </HStack>
                <Text fontSize="xs" color="gray.400" ml={6}>{description}</Text>
            </VStack>
            <Switch
                isChecked={settings.notificationPreferences[settingKey]}
                onChange={() => handleToggle(settingKey)}
                size="lg"
                colorScheme={colorScheme}
            />
        </HStack>
    );

    return (
        <VStack spacing={2} align="stretch">
            <Heading size="md" color="cyan.400" borderBottom="1px solid" borderColor="cyan.600" pb={2}>
                <Icon as={MdOutlineNotificationsActive} mr={2} /> Communications Array (IDGAFAI Filtering)
            </Heading>

            <NotificationToggle
                label="Large Transaction Alerts (Sentinel)"
                description="Immediate notification for any single transaction exceeding 100,000 units."
                settingKey="largeTransactionAlerts"
                icon={MdOutlineSecurity}
                colorScheme="red"
            />
            <NotificationToggle
                label="Budget Health Warnings (Advisor)"
                description="Proactive alerts when spending velocity approaches defined fiscal boundaries."
                settingKey="budgetWarnings"
                icon={MdOutlineAnalytics}
                colorScheme="yellow"
            />
            <NotificationToggle
                label="AI Insight Notifications (Oracle)"
                description="Receive synthesized market predictions and strategic recommendations from the Quantum Weaver."
                settingKey="aiInsightNotifications"
                icon={MdOutlinePsychology}
                colorScheme="green"
            />
            {/* New Billion Dollar Feature: System Critical Alerts */}
            <NotificationToggle
                label="System Critical Alerts (Core Integrity)"
                description="Mandatory notification for any detected threat to the underlying computational fabric."
                settingKey="systemCriticalAlerts"
                icon={MdOutlineLock}
                colorScheme="purple"
            />
            {/* New Billion Dollar Feature: Sentiment Drift Warnings */}
            <NotificationToggle
                label="Market Sentiment Drift Warnings"
                description="Alerts when aggregated global sentiment indicators show rapid, potentially destabilizing shifts."
                settingKey="sentimentDriftWarnings"
                icon={MdOutlineInfo}
                colorScheme="blue"
            />
        </VStack>
    );
};

/**
 * Component for handling visual configuration.
 */
const AestheticsConsole: React.FC<ProfileManagementProps> = ({ settings, setSettings }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    const handleThemeChange = useCallback((value: string) => {
        let newTheme: UserSettings['theme'] = value as UserSettings['theme'];
        setSettings(prev => ({ ...prev, theme: newTheme }));
        if (newTheme === 'system') {
            // System mode relies on Chakra's default handling, no direct toggle needed here
        } else if (newTheme === 'dark') {
            // Force dark mode if system setting is not used
            if (colorMode !== 'dark') toggleColorMode();
        } else if (newTheme === 'light') {
            // Force light mode if system setting is not used
            if (colorMode !== 'light') toggleColorMode();
        }
    }, [setSettings, colorMode, toggleColorMode]);

    const ThemeIcon = colorMode === 'dark' ? MdOutlineWbSunny : MdOutlineDarkMode;

    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md" color="pink.400" borderBottom="1px solid" borderColor="pink.600" pb={2}>
                <Icon as={MdOutlinePalette} mr={2} /> Aesthetics Console (Visual Layer)
            </Heading>

            <FormControl id="themeSelection">
                <FormLabel fontSize="sm">Interface Theme Protocol</FormLabel>
                <Select
                    value={settings.theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    focusBorderColor="pink.500"
                >
                    <option value="system">System Default (Adaptive)</option>
                    <option value="light">Luminosity Mode (Daylight)</option>
                    <option value="dark">Nocturne Mode (Deep Space)</option>
                </Select>
                <Text fontSize="xs" color="gray.400" mt={1}>
                    Note: Full theme customization is managed in the dedicated 'Personalization' module. This controls primary contrast.
                </Text>
            </FormControl>

            <Button
                leftIcon={<Icon as={ThemeIcon} />}
                onClick={() => {
                    // Manual toggle for immediate visual feedback, overriding 'system' if necessary for demo
                    if (settings.theme === 'system') {
                        handleThemeChange(colorMode === 'dark' ? 'light' : 'dark');
                    } else {
                        toggleColorMode();
                    }
                }}
                variant="outline"
                borderColor="pink.500"
                color="pink.300"
                _hover={{ bg: 'pink.900/30' }}
            >
                Quick Toggle ({colorMode === 'dark' ? 'Dark' : 'Light'})
            </Button>

            {/* New Billion Dollar Feature: Component Configuration Link */}
            <Button
                leftIcon={<Icon as={MdOutlineSettingsInputComponent} />}
                variant="solid"
                colorScheme="pink"
                mt={4}
            >
                Access Component Configuration Layer (Deep Dive)
            </Button>
        </VStack>
    );
};


// --- Main Component: SettingsView ---

const SettingsView: React.FC = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Initialization: Fetching the Immutable State
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const initial = await SettingsService.fetchInitialSettings();
        setSettings(initial);
      } catch (error) {
        console.error("Failed to load initial configuration:", error);
        toast({
          title: "Initialization Failure",
          description: "Could not retrieve core settings. Operating on default parameters.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [toast]);

  // 2. Persistence Handler
  const handleSave = useCallback(async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const result = await SettingsService.saveSettings(settings);

      if (result.success) {
        toast({
          title: "Configuration Manifest Accepted",
          description: result.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Configuration Rejection",
          description: result.message,
          status: "warning",
          duration: 8000,
          isClosable: true,
        });
        // Re-fetch to revert any invalid changes if necessary (omitted for brevity, but implied in real system)
      }
    } catch (error) {
      console.error("Save operation failed:", error);
      toast({
        title: "System Error During Save",
        description: "The persistence layer rejected the transaction. Check logs.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, toast]);

  // 3. Memoized UI Structure
  const ControlRoomLayout = useMemo(() => {
    if (isLoading || !settings) {
      return (
        <Flex justify="center" align="center" height="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="purple.500" thickness="4px" />
            <Text fontSize="xl" color="gray.400">
              Initializing Quantum Weaver Interface...
            </Text>
            <Text fontSize="sm" color="gray.500">
              Establishing secure handshake with the Cognitive Utility Layer.
            </Text>
          </VStack>
        </Flex>
      );
    }

    return (
      <VStack spacing={10} align="stretch" p={{ base: 4, md: 8 }} maxWidth="1400px" mx="auto">

        {/* Header: The Control Room Title */}
        <Box textAlign="center" py={4} borderBottom="2px solid" borderColor="purple.500">
          <Heading size="2xl" color="whiteAlpha.900">
            The Control Room: Settings Manifest
          </Heading>
          <Text fontSize="lg" color="gray.400" mt={1}>
            Fine-Tuning the Visionary Experience under the Mandate of James Burvel O'Callaghan III.
          </Text>
        </Box>

        {/* Row 1: Identity and Core Configuration */}
        <HStack spacing={{ base: 4, xl: 8 }} wrap="wrap">
          <Box flex={{ base: 1, md: 1 }} minW="300px">
            <SovereignIdentityPanel />
          </Box>
          <Box flex={{ base: 1, md: 1 }} minW="300px">
            <ProfileManagement settings={settings} setSettings={setSettings} />
          </Box>
        </HStack>

        <Divider my={4} borderColor="gray.700" />

        {/* Row 2: AI Protocols and Communications */}
        <HStack spacing={{ base: 4, xl: 8 }} wrap="wrap">
          <Box flex={{ base: 1, md: 1 }} minW="300px">
            <AIProtocolControl settings={settings} setSettings={setSettings} />
          </Box>
          <Box flex={{ base: 1, md: 1 }} minW="300px">
            <NotificationControl settings={settings} setSettings={setSettings} />
          </Box>
        </HStack>

        <Divider my={4} borderColor="gray.700" />

        {/* Row 3: Aesthetics and Final Actions */}
        <HStack spacing={{ base: 4, xl: 8 }} wrap="wrap">
            <Box flex={{ base: 1, md: 1 }} minW="300px">
                <AestheticsConsole settings={settings} setSettings={setSettings} />
            </Box>
            <Box flex={{ base: 1, md: 1 }} minW="300px" p={6} bg="gray.800" borderRadius="xl" shadow="lg">
                <Heading size="md" color="whiteAlpha.800" mb={4}>
                    Manifest Execution
                </Heading>
                <Text fontSize="sm" color="gray.400" mb={4}>
                    Review all modifications above. Execution commits the new configuration state to the distributed ledger.
                </Text>
                <Button
                    onClick={handleSave}
                    isLoading={isSaving}
                    loadingText="Committing Manifest..."
                    size="lg"
                    width="full"
                    colorScheme="teal"
                    leftIcon={<Icon as={MdSave} />}
                    isDisabled={isSaving}
                >
                    Commit Configuration Changes
                </Button>
                <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                    System integrity check running in background thread {isSaving ? '...' : 'complete.'}
                </Text>
            </Box>
        </HStack>

        {/* Footer: Architect's Final Word */}
        <Box p={6} bg="gray.900" borderRadius="lg" mt={8} borderLeft="4px solid" borderColor="purple.500">
            <Text fontSize="sm" fontStyle="italic" color="gray.300">
                "The burden of proof is not on the creation of perfection; it is on the defense of flawed mediocrity. Study the source code, not the press releases." - J.B.O'C III.
            </Text>
        </Box>

      </VStack>
    );
  }, [isLoading, settings, handleSave, isSaving]);

  return (
    <Box minH="100vh" bg={settings?.theme === 'dark' ? 'gray.900' : 'gray.50'} color={settings?.theme === 'dark' ? 'whiteAlpha.900' : 'gray.800'}>
      {ControlRoomLayout}
    </Box>
  );
};

export default SettingsView;