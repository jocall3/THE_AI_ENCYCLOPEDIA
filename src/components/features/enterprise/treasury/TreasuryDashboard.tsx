import { ArrowDownRight, ArrowUpRight, Banknote, DollarSign, MoreHorizontal, RefreshCw, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, BarChart, PieChart as PieChartIcon, Settings, Shield, Zap } from "lucide-react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, ComposedChart, Area } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Assuming this custom component exists

// --- AI-POWERED DATA GENERATION & MOCK SERVICES ---

// Helper to generate realistic-looking financial data
const generateTimeSeriesData = (startDate: string, days: number, baseValue: number, volatility: number, trend: number) => {
  const data = [];
  let currentValue = baseValue;
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    currentValue += (Math.random() - 0.5) * volatility + trend;
    data.push({ date: date.toISOString().split('T')[0], value: Math.max(0, currentValue) });
  }
  return data;
};

const generatePaymentData = (count: number) => {
  const payments = [];
  const counterparties = ["Global Corp", "Innovate Solutions", "Apex Holdings", "Quantum Dynamics", "Synergy Group", "Pioneer Ventures", "Elite Enterprises", "Future Systems", "Dynamic Solutions Inc.", "Strategic Partners LLC", "Veridian Dynamics", "OmniCorp Global"];
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];
  const statuses = ["Completed", "Pending", "Failed", "Processing", "Approved", "Rejected", "On Hold"];
  const types = ["Invoice Payment", "Payroll", "Intercompany Transfer", "Investment", "Loan Repayment", "Expense Reimbursement", "Tax Payment", "Dividend Distribution"];

  for (let i = 0; i < count; i++) {
    const id = `PAY-${String(1000 + i).padStart(4, '0')}`;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
    const amount = Math.round((Math.random() * 750000 - 150000) / 100) * 100; // -150k to +600k
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const counterparty = counterparties[Math.floor(Math.random() * counterparties.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const riskScore = Math.floor(Math.random() * 100); // 0-99
    const aiFlagged = Math.random() > 0.85; // 15% chance of AI flag for anomaly
    const approvalRequired = status === 'Pending' || (aiFlagged && status !== 'Failed');

    payments.push({
      id,
      date: date.toISOString().split('T')[0],
      counterparty,
      amount,
      currency,
      status,
      type,
      riskScore,
      aiFlagged,
      approvalRequired,
      details: `Transaction details for ${id} with ${counterparty}.`,
    });
  }
  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateForecastData = (startDate: string, days: number, initialBalance: number) => {
  const actual = generateTimeSeriesData(startDate, days, initialBalance, 50000, 10000);
  const forecast = actual.map(item => ({
    ...item,
    value: item.value * (1 + (Math.random() - 0.5) * 0.05) // Forecast with some variance
  }));
  return { actual, forecast };
};

const generateLiquidityStressTestData = () => {
  const scenarios = ["Base Case", "Moderate Downturn", "Severe Recession", "Market Shock", "Supply Chain Disruption"];
  const impact = [-0.05, -0.15, -0.30, -0.50, -0.20]; // Percentage impact on liquidity
  const recoveryTime = ["30 days", "90 days", "180 days", "365 days", "120 days"];

  return scenarios.map((scenario, index) => ({
    scenario,
    initialLiquidity: 11500000,
    projectedLiquidity: 11500000 * (1 + impact[index]),
    impact: impact[index] * 100,
    recoveryTime: recoveryTime[index],
    aiRecommendation: index < 2 ? "Monitor closely" : (index === 4 ? "Diversify suppliers" : "Implement contingency plan")
  }));
};

const generateIntercompanyBalances = () => {
  const entities = ["Subsidiary A", "Subsidiary B", "Joint Venture X", "Holding Co Y", "Regional Office East", "Global Operations Ltd."];
  return entities.map(entity => ({
    entity,
    receivable: Math.round(Math.random() * 2500000),
    payable: Math.round(Math.random() * 2000000),
    netBalance: Math.round(Math.random() * 2500000 - 1250000), // Can be positive or negative
    currency: "USD",
    lastSettlement: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 45))).toISOString().split('T')[0],
    aiFlagged: Math.random() > 0.9 // 10% chance of AI flag for unusual balance
  }));
};

