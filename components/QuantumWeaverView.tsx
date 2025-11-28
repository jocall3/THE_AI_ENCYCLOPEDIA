
import React, { useState, useMemo, useEffect, FC, createContext, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Card from './Card';
import type { AIPlanStep, AIQuestion, AIPlan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// ================================================================================================
// GRAPHQL & SERVICE LAYER (NEW ARCHITECTURE)
// ================================================================================================

const gql = String.raw;

let mockWorkflow: WorkflowStatusPayload | null = null;
const mockWorkflows = new Map<string, WorkflowStatusPayload>(); 
const mockUserProfiles = new Map<string, UserProfile>(); 

async function graphqlRequest<T, V>(query: string, variables?: V): Promise<T> {
    console.log("Mock GraphQL Request:", { query: query.substring(0, Math.min(query.length, 100)) + '...', variables });

    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500)); 

    if (query.includes('StartBusinessPlanAnalysis')) {
        const { plan, userId } = variables as { plan: string, userId: string };
        const workflowId = `wf-${Date.now()}-${userId}`;
        const newWorkflow: WorkflowStatusPayload = {
            workflowId,
            status: 'PENDING',
            result: null,
            error: null,
            userId,
            businessPlan: plan, 
        };
        mockWorkflows.set(workflowId, newWorkflow);
        setTimeout(() => {
            const current = mockWorkflows.get(workflowId);
            if (current) {
                const loanAmount = Math.floor(Math.random() * 150000) + 50000;
                const viability = Math.min(95, 30 + (plan.length / 500) * 40 + Math.random() * 20);
                const marketFit = Math.min(90, 25 + (plan.length / 600) * 35 + Math.random() * 20);
                const risk = Math.max(5, 100 - viability - marketFit + Math.random() * 10);
                const feedback = plan.length > 300
                    ? "A comprehensive vision with significant potential. Detailed planning is evident, but strategic differentiation needs emphasis."
                    : "An interesting concept, but the initial pitch lacks depth. Consider elaborating on your market strategy and unique selling proposition.";

                current.status = 'ANALYSIS_COMPLETE';
                current.result = {
                    feedback: feedback,
                    questions: [
                        { id: 'q1', question: 'What is your customer acquisition strategy and projected cost per acquisition?', category: 'Marketing' },
                        { id: 'q2', question: 'How will you differentiate from existing competitors?', category: 'Competitive Landscape' },
                        { id: 'q3', question: 'What are the key technical hurdles in developing your prototype?', category: 'Technology' },
                        { id: 'q4', question: 'Describe your projected financial milestones for the next 18 months.', category: 'Finance' },
                        { id: 'q5', question: 'What is your long-term vision beyond the initial product launch?', category: 'Vision' },
                    ],
                    coachingPlan: {
                        title: "Founder's Acceleration Plan",
                        summary: "A multi-phase plan to optimize your business model and prepare for hyper-growth.",
                        steps: [
                            { title: "Refine Revenue & Cost Models", description: "Develop a granular financial model projecting revenue streams, COGS, and operational expenses for the first 3 years, highlighting scalability.", timeline: '2 Weeks', category: 'Finance' },
                            { title: "Deep-Dive Competitive Strategy", description: "Conduct a SWOT analysis on your top 5 competitors, identifying their vulnerabilities and opportunities for your entry.", timeline: '1 Week', category: 'Strategy' },
                            { title: "MVP & Product Roadmap Definition", description: "Outline core features for your Minimum Viable Product, detailing user stories, tech stack, and a phased development timeline.", timeline: '3 Weeks', category: 'Product' },
                            { title: "Legal & IP Due Diligence", description: "Consult with legal experts to secure intellectual property, assess regulatory compliance, and draft initial founder agreements.", timeline: '2 Weeks', category: 'Legal' },
                            { title: "Team Scaling Blueprint", description: "Develop a hiring plan for key early hires, including role descriptions, compensation strategy, and a pipeline for talent acquisition.", timeline: '2 Weeks', category: 'HR' },
                        ]
                    },
                    loanAmount: loanAmount,
                    metrics: { viability, marketFit, risk },
                    growthProjections: [
                        { month: 0, users: 10, revenue: 0 },
                        { month: 3, users: 100, revenue: 1000 },
                        { month: 6, users: 500, revenue: 7500 },
                        { month: 9, users: 2000, revenue: 25000 },
                        { month: 12, users: 5000, revenue: 75000 },
                        { month: 18, users: 15000, revenue: 250000 },
                    ],
                    potentialMentors: [
                        { id: 'm1', name: 'Dr. Evelyn Reed', expertise: 'Quantum Computing, AI Ethics', bio: 'Pioneering work in quantum algorithm optimization.', imageUrl: 'https://i.pravatar.cc/150?u=evelyn' },
                        { id: 'm2', name: 'Mr. Kenji Tanaka', expertise: 'Market Entry, SaaS Scale-up', bio: 'Led 3 startups to successful exits in fintech.', imageUrl: 'https://i.pravatar.cc/150?u=kenji' },
                        { id: 'm3', name: 'Ms. Lena Petrova', expertise: 'Product Design, UX/UI', bio: 'Award-winning designer with 15+ years in tech.', imageUrl: 'https://i.pravatar.cc/150?u=lena' },
                    ]
                };
                mockWorkflows.set(workflowId, current);
            }
        }, 5000); 
        return { startBusinessPlanAnalysis: { workflowId, status: 'PENDING' } } as unknown as T;
    }

    if (query.includes('GetBusinessPlanAnalysisStatus')) {
        const vars = variables as { workflowId: string };
        const wf = mockWorkflows.get(vars.workflowId);
        if (wf) {
            return { getBusinessPlanAnalysisStatus: wf } as unknown as T;
        }
        throw new Error(`Workflow with ID ${vars.workflowId} not found in mock state.`);
    }

    if (query.includes('ApproveBusinessPlan')) {
        const vars = variables as { workflowId: string };
        const wf = mockWorkflows.get(vars.workflowId);
        if (wf) {
            setTimeout(() => {
                if (wf) {
                    wf.status = 'APPROVED';
                    mockWorkflows.set(vars.workflowId, wf);
                }
            }, 3000);
            return { approveBusinessPlan: { workflowId: vars.workflowId, status: 'PENDING_APPROVAL' } } as unknown as T;
        }
        throw new Error("Workflow not found for approval.");
    }

    if (query.includes('RequestBusinessPlanRevision')) {
        const vars = variables as { workflowId: string, feedback: string };
        const wf = mockWorkflows.get(vars.workflowId);
        if (wf) {
            wf.status = 'REQUIRE_REVISION';
            wf.error = `Revision Required: ${vars.feedback}`;
            mockWorkflows.set(vars.workflowId, wf);
            return { requestBusinessPlanRevision: { workflowId: vars.workflowId, status: 'REQUIRE_REVISION' } } as unknown as T;
        }
        throw new Error("Workflow not found for revision request.");
    }

    if (query.includes('GenerateAiContent')) {
        const vars = variables as { prompt: string, context: string, workflowId?: string };
        let generatedText = "AI is processing your request...";

        const currentPlan = vars.workflowId ? mockWorkflows.get(vars.workflowId)?.businessPlan : vars.context;

        if (vars.prompt.toLowerCase().includes('pro-tip')) {
            generatedText = `Based on your plan: "Focus relentlessly on solving one critical problem for your customer better than anyone else. Everything else is a distraction until that is achieved. Authenticity is your superpower."`;
        } else if (vars.prompt.toLowerCase().includes('elevator pitch')) {
            generatedText = `Imagine a world where your business plan, "${currentPlan?.substring(0, 50)}...", is distilled into a single, irresistible sentence: "We empower [target audience] to achieve [desired outcome] through [unique solution], revolutionizing [industry] with [key differentiator]."`;
        } else if (vars.prompt.toLowerCase().includes('brand identity')) {
            generatedText = `For "${currentPlan?.substring(0, 50)}...": Name: 'AetherFlow'. Tagline: 'Where Ideas Take Flight.' Vision: 'To seamlessly connect innovation with impact.'`;
        } else if (vars.prompt.toLowerCase().includes('funding allocation')) {
            generatedText = "Strategic Allocation:\nProduct & R&D: 40%\nMarket Penetration & Sales: 30%\nOperational Excellence: 15%\nStrategic Reserves & Compliance: 10%\nTalent Acquisition: 5%";
        } else if (vars.prompt.toLowerCase().includes('market trend analysis')) {
            generatedText = `Emerging trends suggest a significant shift towards personalized, AI-driven solutions in the [relevant industry based on plan]. Competitors are slow to adapt, creating a 'blue ocean' opportunity for rapid market capture. Consumer demand for [key feature from plan] is projected to increase by 25% annually.`;
        } else if (vars.prompt.toLowerCase().includes('swot analysis')) {
            generatedText = `**Strengths**: Innovative core technology, passionate team.\n**Weaknesses**: Limited initial market reach, reliance on early adopters.\n**Opportunities**: Untapped market segments, strategic partnership potential.\n**Threats**: Rapid technological shifts, incumbent resistance.`;
        } else if (vars.prompt.toLowerCase().includes('social media strategy')) {
            generatedText = `**Platform Focus**: LinkedIn for B2B thought leadership, Instagram for community building.\n**Content Pillars**: Educational insights, behind-the-scenes, customer success stories.\n**Engagement Tactic**: Interactive Q&A sessions, influencer collaborations.`;
        } else if (vars.prompt.toLowerCase().includes('risk mitigation')) {
            generatedText = `**Technology Risk**: Implement agile development, diversify tech stack expertise.\n**Market Risk**: Conduct continuous market validation, pilot programs.\n**Financial Risk**: Maintain lean operations, secure convertible notes.`;
        } else if (vars.prompt.toLowerCase().includes('legal considerations')) {
            generatedText = `Key legal considerations include: IP protection (patents/copyrights), data privacy compliance (GDPR/CCPA), founder agreements, and terms of service. Early legal counsel is crucial to avoid future pitfalls.`;
        } else if (vars.prompt.toLowerCase().includes('team roles')) {
            generatedText = `Critical early hires for "${currentPlan?.substring(0, 50)}..." include a Head of Product (visionary), Lead Engineer (builder), and a Growth Marketer (communicator). Consider a fractional CTO/CFO initially.`;
        } else if (vars.prompt.toLowerCase().includes('user persona')) {
            generatedText = `**Name**: Innovator Anya\n**Age**: 32\n**Profession**: Lead R&D Scientist\n**Goals**: Find efficient tools for complex simulations, collaborate easily.\n**Pain Points**: Legacy software, data silos, slow processing.\n**Motivations**: Career advancement, making scientific breakthroughs.`;
        }

        return { generateTextWithContext: generatedText } as unknown as T;
    }

    if (query.includes('GenerateAIChatResponse')) {
        const vars = variables as { message: string, context: string, workflowId?: string };
        const currentPlan = vars.workflowId ? mockWorkflows.get(vars.workflowId)?.businessPlan : vars.context;
        let aiResponse = `Understood. You asked: "${vars.message}". How does this relate to your plan: "${currentPlan?.substring(0, 50)}..."?`;

        if (vars.message.toLowerCase().includes('how do i start')) {
            aiResponse = "To start, focus on validating your core hypothesis. Who is your ideal customer, and what problem are you solving for them? Build a minimal viable product (MVP) to test this rapidly.";
        } else if (vars.message.toLowerCase().includes('funding')) {
            aiResponse = "Regarding funding, consider exploring angel investors, venture capital, or grants. Your current plan, if approved, includes seed funding, but diversify your fundraising strategy.";
        } else if (vars.message.toLowerCase().includes('competitors')) {
            aiResponse = "Understanding your competitors is crucial. Analyze their strengths, weaknesses, and market positioning. Look for gaps they aren't filling, or ways you can deliver superior value.";
        } else if (vars.message.toLowerCase().includes('next step')) {
            aiResponse = "Based on your current stage, I'd recommend reviewing the 'Founder's Acceleration Plan' to identify immediate actionable steps and milestones.";
        } else if (vars.message.toLowerCase().includes('optimize my pitch')) {
            aiResponse = "To optimize your pitch, ensure it clearly articulates the problem, your unique solution, market opportunity, team, and financial projections. Practice storytelling to make it memorable.";
        } else if (vars.message.toLowerCase().includes('scaling')) {
            aiResponse = "Scaling requires a robust infrastructure, efficient processes, and a talented team. Prioritize automation and build a culture of continuous improvement from day one.";
        }
        return { generateAIChatResponse: aiResponse } as unknown as T;
    }

    if (query.includes('SimulateScenario')) {
        const vars = variables as { workflowId: string, parameters: ScenarioParameters };
        const wf = mockWorkflows.get(vars.workflowId);
        if (!wf || !wf.result?.growthProjections) {
            throw new Error("Workflow or growth projections not found for scenario simulation.");
        }

        const baseProjections = wf.result.growthProjections;
        const simulatedProjections: GrowthProjection[] = baseProjections.map(p => {
            let newUsers = p.users * (1 + (vars.parameters.customerAcquisitionMultiplier - 1) * 0.5);
            let newRevenue = p.revenue * (1 + (vars.parameters.conversionRateMultiplier - 1) * 0.7);
            newRevenue = newRevenue * (1 - (vars.parameters.churnRateIncrease / 100)); 
            return {
                month: p.month,
                users: Math.round(newUsers),
                revenue: Math.round(newRevenue * vars.parameters.averageRevenuePerUserMultiplier),
            };
        });
        return { simulateScenario: { workflowId: vars.workflowId, scenarioName: vars.parameters.scenarioName || 'Custom Scenario', projections: simulatedProjections } } as unknown as T;
    }

    if (query.includes('GetUserProfile')) {
        const vars = variables as { userId: string };
        const profile = mockUserProfiles.get(vars.userId);
        if (profile) {
            return { getUserProfile: profile } as unknown as T;
        }
        return { getUserProfile: { userId: vars.userId, username: `User_${vars.userId.substring(0, 4)}`, email: `${vars.userId}@example.com`, preferences: { notificationSettings: { emailEnabled: true, smsEnabled: true, inAppEnabled: true } } } } as unknown as T;
    }

    if (query.includes('UpdateUserProfile')) {
        const vars = variables as { userId: string, profile: UserProfileUpdateInput };
        let profile = mockUserProfiles.get(vars.userId) || { userId: vars.userId, username: `User_${vars.userId.substring(0, 4)}`, email: `${vars.userId}@example.com`, preferences: { notificationSettings: { emailEnabled: true, smsEnabled: true, inAppEnabled: true } } };
        profile = { ...profile, ...vars.profile, preferences: { ...profile.preferences, ...vars.profile.preferences } };
        mockUserProfiles.set(vars.userId, profile);
        return { updateUserProfile: profile } as unknown as T;
    }

    if (query.includes('GetUserPlans')) {
        const vars = variables as { userId: string };
        const plans = Array.from(mockWorkflows.values()).filter(wf => wf.userId === vars.userId);
        return { getUserPlans: plans } as unknown as T;
    }

    throw new Error(`Unknown GraphQL query in mock: ${query.substring(0, 50)}...`);
}


