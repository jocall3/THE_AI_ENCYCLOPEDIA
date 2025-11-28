
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../../../store/slices/themeSlice';
import { RootState } from '../../../../store/store';
import { Theme } from '../../../../types';
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
} from '@mui/material';
import { ChromePicker } from 'react-color';

const ThemeBuilder = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const [themeName, setThemeName] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#3f51b5');
  const [secondaryColor, setSecondaryColor] = useState<string>('#f50057');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [fontFamily, setFontFamily] = useState<string>('Roboto');
  const [fontOptions, setFontOptions] = useState<string[]>(['Roboto', 'Arial', 'Helvetica', 'sans-serif']);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<{ [key: string]: boolean }>({
    primary: false,
    secondary: false,
    background: false,
    text: false,
  });

  useEffect(() => {
    if (currentTheme) {
      setThemeName(currentTheme.name || '');
      setPrimaryColor(currentTheme.palette?.primary.main || '#3f51b5');
      setSecondaryColor(currentTheme.palette?.secondary.main || '#f50057');
      setBackgroundColor(currentTheme.palette?.background.default || '#ffffff');
      setTextColor(currentTheme.palette?.text.primary || '#000000');
      setFontFamily(currentTheme.typography?.fontFamily || 'Roboto');
    }
  }, [currentTheme]);

  const handleColorChange = (color: any, field: string) => {
    switch (field) {
      case 'primary':
        setPrimaryColor(color.hex);
        break;
      case 'secondary':
        setSecondaryColor(color.hex);
        break;
      case 'background':
        setBackgroundColor(color.hex);
        break;
      case 'text':
        setTextColor(color.hex);
        break;
      default:
        break;
    }
  };


  const handleApplyTheme = () => {
    const newTheme: Theme = {
      name: themeName || 'Custom Theme',
      palette: {
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: secondaryColor,
        },
        background: {
          default: backgroundColor,
        },
        text: {
          primary: textColor,
        },
      },
      typography: {
        fontFamily: fontFamily,
      },
    };
    dispatch(setTheme(newTheme));
  };


  const handleFontChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFontFamily(event.target.value as string);
  };

    const toggleColorPicker = (field: string) => {
    setIsColorPickerOpen(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Theme Builder
      </Typography>
      <TextField
        label="Theme Name"
        variant="outlined"
        value={themeName}
        onChange={(e) => setThemeName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Primary Color</Typography>
            <Button variant="outlined" onClick={() => toggleColorPicker('primary')} sx={{ mt: 1 }}>
              {primaryColor}
            </Button>
            {isColorPickerOpen.primary && (
                <Box sx={{ position: 'absolute', zIndex: 1000 }}>
                    <ChromePicker color={primaryColor} onChange={(color: any) => handleColorChange(color, 'primary')} />
                </Box>
            )}

          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Secondary Color</Typography>
            <Button variant="outlined" onClick={() => toggleColorPicker('secondary')} sx={{ mt: 1 }}>
              {secondaryColor}
            </Button>
            {isColorPickerOpen.secondary && (
              <Box sx={{ position: 'absolute', zIndex: 1000 }}>
                <ChromePicker color={secondaryColor} onChange={(color: any) => handleColorChange(color, 'secondary')} />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Background Color</Typography>
            <Button variant="outlined" onClick={() => toggleColorPicker('background')} sx={{ mt: 1 }}>
              {backgroundColor}
            </Button>
            {isColorPickerOpen.background && (
              <Box sx={{ position: 'absolute', zIndex: 1000 }}>
                <ChromePicker color={backgroundColor} onChange={(color: any) => handleColorChange(color, 'background')} />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Text Color</Typography>
            <Button variant="outlined" onClick={() => toggleColorPicker('text')} sx={{ mt: 1 }}>
              {textColor}
            </Button>
            {isColorPickerOpen.text && (
              <Box sx={{ position: 'absolute', zIndex: 1000 }}>
                <ChromePicker color={textColor} onChange={(color: any) => handleColorChange(color, 'text')} />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="font-family-label">Font Family</InputLabel>
            <Select
              labelId="font-family-label"
              id="font-family-select"
              value={fontFamily}
              onChange={handleFontChange}
              label="Font Family"
            >
              {fontOptions.map((font) => (
                <MenuItem key={font} value={font}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleApplyTheme}>
        Apply Theme
      </Button>
    </Box>
  );
};

export default ThemeBuilder;