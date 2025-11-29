import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Image,
  Select,
  Switch,
  useToast,
  Spinner,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
  Tooltip,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Badge,
} from '@chakra-ui/react';
import {
  FaMagic,
  FaPalette,
  FaStamp,
  FaBrain,
  FaEye,
  FaSave,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

// --- MOCK AI SERVICE INTERFACE ---
// In a real system, this would interface with a high-throughput, low-latency quantum-entangled AI core.
// For this simulation, we use mock async functions.

interface AiGenerationRequest {
  prompt: string;
  style: 'photorealistic' | 'abstract' | 'minimalist' | 'cyberpunk';
  complexity: number; // 1 to 100
}

interface AiGenerationResult {
  imageUrl: string;
  story: string;
  metadata: {
    tokensUsed: number;
    processingTimeMs: number;
  };
}

const mockGenerateCardImage = async (req: AiGenerationRequest): Promise<AiGenerationResult> => {
  console.log('Simulating AI Image Generation Request:', req);
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // Simulate network latency and processing

  const mockImageBase = 'https://picsum.photos/seed/';
  const seed = Math.floor(Math.random() * 10000);

  return {
    imageUrl: `${mockImageBase}${seed}/400/250`,
    story: `The ${req.style} sigil, forged under the computational pressure of ${req.complexity} units, represents the user's current epochal trajectory. Its essence is derived from the prompt: "${req.prompt.substring(0, 50)}...". This artifact embodies the fusion of sovereign identity and decentralized finance, a testament to the O'Callaghan Mandate.`,
    metadata: {
      tokensUsed: req.complexity * 10,
      processingTimeMs: 1500 + Math.floor(Math.random() * 1000),
    },
  };
};

const mockGenerateCardStory = async (keywords: string[]): Promise<string> => {
  console.log('Simulating AI Story Generation Request with keywords:', keywords);
  await new Promise(resolve => setTimeout(resolve, 800));

  if (keywords.length === 0) {
    return "A blank slate awaits the inscription of destiny. Define your core tenets to begin the narrative.";
  }

  const narrativeCore = keywords.join(', ');
  return `The Sovereign Artifact, designated for the custodian of ${narrativeCore}, is not merely plastic and silicon. It is a materialized contract with the future. Its narrative is woven from the threads of ambition, secured by cryptographic certainty, and validated by the collective intelligence of the network. This card is the physical manifestation of financial autonomy, a beacon against the shadows of legacy systems.`;
};

// --- TYPE DEFINITIONS ---

interface CardDesignState {
  baseColor: string;
  texture: 'matte' | 'glossy' | 'holographic' | 'metallic';
  aiPrompt: string;
  aiStyle: 'photorealistic' | 'abstract' | 'minimalist' | 'cyberpunk';
  aiComplexity: number;
  isAiGenerated: boolean;
  customKeywords: string[];
}

interface CardArtifact {
  id: string;
  design: CardDesignState;
  imageUrl: string;
  cardStory: string;
  status: 'draft' | 'pending_review' | 'active' | 'archived';
  createdAt: number;
}

// --- UTILITY COMPONENTS ---

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <HStack spacing={3} mb={4} borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')} pb={2}>
    {icon}
    <Heading size="md" color={useColorModeValue('gray.700', 'gray.200')}>{title}</Heading>
  </HStack>
);

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <Flex
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    bg="rgba(0, 0, 0, 0.6)"
    zIndex={10}
    justifyContent="center"
    alignItems="center"
    borderRadius="lg"
  >
    <VStack spacing={4}>
      <Spinner size="xl" color="teal.400" thickness="4px" />
      <Text color="white" fontSize="lg" fontWeight="bold">{message}</Text>
    </VStack>
  </Flex>
);

// --- MAIN COMPONENT ---

