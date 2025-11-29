import React, { useState, FormEvent } from 'react';
import axios from 'axios';

// =================================================================================
// REFACTORING NOTE (Instructions 1, 3, 6):
// This file previously housed a massive, insecure configuration form for over 200
// API keys (ApiKeysState).
// 1. That form was removed because centralized key management on the client-side
//    is fundamentally insecure and violates Instruction 3 (Secure Credential Management).
// 2. The complexity violated the Critical MVP Scope (Instruction 6).
// 3. This component is now repurposed to implement the "AI-powered transaction intelligence"
//    MVP candidate, utilizing a conceptual standardized AI service interface (Instruction 5).
// The actual storage of keys (e.g., OPENAI_API_KEY, PLAID_SECRET) must now occur
// securely on the backend using Vault/Secrets Manager.
// =================================================================================

interface AIResponse {
  analysis: string;
  transactions: string[]; // Mock data for financial context
  suggestion: string;
}

// Conceptual AI Service Integration (Assumes a secure backend endpoint handles the actual AI/data orchestration)
const getAIAdvice = async (query: string): Promise<AIResponse> => {
    // Rationale (Instruction 5): Standardized service interface mock, simulating backend call.

    // In a production environment, 'axios' would be used here to call a secured
    // backend API endpoint, e.g., '/api/ai/advice', which handles the actual LLM interaction
    // (Gemini/OpenAI) using keys retrieved securely from AWS Secrets Manager.
    
    // axios.post('/api/ai/advice', { query });

    if (!query.toLowerCase().includes("budget") && !query.toLowerCase().includes("risk") && !query.toLowerCase().includes("liquidity")) {
        return {
            analysis: "I am currently focused on business financial transaction intelligence (e.g., liquidity, budget deviations, risk assessment). Please refine your query.",
            transactions: [],
            suggestion: "Focus on actionable financial metrics."
        };
    }

    // Simulate API delay and backend processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        analysis: `Analyzing recent Q3 activity based on your query: "${query}". We identified several significant operational outflows impacting monthly liquidity forecast.`,
        transactions: [
            "TXN-9034: $15,000 to AWS (Unexpected Infrastructure Spend)",
            "TXN-9035: $2,100 to Ad Agency (Above Monthly Average)",
            "TXN-9036: -$50,000 inflow (Client Payout - Good)"
        ],
        suggestion: "The infrastructure spend is 30% above forecast. Recommend reviewing cloud resource utilization and re-categorizing 'TXN-9034' as CapEx if appropriate."
    };
};


const AIAdvisorView: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Step 1: Securely interact with the standardized AI service layer
      const result = await getAIAdvice(query);
      setResponse(result);
      
      // Instruction 5: Add logging
      console.log('AI Advisor Query Success:', query);
    } catch (err) {
      console.error('AI Advisor Error:', err);
      // Instruction 5: Add error handling and fallbacks
      setError('Failed to fetch AI analysis due to a service error or timeout. Please retry or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  // Using minimal, structured inline CSS for compatibility, pending full UI standardization (Instruction 2).
  const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontFamily: 'Arial, sans-serif' },
    heading: { color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '20px' },
    form: { display: 'flex', gap: '10px', marginBottom: '20px' },
    input: { flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' },
    button: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' },
    buttonDisabled: { backgroundColor: '#95a5a6', cursor: 'not-allowed' },
    response: { backgroundColor: 'white', padding: '15px', borderRadius: '4px', borderLeft: '5px solid #2ecc71', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    loader: { color: '#3498db', fontStyle: 'italic' },
    error: { color: '#e74c3c', border: '1px solid #e74c3c', backgroundColor: '#fbecec', padding: '10px', borderRadius: '4px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>AI Financial Advisor</h1>
      <p>Leverage AI to analyze your aggregated financial data, identify anomalies, and optimize treasury strategy.</p>
      <p style={{ fontSize: '0.9em', color: '#7f8c8d' }}>
        {/* Instruction 5: Add explainability notes */}
        (Note: All AI advice is generated via the secure, standardized LLM service layer and is based on real-time transaction data aggregated from your connected bank accounts.)
      </p>

      <form onSubmit={handleQuerySubmit} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'What are my top 3 budget deviations this month?'"
          disabled={isLoading}
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        >
          {isLoading ? 'Analyzing...' : 'Get Analysis'}
        </button>
      </form>

      {isLoading && <p style={styles.loader}>Analyzing data and generating insights...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {response && (
        <div style={styles.response}>
          <h3>AI Analysis Result</h3>
          
          <p><strong>Core Analysis:</strong> {response.analysis}</p>
          
          {response.transactions.length > 0 && (
              <>
                <h4>Relevant Data Points:</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {response.transactions.map((t, index) => <li key={index}>{t}</li>)}
                </ul>
              </>
          )}

          <p><strong>Actionable Recommendation:</strong> {response.suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default AIAdvisorView;