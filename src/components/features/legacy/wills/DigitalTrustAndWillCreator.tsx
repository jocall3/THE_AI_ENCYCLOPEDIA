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
    beneficiaries: [{ id: 'b1', fullName: '', relationship: '', percentage: 100 }],
    digitalAssets: [{ id: 'da1', platform: '', username: '', instructions: '' }],
    tangibleAssets: '',
    specificGifts: [{ id: 'sg1', item: '', recipient: '' }],
    guardian: { fullName: '', relationship: '' },
    finalArrangements: { preference: 'burial', instructions: '' },
};

const DigitalTrustAndWillCreator: FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormDataState>(initialFormData);

    const STEPS = useMemo(() => [
        { name: 'Personal Info', icon: User },
        { name: 'Executor', icon: Shield },
        { name: 'Beneficiaries', icon: Users },
        { name: 'Digital Assets', icon: Globe },
        { name: 'Tangible Assets', icon: Building },
        { name: 'Specific Gifts', icon: Gift },
        { name: 'Guardianship', icon: Baby },
        { name: 'Final Arrangements', icon: ScrollText },
        { name: 'Review & Complete', icon: CheckCircle },
    ], []);

    // --- Handlers ---
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: keyof FormDataState, field?: string) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field || name]: value,
            },
        }));
    };
    
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Will Submitted:", formData);
        // In a real app, this would send data to a secure backend
    };

    // The rendering logic is extensive and not fully provided, so a placeholder is used.
    // This does not affect the fix, which is in the import and STEPS array.
    const renderStepContent = () => {
        return <div>Step {currentStep + 1} Content</div>;
    };

    return (
        <div className="bg-gray-800 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-4xl mx-auto my-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-cyan-300">Digital Will & Trust Creator</h1>
            </div>

            {/* Stepper Navigation */}
            <div className="mb-8 flex justify-center space-x-2 sm:space-x-4 overflow-x-auto p-2">
                {STEPS.map((step, index) => (
                    <button 
                        key={step.name}
                        onClick={() => setCurrentStep(index)}
                        className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-300 ${currentStep === index ? 'text-cyan-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                        <step.icon className="w-6 h-6" />
                        <span className="text-xs text-center font-medium">{step.name}</span>
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="relative pt-1 mb-6">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-500"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {renderStepContent()}
            </form>

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                <button 
                    onClick={prevStep} 
                    disabled={currentStep === 0}
                    className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>
                {currentStep < STEPS.length - 1 ? (
                    <button 
                        onClick={nextStep}
                        className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit & Finalize
                    </button>
                )}
            </div>

        </div>
    );
};

export default DigitalTrustAndWillCreator;