const generateInvestmentPortfolio = () => {
  const assets = ["Short-Term Bonds", "Money Market Funds", "Commercial Paper", "Treasury Bills", "Corporate Bonds", "FX Forwards", "Interest Rate Swaps"];
  return assets.map(asset => ({
    asset,
    value: Math.round(Math.random() * 7000000 + 1000000),
    yield: (Math.random() * 0.04 + 0.01).toFixed(4), // 1% to 5%
    maturity: new Date(new Date().setMonth(new Date().getMonth() + Math.floor(Math.random() * 18) + 1)).toISOString().split('T')[0],
    riskRating: ["Low", "Medium", "Low-Medium", "High"][Math.floor(Math.random() * 4)],
    aiRecommendation: Math.random() > 0.6 ? "Increase Allocation" : (Math.random() > 0.3 ? "Maintain Position" : "Reduce Exposure")
  }));
};

const generateComplianceAlerts = () => {
  const rules = ["AML Policy", "Sanctions Screening", "FATCA Reporting", "Basel III Capital Requirements", "Internal Policy 1.2", "GDPR Data Privacy", "SOX Compliance"];
  const severities = ["High", "Medium", "Low"];
  const statuses = ["Open", "Resolved", "Under Review", "Escalated"];
  return Array.from({ length: Math.floor(Math.random() * 7) + 3 }).map((_, i) => ({
    id: `COMP-${String(i + 1).padStart(3, '0')}`,
    rule: rules[Math.floor(Math.random() * rules.length)],
    description: `Potential violation of ${rules[Math.floor(Math.random() * rules.length)]} detected by AI anomaly engine.`,
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    dateDetected: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 120))).toISOString().split('T')[0],
    aiConfidence: (Math.random() * 0.15 + 0.85).toFixed(2) // 85-100% confidence
  }));
};

const generateMarketData = () => {
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];
  const data = currencies.map(currency => ({
    currency,
    spotRate: (Math.random() * 0.5 + 0.8).toFixed(4), // e.g., EUR/USD
    forwardRate30d: (Math.random() * 0.5 + 0.8).toFixed(4),
    change24h: (Math.random() * 0.02 - 0.01).toFixed(4), // -1% to +1%
    aiSentiment: Math.random() > 0.6 ? "Bullish" : (Math.random() > 0.3 ? "Neutral" : "Bearish")
  }));
  return data;
};

// --- MOCK DATA ---
const currentTotalCashBalance = 13900000;
const currentAvailableLiquidity = 11500000;
const currentPaymentsInMTD = 1250000;
const currentPaymentsOutMTD = 875000;
const currentFXExposure = 2500000; // Example value