const CardCustomizationView: React.FC = () => {
  const toast = useToast();
  const [design, setDesign] = useState<CardDesignState>({
    baseColor: '#007bff',
    texture: 'metallic',
    aiPrompt: 'A fractal representation of decentralized ledger growth.',
    aiStyle: 'cyberpunk',
    aiComplexity: 75,
    isAiGenerated: true,
    customKeywords: ['Sovereignty', 'Velocity', 'Immutable'],
  });
  const [artifact, setArtifact] = useState<CardArtifact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const cardBgColor = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  // --- HANDLERS ---

  const handleDesignChange = useCallback((key: keyof CardDesignState, value: any) => {
    setDesign(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleKeywordManagement = useCallback((action: 'add' | 'remove', keyword?: string, newKeywords?: string[]) => {
    setDesign(prev => {
      let updatedKeywords = [...prev.customKeywords];
      if (action === 'add' && keyword && !updatedKeywords.includes(keyword.trim())) {
        updatedKeywords.push(keyword.trim());
      } else if (action === 'remove' && keyword) {
        updatedKeywords = updatedKeywords.filter(k => k !== keyword);
      } else if (action === 'set' && newKeywords) {
        updatedKeywords = newKeywords;
      }
      return { ...prev, customKeywords: updatedKeywords };
    });
  }, []);

  const generateArtifact = useCallback(async () => {
    if (!design.isAiGenerated) {
      toast({
        title: "Generation Disabled",
        description: "AI generation is toggled off. Please enable it or manually configure the design.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const request: AiGenerationRequest = {
        prompt: design.aiPrompt,
        style: design.aiStyle,
        complexity: design.aiComplexity,
      };

      const [imageResult, storyResult] = await Promise.all([
        mockGenerateCardImage(request),
        mockGenerateCardStory(design.customKeywords),
      ]);

      const newArtifact: CardArtifact = {
        id: `CARD-${Date.now()}`,
        design: design,
        imageUrl: imageResult.imageUrl,
        cardStory: storyResult,
        status: 'draft',
        createdAt: Date.now(),
      };

      setArtifact(newArtifact);
      toast({
        title: "Sigil Forged",
        description: `Artifact ${newArtifact.id} generated successfully. Review the narrative and finalize.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Artifact Generation Error:", error);
      toast({
        title: "Forge Failure",
        description: "The AI core encountered an anomaly during sigil creation.",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [design, toast]);

  const handleSaveFinalization = useCallback(async () => {
    if (!artifact) {
      toast({
        title: "No Artifact to Save",
        description: "Please generate the card design first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate persistence to the Sovereign Ledger Database (SLDB)
      await new Promise(resolve => setTimeout(resolve, 1200));

      const finalizedArtifact: CardArtifact = {
        ...artifact,
        status: 'pending_review', // In a real system, this triggers compliance/security checks
      };
      setArtifact(finalizedArtifact);

      toast({
        title: "Design Submitted",
        description: `Card ${finalizedArtifact.id} submitted for cryptographic validation. Status: ${finalizedArtifact.status}.`,
        status: "info",
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Save Error:", error);
      toast({
        title: "Persistence Error",
        description: "Failed to commit the artifact to the ledger.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [artifact, toast]);

  // --- DERIVED STATE & MEMOIZATION ---

  const isReadyToGenerate = useMemo(() => design.isAiGenerated && design.aiPrompt.length > 10, [design]);
  const isReadyToFinalize = useMemo(() => artifact?.status === 'draft', [artifact]);

  const cardPreviewStyle = useMemo(() => ({
    backgroundColor: design.isAiGenerated ? 'transparent' : design.baseColor,
    backgroundImage: design.isAiGenerated ? `url(${artifact?.imageUrl || 'https://via.placeholder.com/400x250?text=AI+Rendering+Pending'})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px ${design.baseColor}80`,
    border: `3px solid ${design.texture === 'metallic' ? '#FFD700' : design.texture === 'holographic' ? '#00FFFF' : '#FFFFFF'}`,
    transition: 'all 0.5s ease-in-out',
  }), [design, artifact]);

  const keywordInputBg = useColorModeValue('white', 'gray.700');

  // --- SUB-COMPONENTS ---

  const AiConfigurationPanel = () => (
    <VStack spacing={4} align="stretch" p={4} bg={useColorModeValue('gray.50', 'gray.750')} borderRadius="lg">
      <SectionTitle icon={<FaBrain size="1.2em" color="teal.400" />} title="Cognitive Synthesis Engine (AI)" />

      <FormControl isRequired>
        <FormLabel>Core Intent Prompt (The Genesis Seed)</FormLabel>
        <Textarea
          value={design.aiPrompt}
          onChange={(e) => handleDesignChange('aiPrompt', e.target.value)}
          placeholder="Describe the essence of your financial sovereignty..."
          rows={3}
          isDisabled={!design.isAiGenerated}
        />
        <Tooltip label="This prompt guides the AI in generating the visual sigil and narrative foundation.">
          <Badge colorScheme="purple" mt={1} variant="solid">High-Dimensional Input Required</Badge>
        </Tooltip>
      </FormControl>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Visual Style Matrix</FormLabel>
          <Select
            value={design.aiStyle}
            onChange={(e) => handleDesignChange('aiStyle', e.target.value as CardDesignState['aiStyle'])}
            isDisabled={!design.isAiGenerated}
          >
            <option value="cyberpunk">Cyberpunk Nexus</option>
            <option value="photorealistic">Photorealistic Truth</option>
            <option value="abstract">Abstract Axiom</option>
            <option value="minimalist">Minimalist Purity</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Computational Complexity ({design.aiComplexity})</FormLabel>
          <Input
            type="range"
            min="10"
            max="100"
            step="5"
            value={design.aiComplexity}
            onChange={(e) => handleDesignChange('aiComplexity', parseInt(e.target.value))}
            isDisabled={!design.isAiGenerated}
          />
        </FormControl>
      </HStack>

      <FormControl display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <FormLabel mb="0">Activate AI Synthesis</FormLabel>
        <Switch
          isChecked={design.isAiGenerated}
          onChange={(e) => handleDesignChange('isAiGenerated', e.target.checked)}
          colorScheme="teal"
        />
      </FormControl>
    </VStack>
  );

  const ManualConfigurationPanel = () => (
    <VStack spacing={4} align="stretch" p={4} bg={useColorModeValue('gray.50', 'gray.750')} borderRadius="lg">
      <SectionTitle icon={<FaPalette size="1.2em" color="orange.400" />} title="Manual Material Configuration" />

      <FormControl>
        <FormLabel>Base Color Override (Hexadecimal)</FormLabel>
        <HStack>
          <Input
            type="color"
            value={design.baseColor}
            onChange={(e) => handleDesignChange('baseColor', e.target.value)}
            isDisabled={design.isAiGenerated}
            h={10}
          />
          <Input
            value={design.baseColor}
            onChange={(e) => handleDesignChange('baseColor', e.target.value)}
            isDisabled={design.isAiGenerated}
          />
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>Surface Texture Protocol</FormLabel>
        <Select
          value={design.texture}
          onChange={(e) => handleDesignChange('texture', e.target.value as CardDesignState['texture'])}
          isDisabled={design.isAiGenerated}
        >
          <option value="metallic">Metallic Sheen (Permanence)</option>
          <option value="glossy">High-Gloss Finish (Reflectivity)</option>
          <option value="holographic">Quantum Holographic (Dimensionality)</option>
          <option value="matte">Matte Absorption (Stealth)</option>
        </Select>
      </FormControl>
    </VStack>
  );

  const KeywordManagementPanel = () => {
    const [newKeywordInput, setNewKeywordInput] = useState('');

    const handleAddKeyword = () => {
      if (newKeywordInput.trim()) {
        handleKeywordManagement('add', newKeywordInput.trim());
        setNewKeywordInput('');
      }
    };

    return (
      <VStack spacing={4} align="stretch" p={4} bg={useColorModeValue('gray.50', 'gray.750')} borderRadius="lg">
        <SectionTitle icon={<FaStamp size="1.2em" color="blue.400" />} title="Narrative Anchors (Keywords)" />
        <Text fontSize="sm" color="gray.500">Define core concepts that must be woven into the Card Story by the AI.</Text>

        <HStack>
          <Input
            value={newKeywordInput}
            onChange={(e) => setNewKeywordInput(e.target.value)}
            placeholder="Enter a core concept (e.g., 'Decentralization')"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddKeyword();
            }}
            isDisabled={!design.isAiGenerated}
          />
          <IconButton
            icon={<FaUpload />}
            onClick={handleAddKeyword}
            colorScheme="blue"
            isDisabled={!design.isAiGenerated || !newKeywordInput.trim()}
            aria-label="Add Keyword"
          />
        </HStack>

        <Box minH="50px" p={2} border={design.customKeywords.length > 0 ? '1px dashed' : 'none'} borderColor="gray.400" borderRadius="md">
          {design.customKeywords.length === 0 ? (
            <Text color="gray.500" fontStyle="italic">No anchors defined. AI will rely solely on the prompt.</Text>
          ) : (
            <HStack wrap="wrap" spacing={2}>
              {design.customKeywords.map((keyword) => (
                <Tag key={keyword} size="md" colorScheme="blue" variant="subtle">
                  <TagLabel>{keyword}</TagLabel>
                  <Tooltip label="Remove Anchor">
                    <TagCloseButton onClick={() => handleKeywordManagement('remove', keyword)} />
                  </Tooltip>
                </Tag>
              ))}
            </HStack>
          )}
        </Box>
      </VStack>
    );
  };

  const ArtifactDisplay = () => {
    if (!artifact) {
      return (
        <Flex
          h="100%"
          minH="300px"
          bg={cardBgColor}
          border="2px dashed"
          borderColor={cardBorderColor}
          borderRadius="xl"
          justifyContent="center"
          alignItems="center"
          direction="column"
          p={6}
        >
          <FaEye size="3em" color={useColorModeValue('gray.400', 'gray.600')} mb={3} />
          <Text fontSize="xl" fontWeight="semibold" color={useColorModeValue('gray.500', 'gray.400')}>
            Artifact Preview Pending Synthesis
          </Text>
          <Text fontSize="sm" color="gray.400" mt={1}>
            Configure parameters and initiate generation to view your sovereign sigil here.
          </Text>
        </Flex>
      );
    }

    const statusColor = artifact.status === 'active' ? 'green' : artifact.status === 'pending_review' ? 'orange' : 'blue';

    return (
      <VStack spacing={6} align="stretch">
        <Box
          position="relative"
          w="100%"
          h="250px"
          borderRadius="xl"
          overflow="hidden"
          style={cardPreviewStyle}
        >
          {isLoading && <LoadingOverlay message="Synthesizing Reality..." />}
        </Box>

        <VStack spacing={3} p={4} bg={useColorModeValue('gray.50', 'gray.750')} borderRadius="lg">
          <HStack justifyContent="space-between" w="100%">
            <Text fontWeight="bold" fontSize="lg">Card Story (Mythos Codification)</Text>
            <Badge colorScheme={statusColor}>{artifact.status.toUpperCase()}</Badge>
          </HStack>
          <Textarea
            value={artifact.cardStory}
            onChange={(e) => setArtifact(prev => prev ? ({ ...prev, cardStory: e.target.value }) : null)}
            rows={6}
            isDisabled={artifact.status !== 'draft'}
            placeholder="The narrative generated by the AI..."
            fontSize="sm"
          />
          <Text fontSize="xs" color="gray.500" alignSelf="flex-start">
            Metadata: Processing Time: {artifact.design.isAiGenerated ? `${artifact.metadata.processingTimeMs}ms` : 'N/A'} | Complexity: {artifact.design.aiComplexity}
          </Text>
        </VStack>

        <HStack spacing={4}>
          <Button
            leftIcon={<FaSave />}
            colorScheme="teal"
            onClick={handleSaveFinalization}
            isDisabled={artifact.status !== 'draft' || isSaving}
            isLoading={isSaving}
            flex={1}
          >
            {artifact.status === 'draft' ? 'Submit for Validation' : 'View Finalized'}
          </Button>
          <Tooltip label="Discard Current Draft">
            <IconButton
              icon={<FaTrash />}
              colorScheme="red"
              onClick={() => {
                setArtifact(null);
                toast({ title: "Draft Discarded", status: "warning" });
              }}
              isDisabled={isSaving}
              aria-label="Discard Draft"
            />
          </Tooltip>
        </HStack>
      </VStack>
    );
  };


  // --- RENDER ---

  return (
    <Box p={{ base: 4, md: 10 }} bg={useColorModeValue('gray.100', 'gray.900')} minH="100vh">
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">
        <Heading as="h1" size="2xl" color="teal.500" mb={2}>
          Sovereign Sigil Forge <FaMagic style={{ display: 'inline-block', marginLeft: '10px' }} />
        </Heading>
        <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
          This interface governs the creation of your personalized, cryptographically secured financial instrument. Every parameter is a declaration of intent.
        </Text>

        <HStack spacing={{ base: 4, lg: 8 }} align="stretch" flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          {/* LEFT COLUMN: CONFIGURATION */}
          <Flex direction="column" gap={6} flex={{ base: '1 1 100%', lg: '1 1 40%' }}>
            {AiConfigurationPanel()}
            {ManualConfigurationPanel()}
            {KeywordManagementPanel()}

            <Button
              leftIcon={<FaMagic />}
              colorScheme="purple"
              size="lg"
              onClick={generateArtifact}
              isDisabled={!isReadyToGenerate || isLoading}
              isLoading={isLoading}
              mt={4}
            >
              {isLoading ? 'Engaging Quantum Fabric...' : 'Forge Sigil & Narrative'}
            </Button>
          </Flex>

          {/* RIGHT COLUMN: PREVIEW & ARTIFACT */}
          <Flex flex={{ base: '1 1 100%', lg: '1 1 60%' }} mt={{ base: 6, lg: 0 }}>
            <VStack spacing={6} align="stretch" w="100%">
              <Heading size="lg" color={useColorModeValue('gray.700', 'gray.100')}>
                Artifact Manifestation
              </Heading>
              {ArtifactDisplay()}
            </VStack>
          </Flex>
        </HStack>

        {/* FOOTER/STATUS BAR */}
        <Box p={4} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" shadow="lg" mt={8}>
          <HStack justifyContent="space-between" fontSize="sm" color="gray.500">
            <Text>System Status: Operational | Core Latency: <Badge colorScheme="green">12ms</Badge></Text>
            <Text>User Epoch ID: {artifact?.id || 'Uninitialized'}</Text>
            <Text>Last Action: {artifact ? (artifact.status === 'draft' ? 'Draft Ready' : 'Awaiting Validation') : 'Configuration'}</Text>
          </HStack>
        </Box>

      </VStack>
    </Box>
  );
};

export default CardCustomizationView;