const START_ANALYSIS_MUTATION = gql`
  mutation StartBusinessPlanAnalysis($plan: String!, $userId: ID!) {
    startBusinessPlanAnalysis(plan: $plan, userId: $userId) {
      workflowId
      status
    }
  }
`;

const GET_ANALYSIS_STATUS_QUERY = gql`
  query GetBusinessPlanAnalysisStatus($workflowId: ID!) {
    getBusinessPlanAnalysisStatus(workflowId: $workflowId) {
      workflowId
      status
      result {
        feedback
        questions { id question category }
        coachingPlan { title summary steps { title description category timeline } }
        loanAmount
        metrics { viability marketFit risk }
        growthProjections { month users revenue }
        potentialMentors { id name expertise bio imageUrl }
      }
      error
      businessPlan 
    }
  }
`;

const APPROVE_PLAN_MUTATION = gql`
  mutation ApproveBusinessPlan($workflowId: ID!) {
    approveBusinessPlan(workflowId: $workflowId) {
      workflowId
      status
    }
  }
`;

const REQUEST_BUSINESS_PLAN_REVISION_MUTATION = gql`
  mutation RequestBusinessPlanRevision($workflowId: ID!, $feedback: String!) {
    requestBusinessPlanRevision(workflowId: $workflowId, feedback: $feedback) {
      workflowId
      status
    }
  }
`;

