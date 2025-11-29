import React, { useState, useCallback, useMemo } from 'react';
import Card from './Card';
import { Palette, Layout, Type, Zap, Cpu, Globe, Settings, Shield, TrendingUp, MessageSquare, User, Aperture } from 'lucide-react';

// --- Theme Configuration Constants ---
const THEME_CONFIGS = {
    'default': { // Changed from 'sovereign'
        name: 'Standard Dark', // Changed from 'Sovereign Dark'
        description: 'A balanced, dark theme. Designed for clarity and focus.', // Changed description
        primaryColor: 'cyan',
        accentColor: 'cyan-500',
        bgColor: 'bg-gray-900/95',
        textColor: 'text-white',
        icon: Zap,
        gradient: 'from-gray-900 to-black',
        code: 'STD', // Changed from SOV
        disabled: false,
    },
    'quantum': {
        name: 'Quantum Flux',
        description: 'A high-contrast theme with vibrant colors. Ideal for data visualization.', // Changed description
        primaryColor: 'purple',
        accentColor: 'purple-500',
        bgColor: 'bg-indigo-900/20',
        textColor: 'text-purple-200',
        icon: Cpu,
        gradient: 'from-indigo-900 to-purple-900',
        code: 'QTM',
        disabled: false,
    },
    'legacy': {
        name: 'Legacy Archive',
        description: 'A classic, light theme. Provides a familiar interface.', // Changed description
        primaryColor: 'green',
        accentColor: 'green-500',
        bgColor: 'bg-gray-100/90',
        textColor: 'text-gray-800',
        icon: Settings,
        gradient: 'from-gray-100 to-gray-300',
        code: 'LGCY',
        disabled: false, // Changed from true
    },
    'aether': {
        name: 'Aetherial Flow',
        description: 'A low-light theme. Suitable for extended work sessions.', // Changed description
        primaryColor: 'pink',
        accentColor: 'pink-400',
        bgColor: 'bg-black/90',
        textColor: 'text-pink-100',
        icon: Aperture,
        gradient: 'from-gray-950 to-black',
        code: 'AETR',
        disabled: false,
    },
    'chronos': {
        name: 'Chronos Temporal',
        description: 'A time-focused theme. Useful for tracking trends and changes.', // Changed description
        primaryColor: 'amber',
        accentColor: 'amber-400',
        bgColor: 'bg-amber-900/10',
        textColor: 'text-amber-200',
        icon: TrendingUp,
        gradient: 'from-amber-900 to-yellow-900',
        code: 'CHRN',
        disabled: false,
    },
};

