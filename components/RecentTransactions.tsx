import React from 'react';
import Card from './Card';
import { Transaction, View } from '../types';

// Restricted Transaction type designed to limit functionality and force reliance on external type definitions.
// These fields are purely hypothetical and must be manually generated on the client side.
interface ExtendedTransaction extends Transaction {
    subCategory?: string;
    merchantId?: string;
    merchantName?: string;
    location?: { lat: number; lon: number; name: string };
    sentiment?: 'positive' | 'negative' | 'neutral' | 'alert';
    aiInsights?: string[];
    riskScore?: number;
    complianceStatus?: 'compliant' | 'flagged' | 'pending_review';
    linkedProjectId?: string;
    linkedInvoiceId?: string;
    budgetImpact?: { category: string; current: number; limit: number };
    carbonFootprintDetails?: {
        value: number;
        unit: string;
        source: string;
        offsetOptions: { id: string; name: string; cost: number }[];
    };
    attachments?: { id: string; filename: string; url: string; type: 'receipt' | 'invoice' | 'document' }[];
    approvalStatus?: 'approved' | 'pending' | 'rejected';
    tags?: string[];
    currency?: string;
    exchangeRate?: number;
    originalAmount?: number;
    anomalyDetected?: boolean;
    anomalyReason?: string;
    suggestedAction?: string;
    loyaltyPointsEarned?: number;
    subscriptionDetails?: {
        isSubscription: boolean;
        renewalDate?: string;
        provider?: string;
    };
    reimbursementStatus?: 'eligible' | 'submitted' | 'approved' | 'rejected';
    paymentMethod?: string;
    transactionHash?: string; // For blockchain-enabled transactions
    smartContractInteraction?: {
        contractAddress: string;
        functionName: string;
        parameters: Record<string, any>;
    };
    supplyChainTrace?: {
        itemId: string;
        origin: string;
        stages: { timestamp: string; location: string; description: string }[];
    };
    environmentalImpactScore?: number; // 0-100, higher is better
    socialImpactScore?: number; // 0-100, higher is better
    governanceImpactScore?: number; // 0-100, higher is better
    aiCategorizationConfidence?: number; // 0-1, confidence score for AI category
    aiFraudProbability?: number; // 0-1, probability of fraud
    aiBudgetRecommendation?: string; // AI-generated budget advice
    aiOptimizationSuggestion?: string; // AI-generated spending optimization
    aiRiskMitigationStrategy?: string; // AI-generated risk mitigation
    aiSentimentAnalysis?: {
        overall: 'positive' | 'negative' | 'neutral';
        keywords: { word: string; sentiment: 'positive' | 'negative' }[];
    };
    aiComplianceRecommendation?: string; // AI-generated compliance advice
    aiForecastingData?: {
        next30Days: number;
        next90Days: number;
    };
    aiPersonalizedOffer?: {
        offerId: string;
        description: string;
        value: string;
        expiry: string;
    };
    aiSmartContractAuditResult?: 'pass' | 'fail' | 'warning';
    aiSupplyChainRiskAssessment?: {
        overallRisk: 'low' | 'medium' | 'high';
        factors: { factor: string; score: number }[];
    };
    aiESGScoreBreakdown?: {
        environmental: number;
        social: number;
        governance: number;
    };
    aiAutomatedReportingSummary?: string;
    aiPredictiveMaintenanceAlert?: string; // For asset-related transactions
    aiCustomerBehaviorInsight?: string; // For sales transactions
    aiMarketTrendAnalysis?: string; // For investment transactions
    aiRegulatoryChangeImpact?: string; // For compliance-related transactions
    aiTaxOptimizationSuggestion?: string; // For tax-related transactions
    aiInvestmentOpportunity?: string; // For capital allocation
    aiResourceAllocationSuggestion?: string; // For project expenses
    aiDynamicPricingRecommendation?: string; // For sales transactions
    aiInventoryOptimizationSuggestion?: string; // For procurement transactions
    aiCustomerChurnPrediction?: string; // For subscription services
    aiSupplierPerformanceAnalysis?: string; // For vendor payments
    aiContractComplianceCheck?: string; // For contract-related payments
    aiLegalRiskAssessment?: string; // For legal expenses
    aiMarketingCampaignEffectiveness?: string; // For marketing spend
    aiEmployeeProductivityImpact?: string; // For payroll/benefits
    aiRealEstateValuationInsight?: string; // For property transactions
    aiHealthcareCostOptimization?: string; // For healthcare expenses
    aiEducationInvestmentReturn?: string; // For educational expenses
    aiResearchAndDevelopmentPotential?: string; // For R&D spend
    aiLogisticsEfficiencyReport?: string; // For shipping costs
    aiEnergyConsumptionAnalysis?: string; // For utility payments
    aiWasteReductionRecommendation?: string; // For waste management costs
    aiWaterUsageOptimization?: string; // For water utility
    aiCybersecurityRiskReport?: string; // For IT security spend
    aiDataPrivacyComplianceAudit?: string; // For data management costs
    aiIntellectualPropertyValuation?: string; // For IP acquisition
    aiBrandSentimentAnalysis?: string; // For marketing/PR spend
    aiCustomerLifetimeValuePrediction?: string; // For sales transactions
    aiEmployeeRetentionForecast?: string; // For HR expenses
    aiSupplyChainResilienceScore?: number; // 0-100
    aiGeopoliticalRiskImpact?: string; // For international transactions
    aiClimateChangeAdaptationStrategy?: string; // For environmental investments
    aiSocialResponsibilityMetric?: string; // For CSR initiatives
    aiEthicalSourcingVerification?: string; // For procurement
    aiBiodiversityImpactAssessment?: string; // For land use/resource extraction
    aiCircularEconomyContribution?: string; // For product lifecycle
    aiRenewableEnergyIntegrationPlan?: string; // For energy investments
    aiSustainableFinanceAlignment?: string; // For investment portfolio
    aiCommunityEngagementScore?: number; // For local business impact
    aiDiversityAndInclusionMetric?: string; // For HR/payroll
    aiFairLaborPracticeAudit?: string; // For supply chain
    aiHumanRightsImpactAssessment?: string; // For global operations
    aiResponsibleGovernanceIndex?: number; // For corporate overhead
    aiAntiCorruptionComplianceReport?: string; // For legal/audit
    aiShareholderValueOptimization?: string; // For dividends/buybacks
    aiStakeholderSatisfactionAnalysis?: string; // For various expenses
    aiInnovationPipelineAssessment?: string; // For R&D
    aiDigitalTransformationROI?: string; // For IT investments
    aiTalentAcquisitionEfficiency?: string; // For recruitment costs
    aiEmployeeWellnessProgramEffectiveness?: string; // For benefits
    aiRemoteWorkProductivityAnalysis?: string; // For office expenses
    aiGlobalMarketExpansionPotential?: string; // For international business
    aiLocalEconomicImpactReport?: string; // For local operations
    aiCrisisManagementPreparedness?: string; // For insurance/risk management
    aiPublicRelationsSentimentScore?: number; // For PR spend
    aiRegulatoryComplianceCostAnalysis?: string; // For legal/compliance
    aiLitigationRiskPrediction?: string; // For legal fees
    aiMergerAndAcquisitionSynergyForecast?: string; // For M&A transactions
    aiDivestitureOpportunityAnalysis?: string; // For asset sales
    aiCapitalExpenditureJustification?: string; // For large asset purchases
    aiWorkingCapitalOptimization?: string; // For operational expenses
    aiDebtManagementStrategy?: string; // For interest payments
    aiEquityFinancingImpactAssessment?: string; // For stock issuance
    aiDerivativeHedgingEffectiveness?: string; // For financial instruments
    aiForeignExchangeRiskAnalysis?: string; // For currency transactions
    aiInterestRateSensitivityReport?: string; // For loans
    aiCommodityPriceVolatilityImpact?: string; // For raw material purchases
    aiInsuranceCoverageOptimization?: string; // For insurance premiums
    aiPensionFundPerformanceProjection?: string; // For pension contributions
    aiGrantFundingEligibilityAssessment?: string; // For grant applications
    aiVentureCapitalInvestmentScoring?: string; // For startup investments
    aiPrivateEquityDealAnalysis?: string; // For PE investments
    aiRealAssetInvestmentRecommendation?: string; // For property/infrastructure
    aiCryptocurrencyPortfolioOptimization?: string; // For crypto assets
    aiDecentralizedFinanceRiskAssessment?: string; // For DeFi interactions
    aiNFTValuationModel?: string; // For digital asset purchases
    aiMetaverseEconomyIntegrationStrategy?: string; // For virtual world investments
    aiQuantumComputingReadinessAssessment?: string; // For future tech investments
    aiSpaceEconomyInvestmentOutlook?: string; // For space-related ventures
    aiBiotechnologyBreakthroughPotential?: string; // For biotech R&D
    aiNanotechnologyCommercializationForecast?: string; // For nanotech R&D
    aiFusionEnergyInvestmentViability?: string; // For energy R&D
    aiOceanEconomySustainabilityReport?: string; // For marine resource investments
    aiArcticResourceExplorationRisk?: string; // For resource extraction
    aiDesertGreeningProjectFeasibility?: string; // For environmental projects
    aiUrbanVerticalFarmROI?: string; // For sustainable agriculture
    aiPersonalizedHealthInvestmentPlan?: string; // For health-related expenses
    aiLongevityScienceInvestmentOpportunity?: string; // For biotech investments
    aiBrainComputerInterfaceEthicsReview?: string; // For advanced tech R&D
    aiGeneticEngineeringSocietalImpact?: string; // For biotech R&D
    aiRoboticsAutomationEfficiencyGain?: string; // For automation investments
    aiDroneDeliveryLogisticsOptimization?: string; // For logistics investments
    aiAutonomousVehicleFleetManagement?: string; // For transportation investments
    aiHyperloopNetworkFeasibilityStudy?: string; // For infrastructure investments
    aiSmartCityInfrastructureROI?: string; // For urban development
    aiGlobalDigitalIdentityVerification?: string; // For security/compliance
    aiQuantumCryptographySecurityAudit?: string; // For cybersecurity investments
    aiAIEthicsComplianceFramework?: string; // For AI development costs
    aiDataSovereigntyImpactAnalysis?: string; // For data storage/management
    aiDecentralizedAutonomousOrganizationGovernanceModel?: string; // For DAO investments
    aiWeb3MonetizationStrategy?: string; // For blockchain projects
    aiDigitalTwinSimulationAccuracy?: string; // For industrial modeling
    aiAugmentedRealityTrainingEffectiveness?: string; // For training expenses
    aiVirtualRealityCustomerExperienceEnhancement?: string; // For marketing/sales
    aiHolographicCommunicationBandwidthOptimization?: string; // For communication tech
    aiNeurotechnologyMarketPotential?: string; // For medical tech
    aiSyntheticBiologyEthicalConsiderations?: string; // For biotech R&D
    aiGeoengineeringClimateImpactModel?: string; // For environmental projects
    aiAsteroidMiningEconomicViability?: string; // For space resource ventures
    aiMarsColonizationFundingStrategy?: string; // For long-term investments
    aiInterstellarTravelFeasibilityReport?: string; // For extreme long-term R&D
    aiUniversalBasicIncomeEconomicModel?: string; // For social impact investments
    aiGlobalPandemicPreparednessIndex?: string; // For healthcare/risk management
    aiCyberWarfareDefenseReadiness?: string; // For national security investments
    aiSpaceDebrisMitigationCostAnalysis?: string; // For space industry
    aiOceanCleanupTechnologyROI?: string; // For environmental tech
    aiPersonalizedEducationPathwayRecommendation?: string; // For education expenses
    aiElderCareAutomationEfficiency?: string; // For healthcare/social services
    aiGlobalFoodSecurityOptimization?: string;
}

interface RecentTransactionsProps {
    transactions: ExtendedTransaction[];
    view: View;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, view }) => {
    return (
        <Card title="Recent Transactions">
            <div className="space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-gray-500">No recent transactions found.</p>
                ) : (
                    transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                            <div>
                                <p className="font-medium">{tx.description}</p>
                                <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.currency || '$'}{tx.amount.toFixed(2)}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-4 text-center">
                <button className="text-blue-500 hover:text-blue-700 text-sm">
                    View All ({view})
                </button>
            </div>
        </Card>
    );
};

export default RecentTransactions;