const GENERATE_AI_CONTENT_MUTATION = gql`
    mutation GenerateAiContent($prompt: String!, $context: String!, $workflowId: ID) {
        generateTextWithContext(prompt: $prompt, context: $context, workflowId: $workflowId)
    }
`;

const GENERATE_AI_CHAT_RESPONSE_MUTATION = gql`
    mutation GenerateAIChatResponse($message: String!, $context: String!, $workflowId: ID) {
        generateAIChatResponse(message: $message, context: $context, workflowId: $workflowId)
    }
`;

const SIMULATE_SCENARIO_MUTATION = gql`
    mutation SimulateScenario($workflowId: ID!, $parameters: ScenarioParametersInput!) {
        simulateScenario(workflowId: $workflowId, parameters: $parameters) {
            workflowId
            scenarioName
            projections { month users revenue }
        }
    }
`;

const GET_USER_PROFILE_QUERY = gql`
    query GetUserProfile($userId: ID!) {
        getUserProfile(userId: $userId) {
            userId
            username
            email
            preferences {
                theme
                notificationSettings
            }
        }
    }
`;

const UPDATE_USER_PROFILE_MUTATION = gql`
    mutation UpdateUserProfile($userId: ID!, $profile: UserProfileUpdateInput!) {
        updateUserProfile(userId: $userId, profile: $profile) {
            userId
            username
            email
            preferences {
                theme
                notificationSettings
            }
        }
    }
`;

