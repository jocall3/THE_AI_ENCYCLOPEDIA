import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  Switch,
  useToast,
  Spinner,
  Heading,
  FormControl,
  FormLabel,
  useColorMode,
  IconButton,
  Tooltip,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Badge,
} from '@chakra-ui/react';
import {
  SunIcon,
  MoonIcon,
  SettingsIcon,
  AtSignIcon,
  LockIcon,
  ViewIcon,
  EditIcon,
  CheckCircleIcon,
  WarningIcon,
  InfoOutlineIcon,
  RepeatIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SearchIcon,
  PlusSquareIcon,
  MinusSquareIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';

// --- Core System Constants and Types (Simulated for Expansion) ---

/**
 * Defines the structure for a high-level user preference profile.
 * This is the foundation for the AI-driven personalization engine.
 */
interface UserProfileSettings {
  theme: 'dark' | 'light' | 'system';
  primaryColor: string;
  fontFamily: string;
  dashboardLayout: 'modular' | 'streamlined' | 'executive';
  kpiDisplayMode: 'absolute' | 'delta' | 'projection';
  aiVerbosityLevel: 1 | 2 | 3 | 4 | 5; // 1: Minimal, 5: Hyper-detailed analysis
  securityAlertThreshold: number; // Percentage change threshold for anomaly detection
  preferredCurrency: string;
  timezone: string;
  language: string;
  financialNarrativeStyle: 'formal' | 'direct' | 'visionary';
  dataDensity: 'low' | 'medium' | 'high';
  enablePredictiveModeling: boolean;
  customMetricTags: string[];
  aiAgentName: string;
  aiAgentPersona: 'Sovereign' | 'Analyst' | 'Strategist' | 'Guardian';
  biometricAuthEnabled: boolean;
  quantumEncryptionLevel: 'L1' | 'L2' | 'L3';
  transactionVisualizationStyle: 'flow' | 'network' | 'timeline';
}

// --- Simulated AI Service Layer (Placeholder for Billion-Dollar Logic) ---

/**
 * Simulates an advanced AI service responsible for deep personalization analysis
 * and generating optimal configuration suggestions based on user behavior and mission alignment.
 */
const AIService = {
  /**
   * Analyzes current settings against historical interaction data to suggest optimizations.
   * @param currentSettings The user's current configuration.
   * @returns A promise resolving to suggested configuration adjustments.
   */
  async analyzeAndSuggest(currentSettings: UserProfileSettings): Promise<Partial<UserProfileSettings>> {
    console.log(`[AI Core] Initiating deep behavioral analysis for user profile alignment...`);
    // Simulate complex, multi-threaded, first-principles computation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: Partial<UserProfileSettings> = {};

    // Example 1: Theme Optimization based on time-of-day interaction patterns
    if (currentSettings.theme === 'system') {
      suggestions.theme = 'dark'; // Assuming high-value work occurs during off-peak light hours
    }

    // Example 2: KPI Mode based on recent volatility
    if (Math.random() > 0.7) {
      suggestions.kpiDisplayMode = 'delta'; // Suggest focusing on rate of change during high-volatility periods
    }

    // Example 3: AI Persona alignment based on input complexity
    if (currentSettings.aiVerbosityLevel >= 4) {
      suggestions.aiAgentPersona = 'Strategist';
    }

    // Example 4: Security Threshold recalibration based on simulated threat vectors
    if (currentSettings.securityAlertThreshold < 1.5) {
      suggestions.securityAlertThreshold = 2.5; // Increase sensitivity slightly
    }

    console.log(`[AI Core] Analysis complete. Suggestions generated.`);
    return suggestions;
  },

  /**
   * Generates a contextually relevant, mission-aligned greeting or status update.
   * @param persona The AI agent persona to adopt.
   * @returns A string containing the generated narrative.
   */
  async generateNarrative(persona: UserProfileSettings['aiAgentPersona']): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    switch (persona) {
      case 'Sovereign':
        return "The architecture is stable. Your sovereignty is the primary directive. Proceed with strategic intent.";
      case 'Analyst':
        return "Data streams indicate optimal configuration for Q3 projections. Reviewing latent variables now.";
      case 'Strategist':
        return "The path to legacy construction requires precision. Personalization aligns the interface with the objective function.";
      case 'Guardian':
        return "Perimeter integrity confirmed. All personalization vectors are secured against external entropy.";
      default:
        return "Interface initialized. Awaiting command input.";
    }
  }
};

// --- Initial State Configuration ---

