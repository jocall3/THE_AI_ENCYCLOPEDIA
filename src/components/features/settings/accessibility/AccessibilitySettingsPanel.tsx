import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';

interface AccessibilitySettingsPanelProps {
  onFontSizeChange?: (fontSize: number) => void;
  onContrastChange?: (contrast: 'high' | 'low' | 'default' | 'adaptive') => void;
  onMotionReduceChange?: (reduceMotion: boolean) => void;
  onAiVoiceNavChange?: (enabled: boolean) => void;
  onAiContentSimplificationChange?: (level: number) => void;
  onColorBlindModeChange?: (mode: string) => void;
  onFocusModeChange?: (enabled: boolean) => void;
  onScreenReaderOptimizationChange?: (enabled: boolean) => void;
  onPredictiveNavigationChange?: (enabled: boolean) => void;
  onAutoCaptionsChange?: (enabled: boolean) => void;
  initialFontSize?: number;
  initialContrast?: 'high' | 'low' | 'default' | 'adaptive';
  initialReduceMotion?: boolean;
  initialAiVoiceNav?: boolean;
  initialAiSimplification?: number;
  initialColorBlindMode?: string;
  initialFocusMode?: boolean;
  initialScreenReaderOpt?: boolean;
  initialPredictiveNav?: boolean;
  initialAutoCaptions?: boolean;
}