const GET_USER_PLANS_QUERY = gql`
    query GetUserPlans($userId: ID!) {
        getUserPlans(userId: $userId) {
            workflowId
            status
            businessPlan
            result {
                loanAmount
                metrics { viability marketFit risk }
            }
        }
    }
`;


// --- Type Definitions for GraphQL Payloads ---

interface Metrics {
    viability: number;
    marketFit: number;
    risk: number;
}

interface GrowthProjection {
    month: number;
    users: number;
    revenue: number;
}

interface Mentor {
    id: string;
    name: string;
    expertise: string;
    bio: string;
    imageUrl: string;
}

interface WorkflowStatusPayload {
    workflowId: string;
    status: 'PENDING' | 'ANALYSIS_COMPLETE' | 'APPROVED' | 'FAILED' | 'REQUIRE_REVISION' | 'PENDING_APPROVAL';
    result?: {
        feedback?: string;
        questions?: AIQuestion[];
        coachingPlan?: AIPlan;
        loanAmount?: number;
        metrics?: Metrics;
        growthProjections?: GrowthProjection[];
        potentialMentors?: Mentor[];
    } | null;
    error?: string | null;
    userId: string; 
    businessPlan: string;
}

interface StartAnalysisResponse { startBusinessPlanAnalysis: { workflowId: string; status: string; } }
interface GetStatusResponse { getBusinessPlanAnalysisStatus: WorkflowStatusPayload; }
interface ApprovePlanResponse { approveBusinessPlan: { workflowId: string; status: string; } }
interface RequestRevisionResponse { requestBusinessPlanRevision: { workflowId: string; status: string; } }
interface GenerateTextResponse { generateTextWithContext: string; }
interface GenerateChatResponse { generateAIChatResponse: string; }