const INITIAL_STATE: UserProfileSettings = {
  theme: 'system',
  primaryColor: '#4299E1', // Default Chakra blue
  fontFamily: 'Inter, sans-serif',
  dashboardLayout: 'modular',
  kpiDisplayMode: 'projection',
  aiVerbosityLevel: 3,
  securityAlertThreshold: 2.0,
  preferredCurrency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  language: navigator.language.substring(0, 2).toUpperCase() || 'EN',
  financialNarrativeStyle: 'visionary',
  dataDensity: 'medium',
  enablePredictiveModeling: true,
  customMetricTags: ['Legacy', 'Velocity', 'Sovereignty'],
  aiAgentName: 'idgafai_Proxy',
  aiAgentPersona: 'Sovereign',
  biometricAuthEnabled: false,
  quantumEncryptionLevel: 'L2',
  transactionVisualizationStyle: 'network',
};

// --- Component: AI Suggestion Banner ---

interface AISuggestionBannerProps {
  onApply: (updates: Partial<UserProfileSettings>) => void;
  suggestions: Partial<UserProfileSettings>;
  isLoading: boolean;
}

const AISuggestionBanner: React.FC<AISuggestionBannerProps> = ({ onApply, suggestions, isLoading }) => {
  const suggestionKeys = Object.keys(suggestions).length;

  if (suggestionKeys === 0 || isLoading) {
    return null;
  }

  const handleApplyAll = () => {
    onApply(suggestions);
  };

  return (
    <Card mb={6} borderLeft="4px solid" borderColor="purple.500" bg="purple.50" shadow="lg">
      <CardBody>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <StarIcon color="purple.600" boxSize={6} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" color="purple.800">
                AI Optimization Recommendation ({suggestionKeys} items)
              </Text>
              <Text fontSize="sm" color="purple.600">
                The Sovereign Intelligence suggests recalibrating settings based on your operational profile.
              </Text>
            </VStack>
          </HStack>
          <HStack>
            {isLoading ? (
              <Spinner size="sm" color="purple.500" />
            ) : (
              <Button
                colorScheme="purple"
                size="sm"
                onClick={handleApplyAll}
                leftIcon={<ArrowUpIcon />}
              >
                Apply All Optimizations
              </Button>
            )}
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};


// --- Component: Tag Management Sub-Component ---

interface TagManagerProps {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newTag = inputValue.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag) && newTag.length > 1) {
        onTagsChange([...tags, newTag]);
        setInputValue('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <VStack align="stretch" spacing={3}>
      <FormLabel fontSize="md">Custom Metric Tags (Legacy Anchors)</FormLabel>
      <Box
        p={3}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        minH="40px"
        bg="white"
      >
        <HStack wrap="wrap" spacing={2}>
          {tags.map((tag) => (
            <Tag
              size="md"
              key={tag}
              borderRadius="full"
              colorScheme="teal"
              variant="solid"
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
            </Tag>
          ))}
        </HStack>
      </Box>
      <Input
        placeholder="Add new tag (e.g., 'Velocity', 'Disruption')"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        size="sm"
        bg="white"
      />
      <Text fontSize="xs" color="gray.500">Press Enter or comma to add tags defining your core focus areas.</Text>
    </VStack>
  );
};


// --- Main Component: PersonalizationView ---

