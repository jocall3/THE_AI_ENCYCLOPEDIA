```tsx
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
  onContrastChange?: (contrast: 'high' | 'low' | 'default') => void;
  onMotionReduceChange?: (reduceMotion: boolean) => void;
  initialFontSize?: number;
  initialContrast?: 'high' | 'low' | 'default';
  initialReduceMotion?: boolean;
}

const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({
  onFontSizeChange,
  onContrastChange,
  onMotionReduceChange,
  initialFontSize = 16,
  initialContrast = 'default',
  initialReduceMotion = false,
}) => {
  const theme = useTheme();

  const [fontSize, setFontSize] = useState<number>(initialFontSize);
  const [contrast, setContrast] = useState<'high' | 'low' | 'default'>(initialContrast);
  const [reduceMotion, setReduceMotion] = useState<boolean>(initialReduceMotion);

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setFontSize(newValue);
      onFontSizeChange?.(newValue);
    }
  };

  const handleContrastChange = (newContrast: 'high' | 'low' | 'default') => {
    setContrast(newContrast);
    onContrastChange?.(newContrast);
  };

  const handleReduceMotionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReduceMotion = event.target.checked;
    setReduceMotion(newReduceMotion);
    onMotionReduceChange?.(newReduceMotion);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Accessibility
      </Typography>

      <Stack spacing={2} sx={{marginBottom: 2}}>
        <Typography id="font-size-slider" gutterBottom>
          Font Size
        </Typography>
        <Slider
          aria-labelledby="font-size-slider"
          value={fontSize}
          onChange={handleFontSizeChange}
          min={10}
          max={24}
          step={2}
          marks
          valueLabelDisplay="auto"
        />
      </Stack>


      <Divider sx={{marginBottom: 2}}/>

      <Stack spacing={2} sx={{marginBottom: 2}}>
        <Typography variant="body1" gutterBottom>
          Color Contrast
        </Typography>
        <FormControlLabel
          control={<Switch checked={contrast === 'high'} onChange={() => handleContrastChange('high')} />}
          label="High Contrast"
        />
        <FormControlLabel
          control={<Switch checked={contrast === 'low'} onChange={() => handleContrastChange('low')} />}
          label="Low Contrast"
        />
        <FormControlLabel
            control={<Switch checked={contrast === 'default'} onChange={() => handleContrastChange('default')} />}
            label="Default Contrast"
        />
      </Stack>

      <Divider sx={{marginBottom: 2}}/>

      <Stack spacing={2} sx={{marginBottom: 2}}>
        <FormControlLabel
          control={<Switch checked={reduceMotion} onChange={handleReduceMotionChange} />}
          label="Reduce Motion"
        />
      </Stack>
    </Box>
  );
};

export default AccessibilitySettingsPanel;
```