interface ScenarioParameters {
    scenarioName?: string;
    customerAcquisitionMultiplier: number; 
    conversionRateMultiplier: number;
    averageRevenuePerUserMultiplier: number;
    churnRateIncrease: number; 
}
interface SimulateScenarioResponse { simulateScenario: { workflowId: string; scenarioName: string; projections: GrowthProjection[]; } }

interface UserProfile {
    userId: string;
    username: string;
    email: string;
    preferences: {
        theme?: 'dark' | 'light';
        notificationSettings: { 
            emailEnabled: boolean;
            smsEnabled: boolean;
            inAppEnabled: boolean;
        };
        favoritePrompts?: string[];
    };
    createdWorkflows?: { workflowId: string; businessPlanSummary: string; status: string; }[];
}

interface UserProfileUpdateInput {
    username?: string;
    email?: string;
    preferences?: {
        theme?: 'dark' | 'light';
        notificationSettings?: {
            emailEnabled: boolean;
            smsEnabled: boolean;
            inAppEnabled: boolean;
        };
        favoritePrompts?: string[];
    };
}
interface GetUserProfileResponse { getUserProfile: UserProfile; }
interface UpdateUserProfileResponse { updateUserProfile: UserProfile; }
interface GetUserPlansResponse { getUserPlans: WorkflowStatusPayload[]; }

// --- Custom Hooks for Data Fetching & Mutations ---

const useStartAnalysis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { plan: string, userId: string }) => graphqlRequest<StartAnalysisResponse, typeof args>(START_ANALYSIS_MUTATION, args),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userPlans'] }); 
        }
    });
};

const useAnalysisStatus = (workflowId: string | null, currentStatus: string | null) => useQuery({
    queryKey: ['analysisStatus', workflowId],
    queryFn: () => graphqlRequest<GetStatusResponse, { workflowId: string }>(GET_ANALYSIS_STATUS_QUERY, { workflowId: workflowId! }),
    enabled: !!workflowId && !['APPROVED', 'FAILED', 'ANALYSIS_COMPLETE', 'REQUIRE_REVISION'].includes(currentStatus || ''),
    refetchInterval: (query) => {
        const status = query.state.data?.getBusinessPlanAnalysisStatus.status;
        if (['PENDING', 'PENDING_APPROVAL'].includes(status || '')) {
            return 3000; 
        }
        return false; 
    },
    staleTime: 5000, 
});

const useApprovePlan = () => useMutation({
    mutationFn: (workflowId: string) => graphqlRequest<ApprovePlanResponse, { workflowId: string }>(APPROVE_PLAN_MUTATION, { workflowId }),
});

const useRequestRevision = () => useMutation({
    mutationFn: (args: { workflowId: string, feedback: string }) => graphqlRequest<RequestRevisionResponse, typeof args>(REQUEST_BUSINESS_PLAN_REVISION_MUTATION, args),
});

const useGenerateAiContent = () => useMutation({
    mutationFn: (variables: { prompt: string, context: string, workflowId?: string }) =>
        graphqlRequest<GenerateTextResponse, typeof variables>(GENERATE_AI_CONTENT_MUTATION, variables)
});

const useGenerateAiChatResponse = () => useMutation({
    mutationFn: (variables: { message: string, context: string, workflowId?: string }) =>
        graphqlRequest<GenerateChatResponse, typeof variables>(GENERATE_AI_CHAT_RESPONSE_MUTATION, variables)
});

const useSimulateScenario = () => useMutation({
    mutationFn: (variables: { workflowId: string, parameters: ScenarioParameters }) =>
        graphqlRequest<SimulateScenarioResponse, typeof variables>(SIMULATE_SCENARIO_MUTATION, variables)
});

const useUserProfile = (userId: string) => useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => graphqlRequest<GetUserProfileResponse, { userId: string }>(GET_USER_PROFILE_QUERY, { userId }),
    enabled: !!userId,
});

const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { userId: string, profile: UserProfileUpdateInput }) => graphqlRequest<UpdateUserProfileResponse, typeof args>(UPDATE_USER_PROFILE_MUTATION, args),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
        }
    });
};

const useUserPlans = (userId: string) => useQuery({
    queryKey: ['userPlans', userId],
    queryFn: () => graphqlRequest<GetUserPlansResponse, { userId: string }>(GET_USER_PLANS_QUERY, { userId }),
    enabled: !!userId,
});

// ================================================================================================
// HELPER & UI SUB-COMPONENTS
// ================================================================================================