const PersonalizationView: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [settings, setSettings] = useState<UserProfileSettings>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [aiNarrative, setAiNarrative] = useState('');
  const [suggestions, setSuggestions] = useState<Partial<UserProfileSettings>>({});

  // --- Initialization and AI Narrative Fetch ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // 1. Load AI Narrative
        const narrative = await AIService.generateNarrative(settings.aiAgentPersona);
        setAiNarrative(narrative);

        // 2. Run initial AI suggestion sweep
        const initialSuggestions = await AIService.analyzeAndSuggest(settings);
        setSuggestions(initialSuggestions);

      } catch (error) {
        console.error("Initialization failed:", error);
        toast({
          title: "Initialization Error",
          description: "Could not load initial AI context.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []); // Run once on mount

  // --- Handlers ---

  const handleChange = useCallback((key: keyof UserProfileSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };

      // Immediate UI feedback for critical changes
      if (key === 'theme') {
        // Note: Chakra's colorMode handles the actual theme switch, but we update state for persistence/display
        // We rely on the system hook for actual toggle, but update state for consistency.
      }

      // Re-trigger AI analysis on significant structural changes (simplified for this scope)
      // In a real system, this would debounce heavily.
      if (key === 'aiVerbosityLevel' || key === 'securityAlertThreshold') {
        AIService.analyzeAndSuggest(newSettings).then(setSuggestions);
      }

      return newSettings;
    });
  }, [toast]);

  const handleApplyAISuggestions = useCallback(async (updates: Partial<UserProfileSettings>) => {
    setIsLoading(true);
    toast({
      title: "Applying Optimizations",
      description: "Integrating AI-derived configuration adjustments.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    // Simulate deep integration process
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSettings(prev => {
      const finalSettings = { ...prev, ...updates };

      // Apply theme change immediately if suggested
      if (updates.theme && updates.theme !== prev.theme) {
        // If the suggestion is 'system', we rely on the system hook, otherwise force it.
        if (updates.theme === 'light' || updates.theme === 'dark') {
          // This is a simplified call; in a real app, we'd check if the suggestion matches the current system state.
          // For demonstration, we force the toggle if the suggestion is explicit.
          if (colorMode !== updates.theme) {
             // toggleColorMode(); // Disabled here to prevent rapid flickering during state update simulation
          }
        }
      }

      return finalSettings;
    });

    setSuggestions({}); // Clear suggestions
    setIsLoading(false);
    toast({
      title: "Configuration Updated",
      description: "Your environment has been optimized for mission execution.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }, [toast, colorMode]);

  const handleSave = useCallback(() => {
    // In a real application, this would trigger an API call to persist settings.
    console.log("Saving Final Configuration:", settings);
    toast({
      title: "Configuration Persisted",
      description: "Your sovereign preferences are now locked into the core matrix.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  }, [settings, toast]);

  // --- Render Helpers ---

  const renderThemeControl = () => (
    <FormControl>
      <FormLabel>Interface Theme Protocol</FormLabel>
      <HStack spacing={4} p={3} border="1px solid" borderColor="gray.200" borderRadius="md" bg="white">
        <Text flex={1}>Current Mode: <Badge colorScheme={colorMode === 'dark' ? 'purple' : 'blue'}>{colorMode.toUpperCase()}</Badge></Text>
        <Button
          onClick={() => {
            toggleColorMode();
            handleChange('theme', colorMode === 'dark' ? 'light' : 'dark'); // Update state to reflect manual change
          }}
          leftIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          size="sm"
        >
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
        <Select
          value={settings.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
          size="sm"
          isDisabled={isLoading}
        >
          <option value="light">Light (Static)</option>
          <option value="dark">Dark (Static)</option>
          <option value="system">System Sync (Adaptive)</option>
        </Select>
      </HStack>
    </FormControl>
  );

  const renderAIAgentControl = () => (
    <VStack spacing={4} p={4} bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'} borderRadius="lg" shadow="inner">
      <Heading size="md" color="indigo.400" display="flex" alignItems="center">
        <AtSignIcon mr={2} /> AI Agent Configuration Matrix
      </Heading>

      <FormControl>
        <FormLabel fontSize="sm">AI Proxy Name</FormLabel>
        <Input
          value={settings.aiAgentName}
          onChange={(e) => handleChange('aiAgentName', e.target.value)}
          isDisabled={isLoading}
          bg="white"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">AI Agent Persona Core</FormLabel>
        <Select
          value={settings.aiAgentPersona}
          onChange={(e) => {
            handleChange('aiAgentPersona', e.target.value as UserProfileSettings['aiAgentPersona']);
            // Immediately fetch new narrative upon persona change
            AIService.generateNarrative(e.target.value as UserProfileSettings['aiAgentPersona']).then(setAiNarrative);
          }}
          isDisabled={isLoading}
          bg="white"
        >
          <option value="Sovereign">Sovereign (First Principles)</option>
          <option value="Analyst">Analyst (Data Synthesis)</option>
          <option value="Strategist">Strategist (Long-Term Vectoring)</option>
          <option value="Guardian">Guardian (Security Focus)</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">AI Verbosity Level (Detail Output)</FormLabel>
        <HStack spacing={4}>
          <Progress value={settings.aiVerbosityLevel * 20} flex={1} colorScheme="green" />
          <Text fontSize="lg" fontWeight="bold" w="10">{settings.aiVerbosityLevel}</Text>
        </HStack>
        <Input
          type="range"
          min="1"
          max="5"
          step="1"
          value={settings.aiVerbosityLevel}
          onChange={(e) => handleChange('aiVerbosityLevel', parseInt(e.target.value))}
          isDisabled={isLoading}
        />
        <Text fontSize="xs" color="gray.500">Level 5 provides quantum-level detail; Level 1 is executive summary only.</Text>
      </FormControl>

      <Box w="full" p={3} bg={colorMode === 'dark' ? 'gray.800' : 'white'} borderRadius="md" border="1px dashed" borderColor="indigo.300">
        <Text fontSize="sm" fontStyle="italic" color="indigo.300">
          <InfoOutlineIcon mr={1} /> AI Contextual Output: {aiNarrative || "Loading..."}
        </Text>
      </Box>
    </VStack>
  );

  const renderSecurityControls = () => (
    <VStack spacing={4} p={4} bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'} borderRadius="lg" shadow="inner">
      <Heading size="md" color="red.400" display="flex" alignItems="center">
        <LockIcon mr={2} /> Quantum Security & Anomaly Thresholds
      </Heading>

      <FormControl>
        <FormLabel fontSize="sm">Security Alert Threshold (% Delta)</FormLabel>
        <HStack spacing={4}>
          <Progress value={settings.securityAlertThreshold * 5} colorScheme="red" flex={1} />
          <Text fontSize="lg" fontWeight="bold" w="10">{settings.securityAlertThreshold.toFixed(1)}%</Text>
        </HStack>
        <Input
          type="range"
          min="0.5"
          max="5.0"
          step="0.1"
          value={settings.securityAlertThreshold}
          onChange={(e) => handleChange('securityAlertThreshold', parseFloat(e.target.value))}
          isDisabled={isLoading}
        />
        <Text fontSize="xs" color="gray.500">Triggers high-alert if any monitored metric deviates by this percentage from projection.</Text>
      </FormControl>

      <FormControl display="flex" alignItems="center" justifyContent="space-between">
        <FormLabel htmlFor="biometric-auth" mb="0">Biometric Authentication Integration</FormLabel>
        <Switch
          id="biometric-auth"
          isChecked={settings.biometricAuthEnabled}
          onChange={(e) => handleChange('biometricAuthEnabled', e.target.checked)}
          colorScheme="red"
          isDisabled={isLoading}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Quantum Encryption Layer</FormLabel>
        <Select
          value={settings.quantumEncryptionLevel}
          onChange={(e) => handleChange('quantumEncryptionLevel', e.target.value as UserProfileSettings['quantumEncryptionLevel'])}
          isDisabled={isLoading}
          bg="white"
        >
          <option value="L1">Level 1 (Standard Post-Quantum)</option>
          <option value="L2">Level 2 (Entangled Key Exchange)</option>
          <option value="L3">Level 3 (Hyperspace Redundancy)</option>
        </Select>
      </FormControl>
    </VStack>
  );


  // --- Main Render ---
  return (
    <Box p={{ base: 4, md: 10 }} minH="100vh" bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">

        <Heading as="h1" size="2xl" color={colorMode === 'dark' ? 'white' : 'gray.800'} borderBottom="2px solid" borderColor="purple.500" pb={2}>
          <SettingsIcon mr={3} /> Sovereign Personalization Matrix
        </Heading>

        <Text fontSize="lg" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
          This interface aligns the operational aesthetics and cognitive parameters of your financial ecosystem with the mission parameters established by James Burvel O'Callaghan III. Every setting here is a lever for systemic efficiency.
        </Text>

        {/* AI Recommendation System */}
        <AISuggestionBanner
          onApply={handleApplyAISuggestions}
          suggestions={suggestions}
          isLoading={isLoading}
        />

        {/* CORE SETTINGS GRID */}
        <Card shadow="xl" p={6} bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
          <CardHeader>
            <Heading size="lg" color="purple.400">Interface & Display Configuration</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* 1. Theme Control */}
              <Box>{renderThemeControl()}</Box>

              {/* 2. Dashboard Layout */}
              <FormControl>
                <FormLabel>Dashboard Layout Protocol</FormLabel>
                <Select
                  value={settings.dashboardLayout}
                  onChange={(e) => handleChange('dashboardLayout', e.target.value)}
                  isDisabled={isLoading}
                  bg="white"
                >
                  <option value="modular">Modular (High Customization)</option>
                  <option value="streamlined">Streamlined (Focus on Flow)</option>
                  <option value="executive">Executive (KPI Density)</option>
                </Select>
              </FormControl>

              {/* 3. KPI Display Mode */}
              <FormControl>
                <FormLabel>KPI Reporting Mode</FormLabel>
                <Select
                  value={settings.kpiDisplayMode}
                  onChange={(e) => handleChange('kpiDisplayMode', e.target.value)}
                  isDisabled={isLoading}
                  bg="white"
                >
                  <option value="absolute">Absolute Value</option>
                  <option value="delta">Delta Change (Rate of Shift)</option>
                  <option value="projection">Projected Trajectory (AI Forecast)</option>
                </Select>
              </FormControl>

              {/* 4. Data Density */}
              <FormControl>
                <FormLabel>Information Density</FormLabel>
                <Select
                  value={settings.dataDensity}
                  onChange={(e) => handleChange('dataDensity', e.target.value)}
                  isDisabled={isLoading}
                  bg="white"
                >
                  <option value="low">Low (Cognitive Load Reduction)</option>
                  <option value="medium">Medium (Standard Operational)</option>
                  <option value="high">High (Maximum Data Saturation)</option>
                </Select>
              </FormControl>

              {/* 5. Primary Color Accent */}
              <FormControl>
                <FormLabel>Primary Accent Color (System Branding)</FormLabel>
                <HStack>
                  <Input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    h="38px"
                    w="38px"
                    p={0}
                    border="none"
                    cursor="pointer"
                  />
                  <Input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    isDisabled={isLoading}
                    bg="white"
                  />
                </HStack>
              </FormControl>

              {/* 6. Transaction Visualization Style */}
              <FormControl>
                <FormLabel>Transaction Visualization Style</FormLabel>
                <Select
                  value={settings.transactionVisualizationStyle}
                  onChange={(e) => handleChange('transactionVisualizationStyle', e.target.value)}
                  isDisabled={isLoading}
                  bg="white"
                >
                  <option value="flow">Flow Diagram (Linear)</option>
                  <option value="network">Network Graph (Interconnectivity)</option>
                  <option value="timeline">Chronological Timeline</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* AI & SECURITY MATRIX */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {renderAIAgentControl()}
          {renderSecurityControls()}
        </SimpleGrid>

        {/* LINGUISTIC & GEOSPATIAL ALIGNMENT */}
        <Card shadow="xl" p={6} bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
          <CardHeader>
            <Heading size="lg" color="cyan.400">Linguistic & Temporal Sovereignty</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <FormControl>
                <FormLabel fontSize="sm">Preferred Language Code</FormLabel>
                <Input
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value.toUpperCase())}
                  isDisabled={isLoading}
                  bg="white"
                />
                <Text fontSize="xs" color="gray.500">ISO 639-1 format (e.g., EN, ES, ZH)</Text>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Timezone Synchronization</FormLabel>
                <Input
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  isDisabled={isLoading}
                  bg="white"
                />
                <Text fontSize="xs" color="gray.500">IANA format (e.g., America/New_York)</Text>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Preferred Currency Anchor</FormLabel>
                <Input
                  value={settings.preferredCurrency}
                  onChange={(e) => handleChange('preferredCurrency', e.target.value.toUpperCase())}
                  isDisabled={isLoading}
                  bg="white"
                />
                <Text fontSize="xs" color="gray.500">ISO 4217 format (e.g., USD, EUR, JPY)</Text>
              </FormControl>

              <FormControl gridColumn={{ base: '1', md: 'span 3' }}>
                <FormLabel fontSize="sm">Financial Narrative Style</FormLabel>
                <Select
                  value={settings.financialNarrativeStyle}
                  onChange={(e) => handleChange('financialNarrativeStyle', e.target.value)}
                  isDisabled={isLoading}
                  bg="white"
                >
                  <option value="formal">Formal (Regulatory Compliance)</option>
                  <option value="direct">Direct (Unfiltered Data)</option>
                  <option value="visionary">Visionary (Mission Alignment)</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* ADVANCED METRICS AND PREDICTION */}
        <Card shadow="xl" p={6} bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
          <CardHeader>
            <Heading size="lg" color="orange.400">Predictive Modeling & Metric Anchoring</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <VStack align="start">
                  <FormLabel htmlFor="predictive-modeling" mb="0">Enable Predictive Modeling Engine</FormLabel>
                  <Text fontSize="xs" color="gray.500">Utilizes latent space analysis for forward-looking simulations.</Text>
                </VStack>
                <Switch
                  id="predictive-modeling"
                  isChecked={settings.enablePredictiveModeling}
                  onChange={(e) => handleChange('enablePredictiveModeling', e.target.checked)}
                  colorScheme="orange"
                  isDisabled={isLoading}
                />
              </FormControl>

              <FormControl>
                <TagManager
                  tags={settings.customMetricTags}
                  onTagsChange={(newTags) => handleChange('customMetricTags', newTags)}
                />
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>


        {/* PERSISTENCE LAYER */}
        <Flex justify="flex-end" pt={4} borderTop="1px solid" borderColor="gray.700">
          <Button
            colorScheme="green"
            size="lg"
            onClick={handleSave}
            leftIcon={<CheckCircleIcon />}
            isLoading={isLoading}
            loadingText="Synchronizing..."
          >
            Commit Configuration to Sovereign Ledger
          </Button>
        </Flex>

      </VStack>
    </Box>
  );
};

export default PersonalizationView;