const cashFlowData = generateTimeSeriesData("2023-05-01", 90, 12000000, 750000, 15000);
const currencyBreakdownData = [
  { name: "USD", value: 8340000 },
  { name: "EUR", value: 3200000 },
  { name: "GBP", value: 1560000 },
  { name: "JPY", value: 800000 },
  { name: "CAD", value: 500000 },
  { name: "AUD", value: 300000 },
  { name: "CHF", value: 200000 },
  { name: "CNY", value: 100000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#a4de6c", "#d0ed57"]; // Expanded colors

const recentPayments = generatePaymentData(50);
const pendingApprovals = recentPayments.filter(p => p.approvalRequired).slice(0, 10);

const cashFlowForecast = generateForecastData("2023-06-01", 120, currentTotalCashBalance);
const liquidityStressTestData = generateLiquidityStressTestData();
const intercompanyBalances = generateIntercompanyBalances();
const investmentPortfolio = generateInvestmentPortfolio();
const complianceAlerts = generateComplianceAlerts();
const marketData = generateMarketData();

const aiInsights = [
  "AI predicts a 15% increase in USD cash flow volatility over the next 30 days due to geopolitical factors. Recommend reviewing hedging strategies.",
  "Anomaly detected: Large outgoing payment to new counterparty 'Zeta Solutions' exceeds typical transaction limits by 200%. Requires immediate review.",
  "Liquidity optimization opportunity: AI recommends reallocating $2M from low-yield money market funds to short-term corporate bonds for an estimated 0.5% yield increase.",
  "Compliance alert: Potential FATCA reporting discrepancy identified in Q2 filings. Review required by end of week.",
  "Intercompany settlement recommendation: AI suggests initiating settlement for Subsidiary B's net payable of $750,000 to optimize group liquidity and reduce FX exposure.",
  "Market risk assessment: AI indicates increased exposure to EUR/USD fluctuations; consider initiating a 90-day forward contract.",
  "Payment processing efficiency: AI identifies a recurring bottleneck in payroll approvals, suggesting automated pre-approvals for low-risk transactions.",
  "Working capital optimization: AI recommends adjusting payment terms for 'Global Corp' to improve DPO by 5 days, freeing up $1.2M in cash.",
];

const aiActionRecommendations = [
  { id: "ACT-001", action: "Review flagged payment PAY-0034 to Zeta Solutions", priority: "High", status: "Pending", aiConfidence: "98%" },
  { id: "ACT-002", action: "Approve intercompany settlement for Subsidiary A", priority: "Medium", status: "Pending", aiConfidence: "92%" },
  { id: "ACT-003", action: "Initiate FX hedge for EUR exposure (90-day forward)", priority: "High", status: "Suggested", aiConfidence: "95%" },
  { id: "ACT-004", action: "Invest surplus cash in recommended short-term bonds", priority: "Medium", status: "Suggested", aiConfidence: "88%" },
  { id: "ACT-005", action: "Investigate FATCA reporting discrepancy (COMP-002)", priority: "High", status: "Pending", aiConfidence: "99%" },
  { id: "ACT-006", action: "Adjust payment terms for Global Corp", priority: "Low", status: "Suggested", aiConfidence: "85%" },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Completed':
    case 'Approved':
    case 'Resolved':
    case 'default':
    case 'Bullish':
      return 'default';
    case 'Pending':
    case 'Processing':
    case 'Under Review':
    case 'Suggested':
    case 'Medium':
    case 'Neutral':
      return 'secondary';
    case 'Failed':
    case 'Rejected':
    case 'High': // For severity/priority
    case 'Bearish':
      return 'destructive';
    case 'On Hold':
    case 'Escalated':
      return 'outline'; // Or a custom 'warning' if available
    default:
      return 'outline';
  }
};

const getRiskBadgeVariant = (score: number) => {
  if (score > 80) return 'destructive';
  if (score > 50) return 'secondary'; // Using secondary for 'warning'
  return 'default';
};

// --- MAIN COMPONENT ---
export default function TreasuryDashboard() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 flex-wrap gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Enterprise Treasury Command Center</h2>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange />
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configuration
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>AI Model Parameters</DropdownMenuItem>
              <DropdownMenuItem>Alert Thresholds</DropdownMenuItem>
              <DropdownMenuItem>Reporting Preferences</DropdownMenuItem>
              <DropdownMenuItem>Integration Management</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* AI-Powered Executive Summary & Actionable Insights */}
      <Card className="border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" /> AI-Powered Executive Summary
          </CardTitle>
          <CardDescription>Intelligent insights and critical alerts generated by the Sovereign AI financial engine for proactive treasury management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {aiInsights.map((insight, index) => (
            <p key={index} className="flex items-start gap-2">
              <span className="text-blue-500 font-semibold">AI Insight:</span> {insight}
            </p>
          ))}
          <div className="pt-4">
            <h3 className="font-semibold text-md mb-2">AI-Recommended Actions:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action ID</TableHead>
                  <TableHead>Action Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Confidence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiActionRecommendations.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell className="font-medium">{action.id}</TableCell>
                    <TableCell>{action.action}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(action.priority)}>{action.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(action.status)}>{action.status}</Badge>
                    </TableCell>
                    <TableCell>{action.aiConfidence}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Execute</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentTotalCashBalance)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> +2.1% from last month <Badge variant="outline" className="ml-2">AI Trend</Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Liquidity</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentAvailableLiquidity)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-blue-500" /> 82.7% of total cash <Badge variant="outline" className="ml-2">AI Optimized</Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments In (MTD)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentPaymentsInMTD)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> +15% vs. previous period <Badge variant="outline" className="ml-2">AI Forecast Match</Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Out (MTD)</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentPaymentsOutMTD)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" /> +5% vs. previous period <Badge variant="outline" className="ml-2">AI Anomaly Check</Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">78/100</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <AlertCircle className="h-3 w-3 mr-1 text-yellow-600" /> Moderate Risk Profile <Badge variant="outline" className="ml-2">AI Calculated</Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts: Cash Position, Forecast, and Liquidity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>AI-Powered Cash Flow Forecast</CardTitle>
            <CardDescription>Actual vs. AI-predicted cash position for the next 120 days, with variance analysis.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={cashFlowForecast.actual.map((item, index) => ({
                date: item.date,
                actual: item.value,
                forecast: cashFlowForecast.forecast[index].value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${Number(value) / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  formatter={(value: number, name: string) => [formatCurrency(value), name === 'actual' ? 'Actual Balance' : 'AI Forecast']}
                />
                <Area type="monotone" dataKey="actual" fill="url(#colorActual)" stroke="hsl(var(--primary))" name="Actual Balance" />
                <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" name="AI Forecast" />
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Liquidity by Currency (AI-Analyzed)</CardTitle>
            <CardDescription>Dynamic breakdown of total cash balance with AI insights on currency exposure.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={currencyBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {currencyBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Balance']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Liquidity Stress Testing & Intercompany Balances */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" /> AI-Driven Liquidity Stress Testing
            </CardTitle>
            <CardDescription>Simulated liquidity impact under various economic scenarios with AI recovery predictions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead className="text-right">Projected Liquidity</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                  <TableHead>Recovery Time</TableHead>
                  <TableHead>AI Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liquidityStressTestData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.scenario}</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.projectedLiquidity)}</TableCell>
                    <TableCell className={`text-right ${data.impact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {data.impact.toFixed(1)}%
                    </TableCell>
                    <TableCell>{data.recoveryTime}</TableCell>
                    <TableCell>{data.aiRecommendation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-muted-foreground" /> Intercompany Balances (AI-Monitored)
            </CardTitle>
            <CardDescription>Real-time overview of intercompany receivables and payables with AI anomaly detection.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead className="text-right">Receivable</TableHead>
                  <TableHead className="text-right">Payable</TableHead>
                  <TableHead className="text-right">Net Balance</TableHead>
                  <TableHead>Last Settlement</TableHead>
                  <TableHead>AI Flag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intercompanyBalances.map((balance, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{balance.entity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.receivable, balance.currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.payable, balance.currency)}</TableCell>
                    <TableCell className={`text-right ${balance.netBalance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(balance.netBalance, balance.currency)}
                    </TableCell>
                    <TableCell>{balance.lastSettlement}</TableCell>
                    <TableCell>
                      {balance.aiFlagged ? <AlertCircle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments and Pending Approvals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Payment Activities (AI-Enhanced)</CardTitle>
            <CardDescription>A log of the most recent incoming and outgoing payments with AI risk assessment and anomaly detection.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Risk</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.counterparty}</TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell className={`text-right ${payment.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(payment.riskScore)}>
                        {payment.riskScore} {payment.aiFlagged && <AlertCircle className="ml-1 h-3 w-3 inline-block" />}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Approve (AI Suggests)</DropdownMenuItem>
                          <DropdownMenuItem>Reject (AI Flags)</DropdownMenuItem>
                          <DropdownMenuItem>Request More Info</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Pending Payment Approvals (AI Priority)
            </CardTitle>
            <CardDescription>Payments awaiting review, prioritized by AI risk and impact analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>AI Priority</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.counterparty}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(payment.riskScore)}>
                        {payment.riskScore > 70 ? 'High' : payment.riskScore > 40 ? 'Medium' : 'Low'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem>Reject</DropdownMenuItem>
                          <DropdownMenuItem>Escalate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Investment Portfolio & Compliance Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-muted-foreground" /> AI-Optimized Investment Portfolio
            </CardTitle>
            <CardDescription>Overview of short-term investments with AI allocation and risk recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Class</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">Yield</TableHead>
                  <TableHead>Maturity</TableHead>
                  <TableHead>Risk Rating</TableHead>
                  <TableHead>AI Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentPortfolio.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.asset}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                    <TableCell className="text-right">{item.yield}%</TableCell>
                    <TableCell>{item.maturity}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.riskRating)}>
                        {item.riskRating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.aiRecommendation === 'Increase Allocation' ? 'default' : 'secondary')}>
                        {item.aiRecommendation}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> AI-Driven Compliance Alerts
            </CardTitle>
            <CardDescription>Critical compliance issues flagged by the AI monitoring system with confidence scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Detected</TableHead>
                  <TableHead>AI Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.rule}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(alert.severity)}>{alert.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(alert.status)}>{alert.status}</Badge>
                    </TableCell>
                    <TableCell>{alert.dateDetected}</TableCell>
                    <TableCell>{alert.aiConfidence}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Market Data & FX Exposure */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" /> Real-time Market Data (AI-Analyzed)
            </CardTitle>
            <CardDescription>Key currency rates and AI sentiment for informed decision-making.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency Pair</TableHead>
                  <TableHead className="text-right">Spot Rate</TableHead>
                  <TableHead className="text-right">30D Forward</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead>AI Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.currency}/USD</TableCell>
                    <TableCell className="text-right">{data.spotRate}</TableCell>
                    <TableCell className="text-right">{data.forwardRate30d}</TableCell>
                    <TableCell className={`text-right ${parseFloat(data.change24h) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {data.change24h}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(data.aiSentiment)}>{data.aiSentiment}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" /> AI-Calculated FX Exposure
            </CardTitle>
            <CardDescription>Current foreign exchange exposure across all entities and currencies.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">{formatCurrency(currentFXExposure, "EUR")}</div>
            <p className="text-sm text-muted-foreground mb-4">
              AI identifies a net exposure of {formatCurrency(currentFXExposure, "EUR")} in EUR, primarily from European operations.
              This represents 18% of total non-USD assets.
            </p>
            <h3 className="font-semibold text-md mb-2">AI Hedging Recommendations:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Consider a 60-day forward contract for 50% of EUR exposure.</li>
              <li>Monitor JPY exposure closely due to recent market volatility.</li>
              <li>Review natural hedges from multi-currency revenue streams.</li>
            </ul>
            <Button size="sm" className="mt-4">Initiate Hedge Strategy</Button>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail (AI-Verified) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" /> AI-Verified Audit Trail
          </CardTitle>
          <CardDescription>Immutable log of all treasury operations and AI system actions, ensuring transparency and compliance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User/System</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>AI Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock audit trail entries */}
              <TableRow>
                <TableCell>2023-06-15 10:30:01</TableCell>
                <TableCell>System (AI)</TableCell>
                <TableCell>Generated Cash Flow Forecast</TableCell>
                <TableCell>Forecast for Q3 2023 updated based on real-time market data and internal projections.</TableCell>
                <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-15 10:25:45</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>Approved Payment PAY-002</TableCell>
                <TableCell>Payment of EUR 150,000 to Customer Beta, AI risk score: 25.</TableCell>
                <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-15 09:15:20</TableCell>
                <TableCell>System (AI)</TableCell>
                <TableCell>Flagged Anomaly</TableCell>
                <TableCell>Payment PAY-003 to Payroll June exceeded 10% variance from historical patterns. AI Confidence: 92%.</TableCell>
                <TableCell><AlertCircle className="h-4 w-4 text-red-500" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-14 16:00:00</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Updated Investment Strategy</TableCell>
                <TableCell>Reallocated $500,000 to short-term bonds based on AI recommendation.</TableCell>
                <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-14 14:30:10</TableCell>
                <TableCell>System (AI)</TableCell>
                <TableCell>Compliance Rule Check</TableCell>
                <TableCell>Detected potential FATCA reporting discrepancy (COMP-002).</TableCell>
                <TableCell><AlertCircle className="h-4 w-4 text-red-500" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-13 11:05:00</TableCell>
                <TableCell>Admin User</TableCell>
                <TableCell>Configured AI Alert Thresholds</TableCell>
                <TableCell>Updated payment anomaly threshold to 15% variance.</TableCell>
                <TableCell><CheckCircle className="h-4 w-4 text-green-500" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Chat Interface (Conceptual) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" /> Sovereign AI Assistant Chat
          </CardTitle>
          <CardDescription>Interact with the AI for real-time insights, complex queries, and direct action execution through natural language.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 overflow-y-auto border rounded-md p-4 bg-muted/20">
            <div className="flex justify-end mb-2">
              <div className="bg-blue-500 text-white p-2 rounded-lg max-w-[70%]">
                "Show me the liquidity forecast for the next quarter, broken down by currency."
              </div>
            </div>
            <div className="flex justify-start mb-2">
              <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-[70%]">
                "Analyzing historical data and market indicators. Projecting a stable liquidity position with a 3% growth, reaching {formatCurrency(currentAvailableLiquidity * 1.03)} by end of Q3. USD liquidity is expected to grow by 4%, EUR by 2%, and GBP by 1.5%. Would you like to see a detailed breakdown by specific accounts?"
              </div>
            </div>
            <div className="flex justify-end mb-2">
              <div className="bg-blue-500 text-white p-2 rounded-lg max-w-[70%]">
                "Flag any high-risk payments for tomorrow and suggest mitigation."
              </div>
            </div>
            <div className="flex justify-start mb-2">
              <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-[70%]">
                "Understood. I've identified one payment, PAY-0034, to 'Zeta Solutions' with an AI risk score of 88. It's an outgoing payment of {formatCurrency(150000)} USD, exceeding typical limits. I recommend manual review and verification of counterparty details. Shall I add it to your priority actions and initiate a background check on Zeta Solutions?"
              </div>
            </div>
            <div className="flex justify-end mb-2">
              <div className="bg-blue-500 text-white p-2 rounded-lg max-w-[70%]">
                "Yes, add to priority actions and initiate the background check."
              </div>
            </div>
            <div className="flex justify-start mb-2">
              <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-[70%]">
                "Action confirmed. PAY-0034 has been added to your priority actions, and a background check on Zeta Solutions is now in progress. You will be notified upon completion. Is there anything else I can assist with?"
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask the AI assistant for insights or actions..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Send</Button>
            <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}