const UserContext = createContext<string | null>(null);

const AIGeneratorWidget: FC<{
    title: string;
    prompt: string;
    businessPlan: string;
    workflowId?: string;
    children?: (result: string) => React.ReactNode;
    className?: string;
}> = ({ title, prompt, businessPlan, workflowId, children, className }) => {
    const { mutate, data, isPending, error, isSuccess } = useGenerateAiContent();
    const result = data?.generateTextWithContext;

    const handleGenerate = () => {
        if (!isPending) { 
            mutate({ prompt, context: businessPlan, workflowId });
        }
    };

    return (
        <Card title={title} className={className}>
            <div className="space-y-3 min-h-[8rem] flex flex-col justify-between">
                {error && <p className="text-red-400 text-sm text-center">{error.message}</p>}
                {isPending && (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">Generating...</span>
                    </div>
                )}
                {!isPending && result && (children ? children(result) : <p className="text-gray-300 whitespace-pre-wrap text-sm italic">"{result}"</p>)}
                {!isPending && !result && !error && (
                    <button onClick={handleGenerate} className="w-full py-2 px-4 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-200 rounded-lg text-sm font-medium transition-colors">
                        {`Generate ${title}`}
                    </button>
                )}
                {!isPending && result && (
                    <button onClick={handleGenerate} className="mt-2 w-full py-1 px-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 rounded-lg text-xs font-medium transition-colors">
                        Regenerate
                    </button>
                )}
            </div>
        </Card>
    );
};

const Scorecard: FC<{ scores: { viability: number, marketFit: number, risk: number }, className?: string }> = ({ scores, className }) => {
    const ScoreBar: FC<{ label: string, value: number, color: string, isRisk?: boolean }> = ({ label, value, color, isRisk }) => (
        <div>
            <div className="flex justify-between text-xs text-gray-300">
                <span>{label}</span>
                <span>{value.toFixed(0)}{isRisk ? '' : '%'}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${isRisk ? (100 - value) : value}%` }}></div>
            </div>
        </div>
    );

    return (
        <Card title="Heuristic API Scorecard" variant='outline' className={className}>
            <div className="space-y-3">
                <ScoreBar label="Viability Score" value={scores.viability} color="bg-cyan-500" />
                <ScoreBar label="Market Fit" value={scores.marketFit} color="bg-indigo-500" />
                <ScoreBar label="Risk Index" value={scores.risk} color="bg-red-500" isRisk />
            </div>
        </Card>
    );
};

const GrowthProjectionChart: FC<{ projections: GrowthProjection[]; title?: string }> = ({ projections, title = "Projected Growth" }) => {
    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
    return (
        <Card title={title}>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projections} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} label={{ value: "Months", position: "insideBottom", offset: 0, fill: '#9ca3af' }} />
                        <YAxis yAxisId="left" tick={{ fill: '#9ca3af', fontSize: 10 }} label={{ value: "Users", angle: -90, position: "insideLeft", fill: '#9ca3af' }} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} tick={{ fill: '#9ca3af', fontSize: 10 }} label={{ value: "Revenue", angle: 90, position: "insideRight", fill: '#9ca3af' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563', borderRadius: '8px' }}
                            itemStyle={{ color: '#e5e7eb' }}
                            labelStyle={{ color: '#9ca3af' }}
                            formatter={(value: number, name: string) => {
                                return name === 'revenue' ? formatCurrency(value) : value.toLocaleString();
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '10px' }} />
                        <Line yAxisId="left" type="monotone" dataKey="users" stroke="#06b6d4" name="Users" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#6366f1" name="Revenue" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const MentorshipSuggestions: FC<{ mentors: Mentor[] }> = ({ mentors }) => {
    return (
        <Card title="Recommended Mentors">
            <div className="space-y-4">
                {mentors.length === 0 && <p className="text-gray-400 text-center">No mentor suggestions at this time.</p>}
                {mentors.map(mentor => (
                    <div key={mentor.id} className="flex items-center bg-gray-900/50 p-3 rounded-lg">
                        <img src={mentor.imageUrl} alt={mentor.name} className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-cyan-500" />
                        <div>
                            <h4 className="font-semibold text-gray-100">{mentor.name}</h4>
                            <p className="text-xs text-cyan-400">{mentor.expertise}</p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{mentor.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const AIChatWindow: FC<{
    businessPlan: string;
    workflowId?: string;
    initialMessage?: string;
    className?: string;
}> = ({ businessPlan, workflowId, initialMessage, className }) => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>(initialMessage ? [{ sender: 'ai', text: initialMessage }] : []);
    const [input, setInput] = useState('');
    const { mutate, isPending } = useGenerateAiChatResponse();
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    const handleSendMessage = useCallback(() => {
        if (input.trim() === '') return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');

        mutate({
            message: userMessage,
            context: businessPlan,
            workflowId
        }, {
            onSuccess: (data) => {
                setMessages(prev => [...prev, { sender: 'ai', text: data.generateAIChatResponse }]);
            },
            onError: (err) => {
                setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${err.message}` }]);
            }
        });
    }, [input, businessPlan, workflowId, mutate]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isPending) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card title="Plato AI Chat" className={`flex flex-col h-full ${className}`}>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 text-sm custom-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-700/50 text-white' : 'bg-gray-800 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isPending && (
                    <div className="flex justify-start">
                        <div className="max-w-[75%] p-3 rounded-lg bg-gray-800 text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                <span>Plato is typing...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-700 mt-auto">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Plato anything..."
                        className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        disabled={isPending}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isPending || input.trim() === ''}
                        className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </Card>
    );
};