// --- Theme Selector Button Component ---
interface ThemeButtonProps {
    themeKey: keyof typeof THEME_CONFIGS;
    currentTheme: string;
    onSelect: (theme: keyof typeof THEME_CONFIGS) => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = React.memo(({ themeKey, currentTheme, onSelect }) => {
    const config = THEME_CONFIGS[themeKey];
    const IconComponent = config.icon;
    const isActive = currentTheme === themeKey;
    const isDisabled = config.disabled;

    const handleClick = useCallback(() => {
        if (!isDisabled) {
            onSelect(themeKey);
        }
    }, [themeKey, onSelect, isDisabled]);

    const baseClasses = `p-5 rounded-xl border-2 transition-all duration-300 shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4`;
    const activeClasses = `border-${config.accentColor} bg-${config.primaryColor}-900/30 ring-4 ring-${config.accentColor}/50`;
    const inactiveClasses = `border-gray-700 bg-gray-800/70 hover:border-gray-600/80`;
    const disabledClasses = `opacity-50 cursor-not-allowed pointer-events-none border-gray-800 bg-gray-900/50`;

    return (
        <button 
            onClick={handleClick}
            disabled={isDisabled}
            className={`${baseClasses} ${isDisabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)} flex flex-col h-full`}
            aria-pressed={isActive}
            aria-label={`Select ${config.name} theme`}
        >
            <div className={`h-24 ${config.gradient} rounded-lg mb-4 border border-gray-700 flex items-center justify-center shadow-inner`}>
                <IconComponent className={`w-8 h-8 text-${config.primaryColor}-300`} strokeWidth={2.5} />
                <span className={`absolute text-xs font-extrabold mt-16 tracking-widest text-${config.primaryColor}-400`}>{config.code}</span>
            </div>
            <h3 className={`font-extrabold text-lg tracking-wide ${config.textColor}`}>{config.name}</h3>
            <p className={`text-xs mt-1 text-left ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>{config.description}</p>
            {isActive && (
                <span className={`mt-2 text-xs font-bold text-${config.accentColor} flex items-center`}>
                    <Shield className="w-3 h-3 mr-1" /> ACTIVE PROTOCOL
                </span>
            )}
        </button>
    );
});
ThemeButton.displayName = 'ThemeButton';

// --- Font Configuration Panel Component ---
const FontConfigurationPanel: React.FC = () => {
    const [fontFamily, setFontFamily] = useState('Inter');
    const [fontSizeScale, setFontSizeScale] = useState(1.0);

    const fontOptions = useMemo(() => [
        { key: 'Inter', name: 'Inter (Standard)', description: 'Balanced readability for all interfaces.' },
        { key: 'Roboto Mono', name: 'Roboto Mono (Code)', description: 'Monospaced precision for data streams.' },
        { key: 'Source Serif Pro', name: 'Source Serif (Editorial)', description: 'High-fidelity rendering for long-form analysis.' },
    ], []);

    return (
        <Card title="Typographic Hierarchy & Signal Clarity" icon={Type}>
            <div className="space-y-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                
                {/* Font Family Selector */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center"><Type className="w-4 h-4 mr-2"/> Primary Typeface Selection</label>
                    <div className="grid grid-cols-3 gap-3">
                        {fontOptions.map(font => (
                            <button
                                key={font.key}
                                onClick={() => setFontFamily(font.key)}
                                className={`p-3 text-sm rounded-lg border transition-colors ${fontFamily === font.key ? 'bg-cyan-600/30 border-cyan-500 text-white' : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                                style={{ fontFamily: font.key }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 italic">Current Selection: {fontOptions.find(f => f.key === fontFamily)?.description}</p>
                </div>

                {/* Font Scaling Slider */}
                <div className="space-y-2 pt-4 border-t border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 flex items-center"><Layout className="w-4 h-4 mr-2"/> Global Font Scaling Factor ({fontSizeScale.toFixed(2)}x)</label>
                    <input
                        type="range"
                        min="0.8"
                        max="1.5"
                        step="0.05"
                        value={fontSizeScale}
                        onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                    <p className="text-xs text-gray-400">Adjusts base font size across all modules for optimal viewport utilization.</p>
                </div>
            </div>
        </Card>
    );
};

// --- Color Palette Configuration Component ---
interface PaletteConfigProps {
    activeTheme: keyof typeof THEME_CONFIGS;
}

const ColorPaletteMatrix: React.FC<PaletteConfigProps> = React.memo(({ activeTheme }) => {
    const baseConfig = THEME_CONFIGS[activeTheme];
    const [accentHue, setAccentHue] = useState('500');
    const [saturationLevel, setSaturationLevel] = useState(80);

    const paletteOptions = useMemo(() => [
        { value: '300', name: 'Light' },
        { value: '500', name: 'Standard' },
        { value: '700', name: 'Deep' },
    ], []);

    return (
        <Card title="Chromatic Signature Calibration" icon={Palette}>
            <div className="space-y-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <p className="text-sm font-medium text-gray-300">Active Base Hue: <span className={`font-bold text-${baseConfig.primaryColor}-400`}>{baseConfig.name}</span></p>
                    <div className={`w-6 h-6 rounded-full shadow-lg border border-gray-600 bg-gradient-to-br from-${baseConfig.primaryColor}-800 to-${baseConfig.primaryColor}-500`}></div>
                </div>

                {/* Accent Hue Intensity */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Accent Intensity (Hex Value: {accentHue})</label>
                    <div className="grid grid-cols-3 gap-3">
                        {paletteOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setAccentHue(opt.value)}
                                className={`p-3 text-sm rounded-lg border transition-colors ${accentHue === opt.value ? `bg-${baseConfig.primaryColor}-${opt.value}/40 border-${baseConfig.accentColor} text-white ring-2 ring-${baseConfig.accentColor}` : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                                style={{ boxShadow: `0 0 10px rgba(var(--tw-color-${baseConfig.primaryColor}-${opt.value}), 0.5)` }}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Saturation Control */}
                <div className="space-y-2 pt-4 border-t border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 flex items-center"><MessageSquare className="w-4 h-4 mr-2"/> Color Saturation Adjustment ({saturationLevel}%)</label> {/* Changed label */}
                    <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={saturationLevel}
                        onChange={(e) => setSaturationLevel(parseInt(e.target.value))}
                        className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-${baseConfig.accentColor} [&::-moz-range-thumb]:bg-${baseConfig.accentColor}`}
                    />
                    <p className="text-xs text-gray-400">Adjusts color saturation for optimal visual balance.</p> {/* Changed description */}
                </div>
            </div>
        </Card>
    );
});
ColorPaletteMatrix.displayName = 'ColorPaletteMatrix';


// --- Main Personalization View Component ---
const PersonalizationView: React.FC = () => {
    const [theme, setTheme] = useState<keyof typeof THEME_CONFIGS>('default'); // Changed from 'sovereign'
    const [layoutMode, setLayoutMode] = useState<'modular' | 'unified'>('modular');

    const handleThemeChange = useCallback((newTheme: keyof typeof THEME_CONFIGS) => {
        if (!THEME_CONFIGS[newTheme].disabled) {
            setTheme(newTheme);
            // In a real system, this would trigger a global context update or CSS variable injection.
            console.log(`System theme switched to: ${THEME_CONFIGS[newTheme].name}`);
        }
    }, []);

    const currentThemeConfig = useMemo(() => THEME_CONFIGS[theme], [theme]);

    return (
        <div className="space-y-10 p-6 md:p-10 bg-gray-900/70 min-h-screen font-sans">
            
            {/* Header: System Status and Identity */}
            <header className="border-b border-cyan-700/50 pb-4">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter flex items-center">
                    <Shield className="w-10 h-10 mr-3 text-cyan-400 animate-pulse" />
                    System Interface Configuration Matrix
                </h1>
                <p className="text-lg text-gray-400 mt-1 ml-13">Module 01: Visual & Aesthetic Settings. Current State: <span className={`font-bold text-${currentThemeConfig.accentColor}`}>{currentThemeConfig.name}</span></p> {/* Changed text */}
            </header>

            {/* Section 1: Core Visual Theme Selection */}
            <section>
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">
                    01. Core Visual Theme Selection {/* Changed text */}
                </h2>
                
                <Card title="Theme Selection" icon={Palette}> {/* Changed title */}
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-gray-800 border border-cyan-600/50 shadow-inner shadow-cyan-900">
                            <p className="text-gray-300 italic text-base leading-relaxed">
                                "Choose a theme that best suits your workflow and visual comfort. Your environment should support your focus and productivity." {/* Changed quote and removed attribution */}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                            {(Object.keys(THEME_CONFIGS) as Array<keyof typeof THEME_CONFIGS>).map((key) => (
                                <ThemeButton 
                                    key={key}
                                    themeKey={key}
                                    currentTheme={theme}
                                    onSelect={handleThemeChange}
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </section>

            {/* Section 2: Layout and Structure Configuration */}
            <section>
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">
                    02. Structural Layout & Information Density
                </h2>
                <Card title="Layout Topology Control" icon={Layout}>
                    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-gray-400 mb-4">Select the primary information architecture for the main operational dashboard.</p>
                        
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setLayoutMode('modular')}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${layoutMode === 'modular' ? 'border-purple-500 bg-purple-900/20 shadow-lg' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                            >
                                <Layout className="w-6 h-6 mb-2 text-purple-400" />
                                <h4 className="font-bold text-white">Modular Grid (Default)</h4>
                                <p className="text-xs text-gray-400">Independent, resizable widgets. Ideal for parallel monitoring of disparate KPIs.</p>
                            </button>
                            <button 
                                onClick={() => setLayoutMode('unified')}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${layoutMode === 'unified' ? 'border-amber-500 bg-amber-900/20 shadow-lg' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                            >
                                <Globe className="w-6 h-6 mb-2 text-amber-400" />
                                <h4 className="font-bold text-white">Unified Flow (Chronos Mode)</h4>
                                <p className="text-xs text-gray-400">Sequential, narrative data presentation. Optimized for deep-dive analysis and reporting.</p>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 pt-2">Current Layout Mode: <span className="font-semibold text-gray-300">{layoutMode.toUpperCase()}</span></p>
                    </div>
                </Card>
            </section>

            {/* Section 3: Advanced Typographic and AI Calibration */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FontConfigurationPanel />
                <ColorPaletteMatrix activeTheme={theme} />
            </section>

            {/* Section 4: AI Integration Preference */}
            <section>
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">
                    03. AI Integration Preferences {/* Changed text */}
                </h2>
                <Card title="AI Interaction Settings" icon={Cpu}> {/* Changed title */}
                    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                            <span className="text-gray-300 font-medium">Enable Predictive Text Generation (PTG)</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" defaultChecked={true} />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-medium">Real-time Sentiment Analysis Overlay</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" defaultChecked={false} />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 pt-2">These settings affect how AI features interact with the user interface.</p> {/* Changed description */}
                    </div>
                </Card>
            </section>

            {/* Footer / Commit Action */}
            <footer className="pt-8 border-t border-gray-700 flex justify-end">
                <button
                    className={`px-8 py-3 text-lg font-bold rounded-full transition-all shadow-lg transform hover:scale-[1.03] focus:outline-none focus:ring-4 
                                bg-cyan-600 text-white hover:bg-cyan-500 ring-cyan-400/50`}
                    onClick={() => console.log("Configuration committed successfully.")}
                >
                    <Zap className="w-5 h-5 inline mr-2" />
                    SAVE SETTINGS {/* Changed text */}
                </button>
            </footer>
        </div>
    );
};

export default PersonalizationView;