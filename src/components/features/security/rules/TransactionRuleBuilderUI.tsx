import React, { useState, useCallback } from 'react';

// Define types for clarity
interface Condition {
  id: string; // Unique ID for keying in lists
  field: string;
  operator: string;
  value: string; // Storing as string for simplicity; would parse based on field/operator
  logicalOperator: 'AND' | 'OR'; // To combine this condition with the *next* condition
}

interface Rule {
  name: string;
  description: string;
  triggerEvent: string;
  conditions: Condition[];
  action: string;
  isEnabled: boolean;
}

const initialCondition: Condition = {
  id: String(Date.now()), // Simple unique ID for list rendering
  field: '',
  operator: '',
  value: '',
  logicalOperator: 'AND',
};

const initialRuleState: Rule = {
  name: '',
  description: '',
  triggerEvent: '',
  conditions: [{ ...initialCondition }],
  action: '',
  isEnabled: true,
};

const TransactionRuleBuilderUI: React.FC = () => {
  const [rule, setRule] = useState<Rule>(initialRuleState);

  // Options for dropdowns
  const triggerEventOptions = [
    { value: '', label: 'Select Event' },
    { value: 'TRANSACTION_ATTEMPT', label: 'Any Transaction Attempt' },
    { value: 'WITHDRAWAL_REQUEST', label: 'Withdrawal Request' },
    { value: 'DEPOSIT_INITIATED', label: 'Deposit Initiated' },
    { value: 'PURCHASE', label: 'Purchase' },
    { value: 'TRANSFER_OUT', label: 'Transfer Out' },
  ];

  const fieldOptions = [
    { value: '', label: 'Select Field' },
    { value: 'amount', label: 'Transaction Amount' },
    { value: 'currency', label: 'Currency' },
    { value: 'locationCountry', label: 'Location (Country)' },
    { value: 'locationCity', label: 'Location (City)' },
    { value: 'ipAddress', label: 'IP Address' },
    { value: 'merchantCategory', label: 'Merchant Category' },
    { value: 'transactionType', label: 'Transaction Type' },
    { value: 'timeOfDay', label: 'Time of Day (HH:MM)' },
    { value: 'deviceType', label: 'Device Type' },
    { value: 'cardPresent', label: 'Card Present' },
  ];

  const operatorOptions = {
    // General operators applicable to most types
    DEFAULT: [
      { value: '', label: 'Select Operator' },
      { value: 'EQ', label: 'Equals' },
      { value: 'NEQ', label: 'Does Not Equal' },
    ],
    // Numeric specific operators
    NUMERIC: [
      { value: 'GT', label: 'Greater Than' },
      { value: 'LT', label: 'Less Than' },
      { value: 'GTE', label: 'Greater Than Or Equal To' },
      { value: 'LTE', label: 'Less Than Or Equal To' },
    ],
    // String specific operators
    STRING: [
      { value: 'CONTAINS', label: 'Contains' },
      { value: 'NOT_CONTAINS', label: 'Does Not Contain' },
      { value: 'STARTS_WITH', label: 'Starts With' },
      { value: 'ENDS_WITH', label: 'Ends With' },
    ],
    // List/Categorical operators
    LIST: [
      { value: 'IN', label: 'Is one of' },
      { value: 'NOT_IN', label: 'Is not one of' },
    ],
    // Boolean operators
    BOOLEAN: [
      { value: 'IS_TRUE', label: 'Is True' },
      { value: 'IS_FALSE', label: 'Is False' },
    ],
  };

  const getOperatorsForField = useCallback((field: string) => {
    let ops = [...operatorOptions.DEFAULT];
    switch (field) {
      case 'amount':
      case 'timeOfDay':
        ops = [...ops, ...operatorOptions.NUMERIC];
        break;
      case 'merchantCategory':
      case 'transactionType':
      case 'currency':
      case 'locationCountry':
      case 'deviceType':
        ops = [...ops, ...operatorOptions.LIST];
        break;
      case 'locationCity':
      case 'ipAddress':
        ops = [...ops, ...operatorOptions.STRING];
        break;
      case 'cardPresent':
        ops = [...operatorOptions.BOOLEAN]; // Overwrite default for boolean
        break;
      default:
        break;
    }
    return ops;
  }, [operatorOptions]);

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'BLOCK_TRANSACTION', label: 'Block Transaction' },
    { value: 'FLAG_FOR_REVIEW', label: 'Flag for Manual Review' },
    { value: 'SEND_ALERT', label: 'Send Alert (Email/SMS)' },
    { value: 'REQUIRE_2FA', label: 'Require Additional Verification (2FA)' },
  ];

  const handleRuleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'isEnabled') {
      setRule((prev) => ({ ...prev, isEnabled: (e.target as HTMLInputElement).checked }));
    } else {
      setRule((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleConditionChange = useCallback((index: number, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setRule((prev) => {
      const newConditions = [...prev.conditions];
      newConditions[index] = { ...newConditions[index], [name]: value };
      return { ...prev, conditions: newConditions };
    });
  }, []);

  const addCondition = useCallback(() => {
    setRule((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { ...initialCondition, id: String(Date.now()) }],
    }));
  }, []);

  const removeCondition = useCallback((index: number) => {
    setRule((prev) => {
      const newConditions = prev.conditions.filter((_, i) => i !== index);
      // Ensure there's always at least one condition field
      if (newConditions.length === 0) {
        return { ...prev, conditions: [{ ...initialCondition, id: String(Date.now()) }] };
      }
      return { ...prev, conditions: newConditions };
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Rule:', JSON.stringify(rule, null, 2));
    // In a real application, you'd send this to an API
    alert('Rule saved (check console for details)!');
    // Optionally reset form
    setRule(initialRuleState);
  };

  const renderConditionValueInput = useCallback((condition: Condition, index: number) => {
    let placeholder = 'Enter value';
    let inputType: React.HTMLInputTypeAttribute = 'text';

    switch (condition.field) {
      case 'amount':
        inputType = 'number';
        placeholder = 'e.g., 100.00';
        break;
      case 'timeOfDay':
        inputType = 'time';
        placeholder = 'e.g., 14:30';
        break;
      case 'merchantCategory':
      case 'transactionType':
      case 'currency':
      case 'locationCountry':
      case 'deviceType':
        placeholder = 'Comma-separated values (e.g., Gambling, Adult)';
        break;
      case 'ipAddress':
        placeholder = 'IP address or CIDR (e.g., 192.168.1.1/24)';
        break;
      case 'cardPresent':
        // For boolean fields, the operator itself might imply the value (IS_TRUE/IS_FALSE)
        // If an explicit value is needed (e.g., 'Yes'/'No'), this input would be a dropdown
        // For now, it can be hidden or set to a default.
        return null;
      default:
        break;
    }

    if (operatorOptions.BOOLEAN.some(op => op.value === condition.operator)) {
        return null; // Value is implied by operator for boolean fields
    }

    return (
      <input
        type={inputType}
        name="value"
        value={condition.value}
        onChange={(e) => handleConditionChange(index, e)}
        placeholder={placeholder}
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        required={!operatorOptions.BOOLEAN.some(op => op.value === condition.operator)} // Required unless boolean operator
      />
    );
  }, [handleConditionChange, operatorOptions]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Transaction Security Rule</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule Basic Info */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Rule Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Rule Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={rule.name}
                onChange={handleRuleChange}
                placeholder="e.g., High-Value International Withdrawal Block"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="triggerEvent" className="block text-sm font-medium text-gray-700">Trigger Event</label>
              <select
                id="triggerEvent"
                name="triggerEvent"
                value={rule.triggerEvent}
                onChange={handleRuleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                {triggerEventOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={rule.description}
              onChange={handleRuleChange}
              rows={3}
              placeholder="Provide a brief description of what this rule does."
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Rule Conditions */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Conditions</h2>
          {rule.conditions.map((condition, index) => (
            <div key={condition.id} className="relative mb-4 p-3 border border-gray-200 rounded-md bg-white">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label htmlFor={`field-${condition.id}`} className="sr-only">Field</label>
                  <select
                    id={`field-${condition.id}`}
                    name="field"
                    value={condition.field}
                    onChange={(e) => handleConditionChange(index, e)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    {fieldOptions.map((option) => (
                      <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label htmlFor={`operator-${condition.id}`} className="sr-only">Operator</label>
                  <select
                    id={`operator-${condition.id}`}
                    name="operator"
                    value={condition.operator}
                    onChange={(e) => handleConditionChange(index, e)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    {getOperatorsForField(condition.field).map((option) => (
                      <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                    ))}
                  </select>
                </div>
                {renderConditionValueInput(condition, index) && (
                  <div className="flex-2 min-w-[200px]">
                    <label htmlFor={`value-${condition.id}`} className="sr-only">Value</label>
                    {renderConditionValueInput(condition, index)}
                  </div>
                )}
                {rule.conditions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="flex-shrink-0 p-2 text-red-600 hover:text-red-800"
                    title="Remove Condition"
                  >
                    &#10005;
                  </button>
                )}
              </div>
              {index < rule.conditions.length - 1 && (
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  <label htmlFor={`logical-operator-${condition.id}`} className="sr-only">Logical Operator</label>
                  <select
                    id={`logical-operator-${condition.id}`}
                    name="logicalOperator"
                    value={condition.logicalOperator}
                    onChange={(e) => handleConditionChange(index, e)}
                    className="bg-transparent border-none focus:ring-0 text-gray-700"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCondition}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Condition
          </button>
        </div>

        {/* Rule Action */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Action to Take</h2>
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700">When conditions are met:</label>
            <select
              id="action"
              name="action"
              value={rule.action}
              onChange={handleRuleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isEnabled"
              name="isEnabled"
              checked={rule.isEnabled}
              onChange={handleRuleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isEnabled" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
              Enable Rule Immediately
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => setRule(initialRuleState)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save Rule
          </button>
        </div>
      </form>

      {/* Optional: Rule Preview / Debug
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Current Rule State</h2>
        <pre className="text-sm overflow-auto">{JSON.stringify(rule, null, 2)}</pre>
      </div>
      */}
    </div>
  );
};

export default TransactionRuleBuilderUI;