const ScenarioSimulator: FC<{
    workflowId: string;
    baseProjections: GrowthProjection[];
    className?: string;
}> = ({ workflowId, baseProjections, className }) => {
    const [params, setParams] = useState<ScenarioParameters>({
        customerAcquisitionMultiplier: 1.0,
        conversionRateMultiplier: 1.0,
        averageRevenuePerUserMultiplier: 1.0,
        churnRateIncrease: 0,
        scenarioName: 'Optimistic'
    });
    const { mutate, data, isPending, error } = useSimulateScenario();
    const [currentScenarioProjections, setCurrentScenarioProjections] = useState<GrowthProjection[]>(baseProjections);
    const [scenarioName, setScenarioName] = useState('Base Case');

    useEffect(() => {
        if (data?.simulateScenario.projections) {
            setCurrentScenarioProjections(data.simulateScenario.projections);
            setScenarioName(data.simulateScenario.scenarioName);
        } else {
            setCurrentScenarioProjections(baseProjections);
            setScenarioName('Base Case');
        }
    }, [data, baseProjections]);

    const handleParamChange = (key: keyof ScenarioParameters, value: number | string) => {
        setParams(prev => ({
            ...prev,
            [key]: typeof value === 'string' ? value : parseFloat(value.toFixed(2))
        }));
    };

    const handleSimulate = () => {
        mutate({ workflowId, parameters: params });
    };

    const resetScenario = () => {
        setParams({
            customerAcquisitionMultiplier: 1.0,
            conversionRateMultiplier: 1.0,
            averageRevenuePerUserMultiplier: 1.0,
            churnRateIncrease: 0,
            scenarioName: 'Optimistic'
        });
        setCurrentScenarioProjections(baseProjections);
        setScenarioName('Base Case');
    };


    return (
        <Card title="Scenario Simulator" className={`flex flex-col ${className}`}>
            <div className="flex-grow p-4 space-y-4">
                <h4 className="text-lg font-semibold text-cyan-300 mb-2">Adjust Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Acquisition Multiplier ({params.customerAcquisitionMultiplier.toFixed(2)}x)</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={params.customerAcquisitionMultiplier}
                            onChange={(e) => handleParamChange('customerAcquisitionMultiplier', parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-cyan-600/50 accent-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Conversion Multiplier ({params.conversionRateMultiplier.toFixed(2)}x)</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={params.conversionRateMultiplier}
                            onChange={(e) => handleParamChange('conversionRateMultiplier', parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-indigo-600/50 accent-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">ARPU Multiplier ({params.averageRevenuePerUserMultiplier.toFixed(2)}x)</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={params.averageRevenuePerUserMultiplier}
                            onChange={(e) => handleParamChange('averageRevenuePerUserMultiplier', parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-green-600/50 accent-green-500"
                        />
                    </div>
                     <div>
                        <label className="block text-gray-400 text-sm mb-1">Churn Increase (+{params.churnRateIncrease}%)</label>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={params.churnRateIncrease}
                            onChange={(e) => handleParamChange('churnRateIncrease', parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-red-600/50 accent-red-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={resetScenario} className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Reset</button>
                    <button onClick={handleSimulate} disabled={isPending} className="px-4 py-1 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-700">
                        {isPending ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>
                <div className="h-48 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentScenarioProjections}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                             <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} label={{ value: "Months", position: "insideBottom", offset: -5, fill: '#9ca3af' }} />
                            <YAxis yAxisId="rev" orientation="right" tickFormatter={(val)=>`$${val}`} tick={{ fill: '#9ca3af', fontSize: 10 }}/>
                             <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563' }} />
                             <Legend wrapperStyle={{ fontSize: '10px' }} />
                             <Line yAxisId="rev" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name={`Revenue (${scenarioName})`} />
                             <Line yAxisId="rev" type="monotone" dataKey="revenue" stroke="#4b5563" strokeWidth={1} strokeDasharray="3 3" dot={false} data={baseProjections} name="Baseline Revenue" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
}

const QuantumWeaverContent: FC = () => {
    const userId = "user_001"; 
    const [planInput, setPlanInput] = useState('');
    const { mutate: startAnalysis, isPending: isStarting } = useStartAnalysis();
    const { data: userPlans, isLoading: isLoadingPlans } = useUserPlans(userId);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
    
    // Use selected workflow or the latest one
    const activeWorkflowId = selectedWorkflowId || (userPlans?.getUserPlans?.[0]?.workflowId);
    const currentStatus = userPlans?.getUserPlans?.find(p => p.workflowId === activeWorkflowId)?.status || null;

    const { data: analysisStatus, isLoading: isStatusLoading } = useAnalysisStatus(activeWorkflowId || null, currentStatus);
    const workflowData = analysisStatus?.getBusinessPlanAnalysisStatus;

    const handleStart = () => {
        if (planInput.trim()) {
            startAnalysis({ plan: planInput, userId });
            setPlanInput('');
        }
    };

    useEffect(() => {
        if (userPlans?.getUserPlans?.length && !selectedWorkflowId) {
            setSelectedWorkflowId(userPlans.getUserPlans[0].workflowId);
        }
    }, [userPlans, selectedWorkflowId]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Quantum Weaver Incubator</h2>
                {userPlans?.getUserPlans?.length ? (
                    <select 
                        value={selectedWorkflowId || ''} 
                        onChange={(e) => setSelectedWorkflowId(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-1"
                    >
                        {userPlans.getUserPlans.map((plan: any) => (
                            <option key={plan.workflowId} value={plan.workflowId}>
                                {plan.businessPlan ? plan.businessPlan.substring(0, 30) + '...' : plan.workflowId}
                            </option>
                        ))}
                    </select>
                ) : null}
            </div>

            {!activeWorkflowId ? (
                <Card title="Start New Analysis">
                    <textarea
                        value={planInput}
                        onChange={(e) => setPlanInput(e.target.value)}
                        placeholder="Describe your business idea..."
                        className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white mb-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <button
                        onClick={handleStart}
                        disabled={isStarting || !planInput.trim()}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        {isStarting ? 'Analyzing...' : 'Analyze Business Plan'}
                    </button>
                </Card>
            ) : (
                <>
                     {isStatusLoading && <p className="text-center text-gray-400">Loading analysis status...</p>}
                     
                     {workflowData?.status === 'PENDING' && (
                         <div className="text-center p-10">
                             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                             <p className="text-cyan-300 animate-pulse">AI is analyzing your business plan...</p>
                         </div>
                     )}

                     {workflowData?.result && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                             {/* Left Column: Overview & Metrics */}
                             <div className="space-y-6 lg:col-span-2">
                                 <Card title="Executive Summary">
                                     <p className="text-gray-300 mb-4">{workflowData.result.feedback}</p>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div className="bg-gray-800 p-3 rounded border border-gray-700">
                                             <span className="text-gray-400 text-sm">Estimated Seed Loan</span>
                                             <p className="text-2xl font-bold text-green-400">${workflowData.result.loanAmount?.toLocaleString()}</p>
                                         </div>
                                         <div className="bg-gray-800 p-3 rounded border border-gray-700">
                                             <span className="text-gray-400 text-sm">Analysis Confidence</span>
                                             <p className="text-2xl font-bold text-cyan-400">High</p>
                                         </div>
                                     </div>
                                 </Card>
                                 
                                 {workflowData.result.metrics && (
                                     <Scorecard scores={workflowData.result.metrics} />
                                 )}

                                 {workflowData.result.growthProjections && (
                                     <GrowthProjectionChart projections={workflowData.result.growthProjections} />
                                 )}
                                 
                                 {workflowData.result.growthProjections && (
                                     <ScenarioSimulator 
                                        workflowId={workflowData.workflowId} 
                                        baseProjections={workflowData.result.growthProjections} 
                                     />
                                 )}
                             </div>

                             {/* Right Column: AI Assistant & Tools */}
                             <div className="space-y-6">
                                 <AIGeneratorWidget 
                                     title="Elevator Pitch Generator" 
                                     prompt="Generate a compelling 30-second elevator pitch for this business." 
                                     businessPlan={workflowData.businessPlan}
                                     workflowId={workflowData.workflowId}
                                 />
                                 
                                 <AIChatWindow 
                                     businessPlan={workflowData.businessPlan} 
                                     workflowId={workflowData.workflowId}
                                     className="h-[500px]"
                                 />
                                 
                                 {workflowData.result.potentialMentors && (
                                     <MentorshipSuggestions mentors={workflowData.result.potentialMentors} />
                                 )}
                             </div>
                         </div>
                     )}
                     
                     {/* Create New Button */}
                     <button 
                        onClick={() => setSelectedWorkflowId(null)} 
                        className="fixed bottom-8 right-8 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-4 shadow-lg z-50"
                     >
                        + New Analysis
                     </button>
                </>
            )}
        </div>
    );
};

const queryClient = new QueryClient();

const QuantumWeaverView: FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <QuantumWeaverContent />
        </QueryClientProvider>
    );
};

export default QuantumWeaverView;
