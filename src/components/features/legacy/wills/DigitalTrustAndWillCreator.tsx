import React, { useState, useMemo, FC, ChangeEvent, FormEvent } from 'react';
import { User, Shield, Users, Globe, Building, Gift, Baby, ScrollText, CheckCircle, Download, Printer, ArrowLeft, ArrowRight } from 'lucide-react';

// --- Type Definitions ---
interface PersonalInfo {
    fullName: string;
    dateOfBirth: string;
    address: string;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    hasChildren: boolean;
}

interface Executor {
    fullName: string;
    relationship: string;
    email: string;
}

interface Beneficiary {
    id: string;
    fullName: string;
    relationship: string;
    percentage: number;
}

interface DigitalAsset {
    id: string;
    platform: string;
    username: string;
    instructions: string;
}

interface SpecificGift {
    id: string;
    item: string;
    recipient: string;
}

interface Guardian {
    fullName: string;
    relationship: string;
}

interface FormDataState {
    personalInfo: PersonalInfo;
    executor: Executor;
    alternateExecutor: Executor;
    beneficiaries: Beneficiary[];
    digitalAssets: DigitalAsset[];
    tangibleAssets: string;
    specificGifts: SpecificGift[];
    guardian: Guardian;
    finalArrangements: {
        preference: 'burial' | 'cremation' | 'other';
        instructions: string;
    };
}

const initialFormData: FormDataState = {
    personalInfo: { fullName: '', dateOfBirth: '', address: '', maritalStatus: 'single', hasChildren: false },
    executor: { fullName: '', relationship: '', email: '' },
    alternateExecutor: { fullName: '', relationship: '', email: '' },
    beneficiaries: [],
    digitalAssets: [],
    tangibleAssets: '',
    specificGifts: [],
    guardian: { fullName: '', relationship: '' },
    finalArrangements: { preference: 'burial', instructions: '' }
};

const DigitalTrustAndWillCreator: FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormDataState>(initialFormData);

    const STEPS = useMemo(() => [
        { title: "Personal Information", icon: User },
        { title: "Executor", icon: Shield },
        { title: "Beneficiaries", icon: Users },
        { title: "Digital Assets", icon: Globe },
        { title: "Tangible Assets", icon: Building },
        { title: "Specific Gifts", icon: Gift },
        { title: "Guardian for Minors", icon: Baby, condition: formData.personalInfo.hasChildren },
        { title: "Final Arrangements", icon: ScrollText },
        { title: "Review & Sign", icon: CheckCircle },
    ], [formData.personalInfo.hasChildren]);

    const visibleSteps = STEPS.filter(step => step.condition !== false);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, visibleSteps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    // A simple renderer for demonstration purposes
    const renderCurrentStepContent = () => {
        const step = visibleSteps[currentStep];
        return (
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
                <p>Form content for {step.title} would go here.</p>
                {/* In a real app, you would map over step.fields and render inputs */}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-cyan-400">Digital Trust & Will Creator</h1>
                    <p className="text-gray-400 mt-2">Secure your digital legacy and final wishes with our guided tool.</p>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/4">
                        <nav className="space-y-2">
                            {visibleSteps.map((step, index) => (
                                <button
                                    key={step.title}
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                                        currentStep === index
                                            ? 'bg-cyan-500/20 text-cyan-300'
                                            : 'hover:bg-gray-700/50 text-gray-400'
                                    }`}
                                >
                                    <step.icon className="w-5 h-5 mr-3" />
                                    <span>{step.title}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="w-full md:w-3/4">
                        {renderCurrentStepContent()}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </button>
                            {currentStep === visibleSteps.length - 1 ? (
                                <div className="space-x-2">
                                    <button className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 flex items-center">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </button>
                                    <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center">
                                        <Printer className="w-4 h-4 mr-2" />
                                        Print Document
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 flex items-center"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DigitalTrustAndWillCreator;