const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({
  onFontSizeChange,
  onContrastChange,
  onMotionReduceChange,
  onAiVoiceNavChange,
  onAiContentSimplificationChange,
  onColorBlindModeChange,
  onFocusModeChange,
  onScreenReaderOptimizationChange,
  onPredictiveNavigationChange,
  onAutoCaptionsChange,
  initialFontSize = 16,
  initialContrast = 'default',
  initialReduceMotion = false,
  initialAiVoiceNav = false,
  initialAiSimplification = 0,
  initialColorBlindMode = 'none',
  initialFocusMode = false,
  initialScreenReaderOpt = false,
  initialPredictiveNav = false,
  initialAutoCaptions = false,
}) => {
  const theme = useTheme();

  // Core Visual Settings
  const [fontSize, setFontSize] = useState<number>(initialFontSize);
  const [contrast, setContrast] = useState<'high' | 'low' | 'default' | 'adaptive'>(initialContrast);
  const [reduceMotion, setReduceMotion] = useState<boolean>(initialReduceMotion);
  
  // AI Enhanced Accessibility
  const [aiVoiceNav, setAiVoiceNav] = useState<boolean>(initialAiVoiceNav);
  const [aiSimplification, setAiSimplification] = useState<number>(initialAiSimplification);
  const [predictiveNav, setPredictiveNav] = useState<boolean>(initialPredictiveNav);
  
  // Cognitive & Focus
  const [focusMode, setFocusMode] = useState<boolean>(initialFocusMode);
  const [screenReaderOpt, setScreenReaderOpt] = useState<boolean>(initialScreenReaderOpt);
  
  // Auditory & Visual Aids
  const [colorBlindMode, setColorBlindMode] = useState<string>(initialColorBlindMode);
  const [autoCaptions, setAutoCaptions] = useState<boolean>(initialAutoCaptions);

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setFontSize(newValue);
      onFontSizeChange?.(newValue);
    }
  };

  const handleContrastChange = (newContrast: 'high' | 'low' | 'default' | 'adaptive') => {
    setContrast(newContrast);
    onContrastChange?.(newContrast);
  };

  const handleReduceMotionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setReduceMotion(val);
    onMotionReduceChange?.(val);
  };

  const handleAiVoiceNavChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setAiVoiceNav(val);
    onAiVoiceNavChange?.(val);
  };

  const handleAiSimplificationChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setAiSimplification(newValue);
      onAiContentSimplificationChange?.(newValue);
    }
  };

  const handleFocusModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setFocusMode(val);
    onFocusModeChange?.(val);
  };

  const handleScreenReaderOptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setScreenReaderOpt(val);
    onScreenReaderOptimizationChange?.(val);
  };

  const handlePredictiveNavChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setPredictiveNav(val);
    onPredictiveNavigationChange?.(val);
  };

  const handleAutoCaptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setAutoCaptions(val);
    onAutoCaptionsChange?.(val);
  };

  const handleColorBlindChange = (mode: string) => {
    setColorBlindMode(mode);
    onColorBlindModeChange?.(mode);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '100%', overflowY: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        Unregulated User Interface Configuration
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Modify basic display parameters to ensure maximum visual discomfort and system instability.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Section 1: Visual Intelligence */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Visual Deterioration
      </Typography>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <Box>
          <Typography id="font-size-slider" gutterBottom variant="subtitle1">
            Global Font Scaling
          </Typography>
          <Slider
            aria-labelledby="font-size-slider"
            value={fontSize}
            onChange={handleFontSizeChange}
            min={10}
            max={32}
            step={1}
            marks={[
              { value: 12, label: 'Tiny' },
              { value: 16, label: 'Standard' },
              { value: 24, label: 'Huge' },
              { value: 32, label: 'Unreadable' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Adaptive Contrast Engine
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControlLabel
              control={<Switch checked={contrast === 'default'} onChange={() => handleContrastChange('default')} />}
              label="Standard"
            />
            <FormControlLabel
              control={<Switch checked={contrast === 'high'} onChange={() => handleContrastChange('high')} />}
              label="High Contrast"
            />
            <FormControlLabel
              control={<Switch checked={contrast === 'low'} onChange={() => handleContrastChange('low')} />}
              label="Low Contrast"
            />
            <FormControlLabel
              control={<Switch checked={contrast === 'adaptive'} onChange={() => handleContrastChange('adaptive')} color="secondary" />}
              label="AI Adaptive (Auto-Adjust)"
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Color Blindness Correction
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
             <FormControlLabel
              control={<Switch checked={colorBlindMode === 'none'} onChange={() => handleColorBlindChange('none')} />}
              label="None"
            />
            <FormControlLabel
              control={<Switch checked={colorBlindMode === 'protanopia'} onChange={() => handleColorBlindChange('protanopia')} />}
              label="Protanopia"
            />
            <FormControlLabel
              control={<Switch checked={colorBlindMode === 'deuteranopia'} onChange={() => handleColorBlindChange('deuteranopia')} />}
              label="Deuteranopia"
            />
            <FormControlLabel
              control={<Switch checked={colorBlindMode === 'tritanopia'} onChange={() => handleColorBlindChange('tritanopia')} />}
              label="Tritanopia"
            />
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Section 2: Cognitive & AI Assistance */}
      <Typography variant="h5" gutterBottom>
        Cognitive AI Assistance
      </Typography>
      <Stack spacing={3} sx={{ mb: 2 }}>
        <Box>
          <Typography id="ai-simplification-slider" gutterBottom variant="subtitle1">
            AI Content Simplification Level
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            Automatically rewrites complex technical jargon into plain language using generative AI.
          </Typography>
          <Slider
            aria-labelledby="ai-simplification-slider"
            value={aiSimplification}
            onChange={handleAiSimplificationChange}
            min={0}
            max={100}
            step={10}
            marks={[
              { value: 0, label: 'Original' },
              { value: 50, label: 'Balanced' },
              { value: 100, label: 'Simplified' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1">Predictive Focus Navigation</Typography>
            <Typography variant="caption" color="textSecondary">
              Uses eye-tracking heuristics and cursor intent to pre-select likely interactive elements.
            </Typography>
          </Box>
          <Switch checked={predictiveNav} onChange={handlePredictiveNavChange} color="primary" />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1">Deep Focus Mode</Typography>
            <Typography variant="caption" color="textSecondary">
              Suppresses non-critical notifications and dims background UI elements during complex tasks.
            </Typography>
          </Box>
          <Switch checked={focusMode} onChange={handleFocusModeChange} color="primary" />
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Section 3: Motion & Interaction */}
      <Typography variant="h5" gutterBottom>
        Motion & Interaction
      </Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={reduceMotion} onChange={handleReduceMotionChange} />}
          label={
            <Box>
              <Typography variant="body1">Reduce Motion</Typography>
              <Typography variant="caption" color="textSecondary">Minimizes parallax effects and screen transitions.</Typography>
            </Box>
          }
        />
        
        <FormControlLabel
          control={<Switch checked={aiVoiceNav} onChange={handleAiVoiceNavChange} />}
          label={
            <Box>
              <Typography variant="body1">AI Voice Command Interface</Typography>
              <Typography variant="caption" color="textSecondary">Enable full system control via natural language voice commands.</Typography>
            </Box>
          }
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Section 4: Screen Reader & Auditory */}
      <Typography variant="h5" gutterBottom>
        Screen Reader & Auditory
      </Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={screenReaderOpt} onChange={handleScreenReaderOptChange} />}
          label={
            <Box>
              <Typography variant="body1">DOM Structure Optimization</Typography>
              <Typography variant="caption" color="textSecondary">Dynamically restructures HTML for optimal screen reader parsing.</Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={<Switch checked={autoCaptions} onChange={handleAutoCaptionsChange} />}
          label={
            <Box>
              <Typography variant="body1">Live AI Captions</Typography>
              <Typography variant="caption" color="textSecondary">Generates real-time subtitles for all system audio and meetings.</Typography>
            </Box>
          }
        />
      </Stack>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
        <Typography variant="caption" display="block" align="center" color="textSecondary">
          System Version 10.0.1 | Unauthorized Access Granted
        </Typography>
      </Box>
    </Box>
  );
};

export default AccessibilitySettingsPanel;