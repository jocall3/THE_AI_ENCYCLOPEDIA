import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setGlobalConfiguration } from '../../../../store/slices/themeSlice';
import { RootState } from '../../../../store/store';
import { Theme, GlobalConfiguration, AIIntegrationSettings } from '../../../../types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';
import {
  Palette as PaletteIcon,
  FormatColorFill as FormatColorFillIcon,
  TextFields as TextFieldsIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Palette as PaletteOutlinedIcon,
  SmartToy as SmartToyIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// --- Constants for Billion Dollar Features ---
const DEFAULT_FONT_OPTIONS: string[] = [
  'Inter', 'Roboto', 'Arial', 'Helvetica Neue', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma', 'Courier New'
];
const AI_MODEL_OPTIONS: string[] = ['GPT-4o-Enterprise', 'Claude-3-Opus-Pro', 'Gemini-Ultra-2.5', 'Proprietary-Quantum-LLM-v1'];

// --- Utility Components for Enhanced UI/UX ---

interface ColorControlProps {
  label: string;
  color: string;
  onColorChange: (color: string) => void;
  pickerKey: string;
  isPickerOpen: boolean;
  togglePicker: (key: string) => void;
}

const ColorControl: React.FC<ColorControlProps> = React.memo(({
  label,
  color,
  onColorChange,
  pickerKey,
  isPickerOpen,
  togglePicker
}) => {
  const handleColorChange = useCallback((colorResult: ColorResult) => {
    onColorChange(colorResult.hex);
  }, [onColorChange]);

  return (
    <Grid item xs={12} sm={6}>
      <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <FormatColorFillIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>{label}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            onClick={() => togglePicker(pickerKey)}
            sx={{ minWidth: 120, textTransform: 'none' }}
            startIcon={<PaletteOutlinedIcon />}
          >
            {color.toUpperCase()}
          </Button>
          <Box sx={{ width: 30, height: 30, backgroundColor: color, borderRadius: '4px', border: '1px solid #ccc' }} />
          <Tooltip title={`Toggle AI suggestion for ${label}`}>
            <IconButton size="small" color="secondary">
              <SmartToyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        {isPickerOpen && (
          <Box sx={{ position: 'absolute', zIndex: 1300, mt: 1, boxShadow: 3 }}>
            <ChromePicker
              color={color}
              onChange={handleColorChange}
              disableAlpha={true}
            />
          </Box>
        )}
      </Paper>
    </Grid>
  );
});

// --- Main Component ---

const ThemeBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTheme, globalConfig } = useSelector((state: RootState) => state.theme);

  // State for Theme Customization
  const [themeName, setThemeName] = useState<string>(currentTheme?.name || 'EnterpriseOS Default');
  const [primaryColor, setPrimaryColor] = useState<string>('#1976d2'); // MUI default primary blue
  const [secondaryColor, setSecondaryColor] = useState<string>('#9c27b0'); // A distinct secondary color
  const [backgroundColor, setBackgroundColor] = useState<string>('#f4f6f8'); // Light off-white background
  const [textColor, setTextColor] = useState<string>('#1a202c'); // Dark text for readability
  const [fontFamily, setFontFamily] = useState<string>(currentTheme?.typography?.fontFamily || DEFAULT_FONT_OPTIONS[0]);
  const [fontOptions] = useState<string[]>(DEFAULT_FONT_OPTIONS);

  // State for AI Integration Settings (Billion Dollar Feature)
  const [aiEnabled, setAiEnabled] = useState<boolean>(globalConfig?.aiIntegration?.enabled ?? true);
  const [aiModel, setAiModel] = useState<string>(globalConfig?.aiIntegration?.defaultModel ?? AI_MODEL_OPTIONS[0]);
  const [aiTone, setAiTone] = useState<string>(globalConfig?.aiIntegration?.defaultTone ?? 'Professional & Analytical');

  // State for Color Picker Visibility
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<{ [key: string]: boolean }>({
    primary: false,
    secondary: false,
    background: false,
    text: false,
  });

  // Initialize state from Redux store on load/change
  useEffect(() => {
    if (currentTheme) {
      setThemeName(currentTheme.name || 'Custom Theme');
      setPrimaryColor(currentTheme.palette?.primary?.main || '#1976d2');
      setSecondaryColor(currentTheme.palette?.secondary?.main || '#9c27b0');
      setBackgroundColor(currentTheme.palette?.background?.default || '#f4f6f8');
      setTextColor(currentTheme.palette?.text?.primary || '#1a202c');
      setFontFamily(currentTheme.typography?.fontFamily || DEFAULT_FONT_OPTIONS[0]);
    }
    if (globalConfig) {
        setAiEnabled(globalConfig.aiIntegration?.enabled ?? true);
        setAiModel(globalConfig.aiIntegration?.defaultModel ?? AI_MODEL_OPTIONS[0]);
        setAiTone(globalConfig.aiIntegration?.defaultTone ?? 'Professional & Analytical');
    }
  }, [currentTheme, globalConfig]);

  // Handlers
  const handleColorChange = useCallback((colorHex: string, field: keyof typeof isColorPickerOpen) => {
    switch (field) {
      case 'primary':
        setPrimaryColor(colorHex);
        break;
      case 'secondary':
        setSecondaryColor(colorHex);
        break;
      case 'background':
        setBackgroundColor(colorHex);
        break;
      case 'text':
        setTextColor(colorHex);
        break;
      default:
        break;
    }
  }, []);

  const toggleColorPicker = useCallback((field: string) => {
    setIsColorPickerOpen(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  }, []);

  const handleFontChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setFontFamily(event.target.value as string);
  }, []);

  const handleAiToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAiEnabled(event.target.checked);
  }, []);

  const handleAiModelChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setAiModel(event.target.value as string);
  }, []);

  const handleAiToneChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAiTone(event.target.value);
  }, []);

  // Memoized Theme Construction
  const newTheme: Theme = useMemo(() => ({
    name: themeName || 'Enterprise Theme',
    palette: {
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
      background: { default: backgroundColor },
      text: { primary: textColor },
      // Add more standard MUI palette extensions for enterprise readiness
      success: { main: '#2e7d32' },
      error: { main: '#c62828' },
      warning: { main: '#ff9800' },
    },
    typography: {
      fontFamily: fontFamily,
      h1: { fontSize: '3.5rem', fontWeight: 700 },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
    },
    // Future proofing: Add custom shadows, transitions, etc.
  }), [themeName, primaryColor, secondaryColor, backgroundColor, textColor, fontFamily]);

  // Memoized Global Configuration Construction
  const newGlobalConfig: GlobalConfiguration = useMemo(() => ({
    themeName: themeName || 'Enterprise Theme',
    lastUpdated: new Date().toISOString(),
    aiIntegration: {
        enabled: aiEnabled,
        defaultModel: aiModel,
        defaultTone: aiTone,
        // Placeholder for future AI feature flags
        semanticSearchEnabled: true,
        autoSummarizationThreshold: 5000,
    } as AIIntegrationSettings,
    kpiDashboardDefaults: {
        refreshRateSeconds: 60,
        defaultView: 'ExecutiveSummary',
    }
  }), [themeName, aiEnabled, aiModel, aiTone]);


  const handleApplyThemeAndConfig = useCallback(() => {
    dispatch(setTheme(newTheme));
    dispatch(setGlobalConfiguration(newGlobalConfig));
    // Optional: Show a temporary success notification here in a real app
    console.log('Theme and Global Configuration Applied Successfully.');
  }, [dispatch, newTheme, newGlobalConfig]);

  // Component Structure
  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <PaletteIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Enterprise Theme & AI Configuration Nexus
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          Define the visual identity and core AI operational parameters for the entire Enterprise Operating System. Every selection here impacts billions of data points across all modules.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Theme Customization Section */}
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} /> Visual Theme Definition
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              label="System Theme Identifier (Mandatory)"
              variant="outlined"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <Chip label="ID" size="small" color="primary" variant="outlined" sx={{ mr: 1 }} />
                ),
              }}
            />
          </Grid>

          <ColorControl
            label="Primary Accent Color"
            color={primaryColor}
            onColorChange={setPrimaryColor}
            pickerKey="primary"
            isPickerOpen={isColorPickerOpen.primary}
            togglePicker={toggleColorPicker}
          />
          <ColorControl
            label="Secondary Action Color"
            color={secondaryColor}
            onColorChange={setSecondaryColor}
            pickerKey="secondary"
            isPickerOpen={isColorPickerOpen.secondary}
            togglePicker={toggleColorPicker}
          />
          <ColorControl
            label="Base Background Canvas"
            color={backgroundColor}
            onColorChange={setBackgroundColor}
            pickerKey="background"
            isPickerOpen={isColorPickerOpen.background}
            togglePicker={togglePicker}
          />
          <ColorControl
            label="Primary Text/Data Color"
            color={textColor}
            onColorChange={setTextColor}
            pickerKey="text"
            isPickerOpen={isColorPickerOpen.text}
            togglePicker={togglePicker}
          />

          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" mb={1}>
                    <TextFieldsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>Typography Selection</Typography>
                </Box>
                <FormControl fullWidth>
                    <InputLabel id="font-family-label">Global Font Family</InputLabel>
                    <Select
                        labelId="font-family-label"
                        id="font-family-select"
                        value={fontFamily}
                        onChange={handleFontChange}
                        label="Global Font Family"
                        MenuProps={{ PaperProps: { style: { maxHeight: 400 } } }}
                    >
                        {fontOptions.map((font) => (
                            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Selected Font: {fontFamily} (Impacts all UI rendering)
                </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* AI Integration Configuration Section (The Billion Dollar Layer) */}
        <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} /> Core AI Operational Parameters
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3, borderLeft: `5px solid ${aiEnabled ? '#2e7d32' : '#c62828'}` }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">AI Engine Activation</Typography>
                <Box display="flex" alignItems="center">
                    <Typography>{aiEnabled ? 'Active' : 'Disabled'}</Typography>
                    <Switch
                        checked={aiEnabled}
                        onChange={handleAiToggle}
                        color="primary"
                        inputProps={{ 'aria-label': 'AI Engine Activation' }}
                    />
                    <Tooltip title={aiEnabled ? "AI services are running." : "AI services are paused for resource conservation."}>
                        <IconButton size="small" color={aiEnabled ? 'success' : 'error'}>
                            {aiEnabled ? <CheckCircleIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            <Grid container spacing={3} disabled={!aiEnabled}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel id="ai-model-label">Default Generative Model Endpoint</InputLabel>
                        <Select
                            labelId="ai-model-label"
                            id="ai-model-select"
                            value={aiModel}
                            onChange={handleAiModelChange}
                            label="Default Generative Model Endpoint"
                            disabled={!aiEnabled}
                        >
                            {AI_MODEL_OPTIONS.map((model) => (
                                <MenuItem key={model} value={model}>
                                    {model}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            Selecting a model dictates latency and reasoning capability across all AI features (Chat, Summarization, Code Generation).
                        </Typography>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Default AI Communication Tone"
                        variant="outlined"
                        value={aiTone}
                        onChange={handleAiToneChange}
                        fullWidth
                        disabled={!aiEnabled}
                        InputProps={{
                            startAdornment: (
                                <Tooltip title="AI Tone influences response style in all system communications.">
                                    <Chip label="TONE" size="small" color="secondary" variant="outlined" sx={{ mr: 1 }} />
                                </Tooltip>
                            ),
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        Current Tone: {aiTone}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>


        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleApplyThemeAndConfig}
            startIcon={<SaveIcon />}
            sx={{ padding: '10px 30px', fontSize: '1.1rem', fontWeight: 600 }}
          >
            Commit Configuration to System Core
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ThemeBuilder;