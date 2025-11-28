import React, { useState, useCallback } from 'react';
import {
  Panel,
  Input,
  Toggle,
  Button,
  FlexboxGrid,
  Whisper,
  Tooltip,
  Message,
  IconButton,
  ButtonGroup,
} from 'rsuite';
import { Icon as RCIcon } from 'rsuite';
import HelpCircleIcon from '@rsuite/icons/HelpCircle';
import SaveIcon from '@rsuite/icons/Save';
import TrashIcon from '@rsuite/icons/Trash';

// Define the structure for card controls state
interface CardControlsState {
  dailyLimit: number;
  monthlyLimit: number;
  internationalUseEnabled: boolean;
  onlineTransactionsEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  specificMerchantsAllowed: string; // Comma-separated list of merchant IDs/names
  blockedCategories: string; // Comma-separated list of MCCs
}

const initialControls: CardControlsState = {
  dailyLimit: 5000,
  monthlyLimit: 20000,
  internationalUseEnabled: true,
  onlineTransactionsEnabled: true,
  atmWithdrawalsEnabled: false,
  specificMerchantsAllowed: 'AMZ,SQF,TGT',
  blockedCategories: '4814,5812', // Example MCCs: Telecom, Restaurants
};

interface CorporateCardControlsPanelProps {
  cardId: string;
  initialSettings?: CardControlsState;
  onSave: (cardId: string, settings: CardControlsState) => void;
  onReset: (cardId: string) => void;
}

const CorporateCardControlsPanel: React.FC<CorporateCardControlsPanelProps> = ({
  cardId,
  initialSettings = initialControls,
  onSave,
  onReset,
}) => {
  const [controls, setControls] = useState<CardControlsState>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (name: keyof CardControlsState, value: any) => {
      setControls((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Saving settings for Card ${cardId}:`, controls);
      onSave(cardId, controls);
      setIsSaving(false);
      Message.success({
        content: `Settings for Card ${cardId} saved successfully.`,
        duration: 3000,
      });
    }, 500);
  };

  const handleReset = () => {
    setControls(initialControls);
    onReset(cardId);
    Message.info({
      content: `Settings for Card ${cardId} reset to default.`,
      duration: 3000,
    });
  };

  const renderLimitInput = (label: string, name: keyof CardControlsState, suffix: string = '$') => (
    <FlexboxGrid.Item colspan={12} style={{ padding: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
        {label}
      </label>
      <Input
        type="number"
        min={0}
        step={100}
        value={controls[name] as number}
        onChange={(value) => handleChange(name, Number(value))}
        addonAfter={suffix}
        style={{ width: '100%' }}
      />
    </FlexboxGrid.Item>
  );

  const renderToggle = (label: string, name: keyof CardControlsState, description: string) => (
    <FlexboxGrid.Item colspan={12} style={{ padding: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
        <div style={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{label}</span>
          <Whisper placement="top" trigger="hover" control={<HelpCircleIcon style={{ color: '#666', marginLeft: '5px', cursor: 'pointer' }} />} speaker={<Tooltip>{description}</Tooltip>}>
            <HelpCircleIcon style={{ color: '#1675e6', cursor: 'pointer', fontSize: '16px' }} />
          </Whisper>
        </div>
        <Toggle
          checked={controls[name] as boolean}
          onChange={(checked) => handleChange(name, checked)}
          size="lg"
        />
      </div>
    </FlexboxGrid.Item>
  );

  const renderTextArea = (label: string, name: keyof CardControlsState, description: string) => (
    <FlexboxGrid.Item colspan={24} style={{ padding: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
        {label}
      </label>
      <Whisper placement="top" trigger="hover" control={<HelpCircleIcon style={{ color: '#666', marginLeft: '5px', cursor: 'pointer' }} />} speaker={<Tooltip>{description}</Tooltip>}>
        <HelpCircleIcon style={{ color: '#1675e6', cursor: 'pointer', fontSize: '16px', float: 'right', marginTop: '-25px', position: 'relative', zIndex: 10 }} />
      </Whisper>
      <Input
        as="textarea"
        rows={3}
        value={controls[name] as string}
        onChange={(value) => handleChange(name, value)}
        placeholder={`Enter comma-separated values (e.g., MerchantID1, MerchantID2)`}
      />
    </FlexboxGrid.Item>
  );


  return (
    <Panel 
      header={<h3>Card Configuration Panel: {cardId}</h3>}
      bordered
      style={{ marginBottom: '20px' }}
      bodyFill
    >
      <FlexboxGrid style={{ padding: '15px' }}>

        {/* Spending Limits Section */}
        <FlexboxGrid.Item colspan={24} style={{ paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
            <h4>Transaction Limits</h4>
        </FlexboxGrid.Item>

        {renderLimitInput('Daily Spending Limit', 'dailyLimit')}
        {renderLimitInput('Monthly Spending Limit', 'monthlyLimit')}

        {/* Transaction Type Controls */}
        <FlexboxGrid.Item colspan={24} style={{ paddingTop: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
            <h4>Transaction Access Controls</h4>
        </FlexboxGrid.Item>

        {renderToggle(
          'International Use',
          'internationalUseEnabled',
          'Allow card transactions outside the primary operating country.'
        )}
        {renderToggle(
          'Online Transactions',
          'onlineTransactionsEnabled',
          'Allow card usage for e-commerce and online payments.'
        )}
        {renderToggle(
          'ATM Cash Withdrawals',
          'atmWithdrawalsEnabled',
          'Allow this card to be used for cash withdrawal at ATMs (usually restricted).'
        )}
        
        {/* Category/Merchant Rules */}
        <FlexboxGrid.Item colspan={24} style={{ paddingTop: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
            <h4>Merchant Rules & Blocking</h4>
        </FlexboxGrid.Item>

        {renderTextArea(
            'Approved Merchants (Whitelist)',
            'specificMerchantsAllowed',
            'Enter a comma-separated list of Merchant IDs or recognized names that are ALWAYS allowed, regardless of category blocks.'
        )}

        {renderTextArea(
            'Blocked MCC Categories (Blacklist)',
            'blockedCategories',
            'Enter a comma-separated list of Merchant Category Codes (MCCs) that are strictly forbidden for this card (e.g., Gambling, Tobacco).'
        )}

        {/* Actions Footer */}
        <FlexboxGrid.Item colspan={24} style={{ paddingTop: '20px', textAlign: 'right' }}>
          <ButtonGroup>
            <Button 
              appearance="ghost" 
              onClick={handleReset} 
              startIcon={<RCIcon icon={TrashIcon} />}
            >
              Reset Defaults
            </Button>
            <Button 
              appearance="primary" 
              onClick={handleSave} 
              loading={isSaving}
              startIcon={<RCIcon icon={SaveIcon} />}
            >
              {isSaving ? 'Saving...' : 'Save Controls'}
            </Button>
          </ButtonGroup>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Panel>
  );
};

export default CorporateCardControlsPanel;
