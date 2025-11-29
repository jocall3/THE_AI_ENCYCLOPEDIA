import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions ---
interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimalPlaces: number; // Added for precision
}

interface Balance {
  currencyCode: string;
  amount: number;
  lastUpdated: string; // Added for tracking
}

interface Transaction {
  id: string;
  type: 'exchange' | 'deposit' | 'withdraw' | 'transfer' | 'fee';
  timestamp: string;
  currencyCode: string;
  amount: number;
  fromCurrency?: string; // For exchanges
  toCurrency?: string;   // For exchanges
  exchangeRate?: number; // For exchanges
  status: 'completed' | 'pending' | 'failed';
  description: string;
  fee?: number;
}

interface ExchangeRateData {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}

interface Budget {
  id: string;
  currencyCode: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'daily';
  category: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface UserProfile {
  email: string;
  fullName: string;
  preferredCurrency: string;
  securityLevel: 'basic' | '2fa_enabled' | 'biometric_enabled';
  aiPersonalizationEnabled: boolean;
  notificationPreferences: {
    exchangeAlerts: boolean;
    fraudAlerts: boolean;
    budgetAlerts: boolean;
  };
}

// --- Mock Data & Constants ---
const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: 'ðŸ‡ºðŸ‡¸', decimalPlaces: 2 },
  { code: 'EUR', name: 'Euro', symbol: 'â‚¬', flag: 'ðŸ‡ªðŸ‡º', decimalPlaces: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: 'Â¥', flag: 'ðŸ‡¯ðŸ‡µ', decimalPlaces: 0 },
  { code: 'GBP', name: 'British Pound', symbol: 'Â£', flag: 'ðŸ‡¬ðŸ‡§', decimalPlaces: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'ðŸ‡¦ðŸ‡º', decimalPlaces: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'ðŸ‡¨ðŸ‡¦', decimalPlaces: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: 'ðŸ‡¨ðŸ‡­', decimalPlaces: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: 'Â¥', flag: 'ðŸ‡¨ðŸ‡³', decimalPlaces: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: 'â‚¹', flag: 'ðŸ‡®ðŸ‡³', decimalPlaces: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: 'ðŸ‡§ðŸ‡·', decimalPlaces: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: 'ðŸ‡¿ðŸ‡¦', decimalPlaces: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'ðŸ‡¸ðŸ‡¬', decimalPlaces: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: 'ðŸ‡³ðŸ‡¿', decimalPlaces: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: 'ðŸ‡²ðŸ‡½', decimalPlaces: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: 'ðŸ‡¸ðŸ‡ª', decimalPlaces: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: 'ðŸ‡³ðŸ‡´', decimalPlaces: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: 'ðŸ‡©ðŸ‡°', decimalPlaces: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zÅ‚', flag: 'ðŸ‡µðŸ‡±', decimalPlaces: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: 'ðŸ‡­ðŸ‡º', decimalPlaces: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'KÄ ', flag: 'ðŸ‡¨ðŸ‡¿', decimalPlaces: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: 'â‚½', flag: 'ðŸ‡·ðŸ‡º', decimalPlaces: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: 'â‚º', flag: 'ðŸ‡¹ðŸ‡·', decimalPlaces: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: 'â‚©', flag: 'ðŸ‡°ðŸ‡·', decimalPlaces: 0 },
  { code: 'THB', name: 'Thai Baht', symbol: 'à¸¿', flag: 'ðŸ‡¹ðŸ‡­', decimalPlaces: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: 'ðŸ‡®ðŸ‡©', decimalPlaces: 0 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: 'ðŸ‡²ðŸ‡¾', decimalPlaces: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: 'â‚±', flag: 'ðŸ‡µðŸ‡­', decimalPlaces: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: 'ðŸ‡­ðŸ‡°', decimalPlaces: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'ðŸ‡¸ðŸ‡¬', decimalPlaces: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: 'ðŸ‡¸ðŸ‡¦', decimalPlaces: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: 'ðŸ‡¦ðŸ‡ª', decimalPlaces: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'EÂ£', flag: 'ðŸ‡ªðŸ‡¬', decimalPlaces: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: 'â‚¦', flag: 'ðŸ‡³ðŸ‡¬', decimalPlaces: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: 'ðŸ‡°ðŸ‡ª', decimalPlaces: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GHâ‚µ', flag: 'ðŸ‡¬ðŸ‡­', decimalPlaces: 2 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', flag: 'ðŸ‡¨ðŸ‡±', decimalPlaces: 0 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', flag: 'ðŸ‡¨ðŸ‡´', decimalPlaces: 0 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: 'ðŸ‡µðŸ‡ª', decimalPlaces: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS$', flag: 'ðŸ‡¦ðŸ‡·', decimalPlaces: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: 'â‚«', flag: 'ðŸ‡»ðŸ‡³', decimalPlaces: 0 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'â‚¨', flag: 'ðŸ‡µðŸ‡°', decimalPlaces: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: 'à§³', flag: 'ðŸ‡§ðŸ‡©', decimalPlaces: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: 'ðŸ‡±ðŸ‡°', decimalPlaces: 2 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'à¤°à¥‚', flag: 'ðŸ‡³ðŸ‡µ', decimalPlaces: 2 },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', flag: 'ðŸ‡²ðŸ‡²', decimalPlaces: 0 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: 'â‚¸', flag: 'ðŸ‡°ðŸ‡¿', decimalPlaces: 2 },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'Ñ ÑƒÐ¼', flag: 'ðŸ‡ºðŸ‡¿', decimalPlaces: 2 },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: 'â‚¼', flag: 'ðŸ‡¦ðŸ‡¿', decimalPlaces: 2 },
  { code: 'GEL', name: 'Georgian Lari', symbol: 'â‚¾', flag: 'ðŸ‡¬ðŸ‡ª', decimalPlaces: 2 },
  { code: 'AMD', name: 'Armenian Dram', symbol: 'Ö ', flag: 'ðŸ‡¦ðŸ‡²', decimalPlaces: 2 },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', flag: 'ðŸ‡§ðŸ‡¾', decimalPlaces: 2 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: 'â‚´', flag: 'ðŸ‡ºðŸ‡¦', decimalPlaces: 2 },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', flag: 'ðŸ‡²ðŸ‡©', decimalPlaces: 2 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: 'ðŸ‡·ðŸ‡´', decimalPlaces: 2 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'Ð»Ð²', flag: 'ðŸ‡§ðŸ‡¬', decimalPlaces: 2 },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', flag: 'ðŸ‡­ðŸ‡·', decimalPlaces: 2 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'Ð´Ð¸Ð½', flag: 'ðŸ‡·ðŸ‡¸', decimalPlaces: 2 },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'Ð´ÐµÐ½', flag: 'ðŸ‡²ðŸ‡°', decimalPlaces: 2 },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM', flag: 'ðŸ‡§ðŸ‡¦', decimalPlaces: 2 },
  { code: 'ISK', name: 'Icelandic KrÃ³na', symbol: 'kr', flag: 'ðŸ‡®ðŸ‡¸', decimalPlaces: 0 },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA', flag: 'ðŸ‡©ðŸ‡¿', decimalPlaces: 2 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', flag: 'ðŸ‡²ðŸ‡¦', decimalPlaces: 2 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', flag: 'ðŸ‡¹ðŸ‡³', decimalPlaces: 3 },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD', flag: 'ðŸ‡±ðŸ‡¾', decimalPlaces: 3 },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'SDG', flag: 'ðŸ‡¸ðŸ‡©', decimalPlaces: 2 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: 'ðŸ‡ªðŸ‡¹', decimalPlaces: 2 },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', flag: 'ðŸ‡¬ðŸ‡²', decimalPlaces: 2 },
  { code: 'XOF', name: 'CFA Franc BCEAO', symbol: 'CFA', flag: 'ðŸ‡§ðŸ‡¯', decimalPlaces: 0 }, // Example for multi-country currency
  { code: 'XAF', name: 'CFA Franc BEAC', symbol: 'CFA', flag: 'ðŸ‡¨ðŸ‡²', decimalPlaces: 0 },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', flag: 'ðŸ‡¨ðŸ‡©', decimalPlaces: 2 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: 'ðŸ‡ºðŸ‡¬', decimalPlaces: 0 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: 'ðŸ‡¹ðŸ‡¿', decimalPlaces: 0 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', flag: 'ðŸ‡·ðŸ‡¼', decimalPlaces: 0 },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', flag: 'ðŸ‡§ðŸ‡®', decimalPlaces: 0 },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', flag: 'ðŸ‡²ðŸ‡¼', decimalPlaces: 2 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', flag: 'ðŸ‡¿ðŸ‡²', decimalPlaces: 2 },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', flag: 'ðŸ‡²ðŸ‡¿', decimalPlaces: 2 },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', flag: 'ðŸ‡¦ðŸ‡´', decimalPlaces: 2 },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', flag: 'ðŸ‡³ðŸ‡¦', decimalPlaces: 2 },
  { code: 'BWP', name: 'Botswanan Pula', symbol: 'P', flag: 'ðŸ‡§ðŸ‡¼', decimalPlaces: 2 },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', flag: 'ðŸ‡±ðŸ‡¸', decimalPlaces: 2 },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'E', flag: 'ðŸ‡¸ðŸ‡¿', decimalPlaces: 2 },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'SR', flag: 'ðŸ‡¸ðŸ‡¨', decimalPlaces: 2 },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', flag: 'ðŸ‡²ðŸ‡»', decimalPlaces: 2 },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: 'â‚¨', flag: 'ðŸ‡²ðŸ‡º', decimalPlaces: 2 },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', flag: 'ðŸ‡°ðŸ‡²', decimalPlaces: 0 },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', flag: 'ðŸ‡©ðŸ‡¯', decimalPlaces: 0 },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', flag: 'ðŸ‡ªðŸ‡·', decimalPlaces: 2 },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh.So.', flag: 'ðŸ‡¸ðŸ‡´', decimalPlaces: 2 },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: 'Â£', flag: 'ðŸ‡¸ðŸ‡¸', decimalPlaces: 2 },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', flag: 'ðŸ‡²ðŸ‡·', decimalPlaces: 2 },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: 'Esc', flag: 'ðŸ‡¨ðŸ‡»', decimalPlaces: 2 },
  { code: 'STD', name: 'SÃ£o TomÃ© and PrÃ­ncipe Dobra', symbol: 'Db', flag: 'ðŸ‡¸ðŸ‡¹', decimalPlaces: 2 },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', flag: 'ðŸ‡¬ðŸ‡³', decimalPlaces: 0 },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', flag: 'ðŸ‡¸ðŸ‡±', decimalPlaces: 2 },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', flag: 'ðŸ‡±ðŸ‡·', decimalPlaces: 2 },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', flag: 'ðŸ‡¬ðŸ‡²', decimalPlaces: 2 },
  { code: 'XAF', name: 'Central African CFA franc', symbol: 'FCFA', flag: 'ðŸ‡¨ðŸ‡«', decimalPlaces: 0 },
  { code: 'XOF', name: 'West African CFA franc', symbol: 'CFA', flag: 'ðŸ‡§ðŸ‡¯', decimalPlaces: 0 },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', flag: 'ðŸ‡­ðŸ‡¹', decimalPlaces: 2 },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', flag: 'ðŸ‡©ðŸ‡´', decimalPlaces: 2 },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', flag: 'ðŸ‡¯ðŸ‡²', decimalPlaces: 2 },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$', flag: 'ðŸ‡¹ðŸ‡¹', decimalPlaces: 2 },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', flag: 'ðŸ‡§ðŸ‡§', decimalPlaces: 2 },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$', flag: 'ðŸ‡¦ðŸ‡¬', decimalPlaces: 2 },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$', flag: 'ðŸ‡§ðŸ‡¸', decimalPlaces: 2 },
  { code: 'CUP', name: 'Cuban Peso', symbol: 'â‚±', flag: 'ðŸ‡¨ðŸ‡º', decimalPlaces: 2 },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', flag: 'ðŸ‡¸ðŸ‡·', decimalPlaces: 2 },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$', flag: 'ðŸ‡¬ðŸ‡¾', decimalPlaces: 2 },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: 'â‚²', flag: 'ðŸ‡µðŸ‡¾', decimalPlaces: 0 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: 'ðŸ‡ºðŸ‡¾', decimalPlaces: 2 },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', flag: 'ðŸ‡§ðŸ‡´', decimalPlaces: 2 },
  { code: 'VES', name: 'Venezuelan BolÃ­var', symbol: 'Bs.S', flag: 'ðŸ‡»ðŸ‡ª', decimalPlaces: 2 },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', flag: 'ðŸ‡µðŸ‡¬', decimalPlaces: 2 },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$', flag: 'ðŸ‡¸ðŸ‡§', decimalPlaces: 2 },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'Vt', flag: 'ðŸ‡»ðŸ‡º', decimalPlaces: 0 },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', flag: 'ðŸ‡«ðŸ‡¯', decimalPlaces: 2 },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WS$', flag: 'ðŸ‡¼ðŸ‡¸', decimalPlaces: 2 },
  { code: 'TOP', name: 'Tongan PaÊ»anga', symbol: 'T$', flag: 'ðŸ‡¹ðŸ‡´', decimalPlaces: 2 },
  { code: 'KPW', name: 'North Korean Won', symbol: 'â‚©', flag: 'ðŸ‡°ðŸ‡µ', decimalPlaces: 2 },
  { code: 'MNT', name: 'Mongolian TÃ¶grÃ¶g', symbol: 'â‚®', flag: 'ðŸ‡²ðŸ‡³', decimalPlaces: 2 },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'Ñ ', flag: 'ðŸ‡°ðŸ‡¬', decimalPlaces: 2 },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM', flag: 'ðŸ‡¹ðŸ‡¯', decimalPlaces: 2 },
  { code: 'AFN', name: 'Afghan Afghani', symbol: 'Ø‹', flag: 'ðŸ‡¦ðŸ‡«', decimalPlaces: 2 },
  { code: 'IRR', name: 'Iranian Rial', symbol: 'ï·¼', flag: 'ðŸ‡®ðŸ‡·', decimalPlaces: 2 },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'Ø¹.Ø¯', flag: 'ðŸ‡®ðŸ‡¶', decimalPlaces: 3 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'Ø¯.Ùƒ', flag: 'ðŸ‡°ðŸ‡¼', decimalPlaces: 3 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.Ø¯.Ø¨', flag: 'ðŸ‡§ðŸ‡­', decimalPlaces: 3 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'Ø±.Ø¹.', flag: 'ðŸ‡´ðŸ‡²', decimalPlaces: 3 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'Ø±.Ù‚', flag: 'ðŸ‡¶ðŸ‡¦', decimalPlaces: 2 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'Ø¯.Ø§', flag: 'ðŸ‡¯ðŸ‡´', decimalPlaces: 3 },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'Ù„.Ù„', flag: 'ðŸ‡±ðŸ‡§', decimalPlaces: 2 },
  { code: 'SYP', name: 'Syrian Pound', symbol: 'Ù„.Ø³', flag: 'ðŸ‡¸ðŸ‡¾', decimalPlaces: 2 },
  { code: 'YER', name: 'Yemeni Rial', symbol: 'ï·¼', flag: 'ðŸ‡¾ðŸ‡ª', decimalPlaces: 2 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: 'â‚ª', flag: 'ðŸ‡®ðŸ‡±', decimalPlaces: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GHâ‚µ', flag: 'ðŸ‡¬ðŸ‡­', decimalPlaces: 2 },
  { code: 'XPF', name: 'CFP Franc', symbol: 'â‚£', flag: 'ðŸ‡µðŸ‡«', decimalPlaces: 0 },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'Æ’', flag: 'ðŸ‡¨ðŸ‡¼', decimalPlaces: 2 },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'Æ’', flag: 'ðŸ‡¦ðŸ‡¼', decimalPlaces: 2 },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', flag: 'ðŸ‡§ðŸ‡¿', decimalPlaces: 2 },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$', flag: 'ðŸ‡°ðŸ‡¾', decimalPlaces: 2 },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: 'Â£', flag: 'ðŸ‡«ðŸ‡°', decimalPlaces: 2 },
  { code: 'GIP', name: 'Gibraltar Pound', symbol: 'Â£', flag: 'ðŸ‡¬ðŸ‡®', decimalPlaces: 2 },
  { code: 'IMP', name: 'Isle of Man Pound', symbol: 'Â£', flag: 'ðŸ‡®ðŸ‡²', decimalPlaces: 2 },
  { code: 'JEP', name: 'Jersey Pound', symbol: 'Â£', flag: 'ðŸ‡¯ðŸ‡ª', decimalPlaces: 2 },
  { code: 'LAK', name: 'Lao Kip', symbol: 'â‚­', flag: 'ðŸ‡±ðŸ‡¦', decimalPlaces: 0 },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', flag: 'ðŸ‡²ðŸ‡´', decimalPlaces: 2 },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', flag: 'ðŸ‡³ðŸ‡¦', decimalPlaces: 2 },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', flag: 'ðŸ‡µðŸ‡¦', decimalPlaces: 2 },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: 'Â£', flag: 'ðŸ‡¸ðŸ‡¸', decimalPlaces: 2 },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', flag: 'ðŸ‡¸ðŸ‡·', decimalPlaces: 2 },
  { code: 'TVD', name: 'Tuvaluan Dollar', symbol: '$', flag: 'ðŸ‡¹ðŸ‡»', decimalPlaces: 2 },
  { code: 'XDR', name: 'Special Drawing Rights', symbol: 'SDR', flag: 'ðŸŒ ', decimalPlaces: 4 }, // IMF currency
];


const getCurrencyDetails = (code: string): Currency | undefined =>
  SUPPORTED_CURRENCIES.find(c => c.code === code);

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);
const getCurrentTimestamp = () => new Date().toISOString();

// --- Main Component ---
const MultiCurrencyWallet: React.FC = () => {
  // --- Core Wallet State ---
  const [balances, setBalances] = useState<Balance[]>([
    { currencyCode: 'USD', amount: 1500.75, lastUpdated: getCurrentTimestamp() },
    { currencyCode: 'EUR', amount: 800.50, lastUpdated: getCurrentTimestamp() },
    { currencyCode: 'GBP', amount: 250.00, lastUpdated: getCurrentTimestamp() },
    { currencyCode: 'JPY', amount: 120000.00, lastUpdated: getCurrentTimestamp() },
    { currencyCode: 'CAD', amount: 500.00, lastUpdated: getCurrentTimestamp() },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: generateUniqueId(), type: 'deposit', timestamp: '2023-10-26T10:00:00Z', currencyCode: 'USD', amount: 1000, status: 'completed', description: 'Initial deposit' },
    { id: generateUniqueId(), type: 'exchange', timestamp: '2023-10-26T10:30:00Z', currencyCode: 'EUR', amount: 100, fromCurrency: 'USD', toCurrency: 'EUR', exchangeRate: 0.92, status: 'completed', description: 'USD to EUR exchange' },
    { id: generateUniqueId(), type: 'withdraw', timestamp: '2023-10-27T11:00:00Z', currencyCode: 'GBP', amount: 50, status: 'completed', description: 'ATM withdrawal' },
    { id: generateUniqueId(), type: 'transfer', timestamp: '2023-10-28T14:00:00Z', currencyCode: 'USD', amount: -200, status: 'completed', description: 'Transfer to merchant X' },
    { id: generateUniqueId(), type: 'exchange', timestamp: '2023-10-29T09:00:00Z', currencyCode: 'JPY', amount: 10000, fromCurrency: 'USD', toCurrency: 'JPY', exchangeRate: 149.5, status: 'completed', description: 'USD to JPY exchange' },
  ]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: 'user.financial.manager@example.com',
    fullName: 'Financial Integrity User',
    preferredCurrency: 'USD',
    securityLevel: '2fa_enabled',
    aiPersonalizationEnabled: true,
    notificationPreferences: {
      exchangeAlerts: true,
      fraudAlerts: true,
      budgetAlerts: true,
    },
  });
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: generateUniqueId(), currencyCode: 'USD', limit: 500, spent: 150, period: 'monthly', category: 'Shopping', isActive: true },
    { id: generateUniqueId(), currencyCode: 'EUR', limit: 300, spent: 80, period: 'weekly', category: 'Travel', isActive: true },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: generateUniqueId(), type: 'info', message: 'Welcome to your enhanced Multi-Currency Wallet!', timestamp: '2023-10-25T09:00:00Z', isRead: false },
    { id: generateUniqueId(), type: 'alert', message: 'Exchange rate for USD/EUR is favorable!', timestamp: '2023-10-29T15:00:00Z', isRead: false },
    { id: generateUniqueId(), type: 'warning', message: 'Your USD budget for Shopping is 70% utilized.', timestamp: '2023-10-30T10:00:00Z', isRead: false },
  ]);

  // --- UI State Management ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exchange' | 'history' | 'analytics' | 'budgeting' | 'security' | 'ai_assistant' | 'settings'>('dashboard');
  const [isExchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [isAddCurrencyModalOpen, setAddCurrencyModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isBudgetModalOpen, setBudgetModalOpen] = useState(false);
  const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [isAIAssistantModalOpen, setAIAssistantModalOpen] = useState(false);
  const [isSecuritySettingsModalOpen, setSecuritySettingsModalOpen] = useState(false);

  // --- Exchange State ---
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [exchangeFeePercentage, setExchangeFeePercentage] = useState(0.002); // 0.2% fee
  const [exchangeType, setExchangeType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [isRecurringExchange, setIsRecurringExchange] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // --- Add Currency State ---
  const [newCurrencyToAdd, setNewCurrencyToAdd] = useState('');

  // --- Deposit/Withdraw State ---
  const [depositCurrency, setDepositCurrency] = useState('USD');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'bank' | 'card' | 'crypto'>('bank');
  const [depositError, setDepositError] = useState<string | null>(null);

  const [withdrawCurrency, setWithdrawCurrency] = useState('USD');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto'>('bank');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // --- Budget State ---
  const [newBudgetCurrency, setNewBudgetCurrency] = useState('USD');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [newBudgetPeriod, setNewBudgetPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [newBudgetCategory, setNewBudgetCategory] = useState('General');
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // --- AI Assistant State ---
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ai', message: string }[]>([
    { sender: 'ai', message: 'Hello! I am your AI financial assistant. How can I help you today?' }
  ]);
  const [aiChatMessage, setAiChatMessage] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);

  // --- Mocks & Effects ---

  /**
   * Simulates fetching exchange rates from an API.
   * Includes AI-driven dynamic rate adjustments and market sentiment.
   */
  const fetchExchangeRate = useCallback((from: string, to: string) => {
    setExchangeRate(null);
    setExchangeError(null);
    if (from === to) {
      setExchangeRate(1);
      return;
    }

    // Simulate AI-driven market analysis for rate prediction
    const aiMarketSentiment = Math.random() > 0.7 ? 'bullish' : (Math.random() < 0.3 ? 'bearish' : 'neutral');
    let baseRate = 1;

    // More complex mock rates
    const rates: { [key: string]: { [key: string]: number } } = {
      USD: { EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.35, CHF: 0.90, CNY: 7.25, INR: 83.0, BRL: 4.95 },
      EUR: { USD: 1.08, GBP: 0.86, JPY: 162.5, CAD: 1.47, CHF: 0.98, CNY: 7.88, INR: 90.0, BRL: 5.38 },
      GBP: { USD: 1.27, EUR: 1.16, JPY: 189.0, CAD: 1.70, CHF: 1.14, CNY: 9.15, INR: 105.0, BRL: 6.25 },
      JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, CAD: 0.0090, CHF: 0.0060, CNY: 0.048, INR: 0.55, BRL: 0.033 },
    };

    baseRate = rates[from]?.[to] || (1 / (rates[to]?.[from] || (Math.random() * 2 + 0.5))); // Fallback random rate

    // AI-driven micro-fluctuations and sentiment adjustment
    let adjustedRate = baseRate;
    if (userProfile.aiPersonalizationEnabled) {
      const fluctuation = (Math.random() - 0.5) * 0.01; // +/- 0.5%
      adjustedRate += fluctuation;
      if (aiMarketSentiment === 'bullish' && from === userProfile.preferredCurrency) {
        adjustedRate *= 1.005; // Slightly better rate for preferred currency if bullish
      } else if (aiMarketSentiment === 'bearish' && to === userProfile.preferredCurrency) {
        adjustedRate *= 0.995; // Slightly worse rate
      }
    }

    setTimeout(() => {
      setExchangeRate(parseFloat(adjustedRate.toFixed(getCurrencyDetails(to)?.decimalPlaces || 4)));
    }, 500 + Math.random() * 500); // Simulate API latency and AI processing
  }, [userProfile.aiPersonalizationEnabled, userProfile.preferredCurrency]);

  /**
   * AI-powered recommendation for exchange.
   * This is a simulated feature.
   */
  const getAIExchangeRecommendation = useCallback((from: string, to: string): string => {
    if (!userProfile.aiPersonalizationEnabled) {
      return "AI recommendations are disabled. Enable them in settings for personalized insights.";
    }
    if (from === to) return "Cannot recommend exchange for the same currency.";

    const currentRate = exchangeRate;
    if (!currentRate) return "Fetching real-time data for AI analysis...";

    // Simulate complex AI logic
    const historicalDataTrend = Math.random(); // 0 to 1, higher means upward trend
    const newsSentiment = Math.random(); // 0 to 1, higher means positive news
    const userSpendingPattern = Math.random(); // 0 to 1, higher means more spending in 'to' currency

    let recommendation = "Based on current market conditions, a standard exchange is advised.";

    if (historicalDataTrend > 0.8 && newsSentiment > 0.7) {
      recommendation = `AI suggests a strong upward trend for ${to} against ${from}. However, market volatility remains high; proceed with caution.`;
    } else if (historicalDataTrend < 0.2 && newsSentiment < 0.3) {
      recommendation = `AI detects a downward trend for ${to} against ${from}. You might want to wait or consider a limit order.`;
    } else if (userSpendingPattern > 0.6 && from === userProfile.preferredCurrency) {
      recommendation = `AI noticed frequent spending in ${to}. Ensure this exchange aligns with your current budget limits.`;
    } else if (currentRate > (1 / (getCurrencyDetails(to)?.decimalPlaces || 1)) * 1.05) { // Arbitrary "good rate"
      recommendation = `AI identifies a favorable rate for ${from} to ${to}. Note that rates can fluctuate rapidly; monitor closely.`;
    }

    return `AI Insight: ${recommendation}`;
  }, [exchangeRate, userProfile.aiPersonalizationEnabled, userProfile.preferredCurrency]);

  useEffect(() => {
    if (isExchangeModalOpen || activeTab === 'exchange') {
      fetchExchangeRate(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency, isExchangeModalOpen, activeTab, fetchExchangeRate]);

  // AI-driven fraud detection simulation
  useEffect(() => {
    if (userProfile.notificationPreferences.fraudAlerts && transactions.length > 5) {
      const lastFive = transactions.slice(-5);
      const suspiciousActivity = lastFive.some(t => t.amount > 10000 && t.type === 'withdraw'); // Large withdrawal
      if (suspiciousActivity && !notifications.some(n => n.message.includes('Suspicious activity detected'))) {
        setNotifications(prev => [...prev, {
          id: generateUniqueId(),
          type: 'warning',
          message: 'Suspicious activity detected: Large withdrawal identified. Please review your recent transactions.',
          timestamp: getCurrentTimestamp(),
          isRead: false,
        }]);
      }
    }
  }, [transactions, notifications, userProfile.notificationPreferences.fraudAlerts]);

  // AI-driven budget alerts
  useEffect(() => {
    if (userProfile.notificationPreferences.budgetAlerts) {
      budgets.forEach(budget => {
        if (budget.isActive && budget.spent / budget.limit > 0.8 && budget.spent / budget.limit < 1) {
          const alertMessage = `Your ${budget.currencyCode} budget for ${budget.category} is ${Math.round((budget.spent / budget.limit) * 100)}% utilized.`;
          if (!notifications.some(n => n.message.includes(alertMessage))) {
            setNotifications(prev => [...prev, {
              id: generateUniqueId(),
              type: 'warning',
              message: alertMessage,
              timestamp: getCurrentTimestamp(),
              isRead: false,
            }]);
          }
        }
      });
    }
  }, [budgets, notifications, userProfile.notificationPreferences.budgetAlerts]);

  // --- Helper Functions ---
  const formatAmount = useCallback((amount: number, currencyCode: string) => {
    const details = getCurrencyDetails(currencyCode);
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: details?.decimalPlaces || 2,
      maximumFractionDigits: details?.decimalPlaces || 2,
    });
  }, []);

  const getBalanceForCurrency = useCallback((code: string) => {
    return balances.find(b => b.currencyCode === code)?.amount || 0;
  }, [balances]);

  // --- Event Handlers ---
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setFromAmount(value);
      if (exchangeRate && value) {
        const amount = parseFloat(value);
        const fee = amount * exchangeFeePercentage;
        const netAmount = amount - fee;
        const convertedAmount = netAmount * exchangeRate;
        setToAmount(convertedAmount.toFixed(getCurrencyDetails(toCurrency)?.decimalPlaces || 2));
      } else {
        setToAmount('');
      }
      setExchangeError(null);
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setToAmount(value);
      if (exchangeRate && value) {
        const convertedAmount = parseFloat(value);
        const netAmount = convertedAmount / exchangeRate;
        const originalAmount = netAmount / (1 - exchangeFeePercentage); // Reverse fee calculation
        setFromAmount(originalAmount.toFixed(getCurrencyDetails(fromCurrency)?.decimalPlaces || 2));
      } else {
        setFromAmount('');
      }
      setExchangeError(null);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount); // Keep the amount in the 'from' field
    setToAmount(''); // Recalculate 'to' amount
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountToDeduct = parseFloat(fromAmount);
    const amountToAdd = parseFloat(toAmount);
    const fromBalance = balances.find(b => b.currencyCode === fromCurrency);
    const feeAmount = amountToDeduct * exchangeFeePercentage;

    if (!fromBalance || fromBalance.amount < amountToDeduct) {
      setExchangeError(`Insufficient ${fromCurrency} funds. Available: ${formatAmount(fromBalance?.amount || 0, fromCurrency)}`);
      return;
    }
    if (amountToDeduct <= 0 || !fromAmount || isNaN(amountToDeduct)) {
      setExchangeError('Please enter a valid amount to exchange.');
      return;
    }
    if (!exchangeRate) {
      setExchangeError('Exchange rate not available. Please try again.');
      return;
    }
    if (exchangeType === 'limit' && limitPrice && exchangeRate < parseFloat(limitPrice)) {
      setExchangeError(`Limit order not met. Current rate ${exchangeRate} is below your limit price ${limitPrice}.`);
      // In a real app, this would create a pending limit order
      setTransactions(prev => [...prev, {
        id: generateUniqueId(),
        type: 'exchange',
        timestamp: getCurrentTimestamp(),
        currencyCode: fromCurrency,
        amount: -amountToDeduct,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        exchangeRate: parseFloat(limitPrice),
        status: 'pending',
        description: `Pending Limit Order: Exchange ${formatAmount(amountToDeduct, fromCurrency)} ${fromCurrency} to ${toCurrency} at rate ${limitPrice}`,
        fee: feeAmount,
      }]);
      closeExchangeModal();
      return;
    }

    setBalances(prevBalances => {
      const newBalances = [...prevBalances];
      const fromIndex = newBalances.findIndex(b => b.currencyCode === fromCurrency);
      const toIndex = newBalances.findIndex(b => b.currencyCode === toCurrency);

      // Decrement from-currency
      newBalances[fromIndex] = { ...newBalances[fromIndex], amount: newBalances[fromIndex].amount - amountToDeduct, lastUpdated: getCurrentTimestamp() };

      // Increment to-currency (or create it if it doesn't exist)
      if (toIndex > -1) {
        newBalances[toIndex] = { ...newBalances[toIndex], amount: newBalances[toIndex].amount + amountToAdd, lastUpdated: getCurrentTimestamp() };
      } else {
        newBalances.push({ currencyCode: toCurrency, amount: amountToAdd, lastUpdated: getCurrentTimestamp() });
      }
      return newBalances;
    });

    setTransactions(prev => [...prev, {
      id: generateUniqueId(),
      type: 'exchange',
      timestamp: getCurrentTimestamp(),
      currencyCode: fromCurrency,
      amount: -amountToDeduct,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      exchangeRate: exchangeRate,
      status: 'completed',
      description: `Exchanged ${formatAmount(amountToDeduct, fromCurrency)} ${fromCurrency} for ${formatAmount(amountToAdd, toCurrency)} ${toCurrency}`,
      fee: feeAmount,
    },
    {
      id: generateUniqueId(),
      type: 'exchange',
      timestamp: getCurrentTimestamp(),
      currencyCode: toCurrency,
      amount: amountToAdd,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      exchangeRate: exchangeRate,
      status: 'completed',
      description: `Received ${formatAmount(amountToAdd, toCurrency)} ${toCurrency} from exchange`,
      fee: 0, // Fee already accounted for in the 'from' transaction
    }
    ]);

    // Simulate recurring exchange setup
    if (isRecurringExchange) {
      setNotifications(prev => [...prev, {
        id: generateUniqueId(),
        type: 'info',
        message: `Recurring exchange of ${formatAmount(amountToDeduct, fromCurrency)} ${fromCurrency} to ${toCurrency} set up for ${recurringFrequency}.`,
        timestamp: getCurrentTimestamp(),
        isRead: false,
      }]);
    }

    closeExchangeModal();
  };

  const handleAddCurrencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCurrencyToAdd && !balances.find(b => b.currencyCode === newCurrencyToAdd)) {
      setBalances([...balances, { currencyCode: newCurrencyToAdd, amount: 0, lastUpdated: getCurrentTimestamp() }]);
      setNotifications(prev => [...prev, {
        id: generateUniqueId(),
        type: 'success',
        message: `New account for ${newCurrencyToAdd} added successfully!`,
        timestamp: getCurrentTimestamp(),
        isRead: false,
      }]);
    }
    closeAddCurrencyModal();
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount <= 0 || isNaN(amount)) {
      setDepositError('Please enter a valid deposit amount.');
      return;
    }

    setBalances(prevBalances => {
      const newBalances = [...prevBalances];
      const index = newBalances.findIndex(b => b.currencyCode === depositCurrency);
      if (index > -1) {
        newBalances[index] = { ...newBalances[index], amount: newBalances[index].amount + amount, lastUpdated: getCurrentTimestamp() };
      } else {
        newBalances.push({ currencyCode: depositCurrency, amount: amount, lastUpdated: getCurrentTimestamp() });
      }
      return newBalances;
    });

    setTransactions(prev => [...prev, {
      id: generateUniqueId(),
      type: 'deposit',
      timestamp: getCurrentTimestamp(),
      currencyCode: depositCurrency,
      amount: amount,
      status: 'completed',
      description: `Deposit via ${depositMethod}`,
    }]);

    setNotifications(prev => [...prev, {
      id: generateUniqueId(),
      type: 'success',
      message: `Successfully deposited ${formatAmount(amount, depositCurrency)} ${depositCurrency}.`,
      timestamp: getCurrentTimestamp(),
      isRead: false,
    }]);

    closeDepositModal();
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    const balance = getBalanceForCurrency(withdrawCurrency);

    if (amount <= 0 || isNaN(amount)) {
      setWithdrawError('Please enter a valid withdrawal amount.');
      return;
    }
    if (balance < amount) {
      setWithdrawError(`Insufficient ${withdrawCurrency} funds. Available: ${formatAmount(balance, withdrawCurrency)}`);
      return;
    }

    setBalances(prevBalances => {
      const newBalances = [...prevBalances];
      const index = newBalances.findIndex(b => b.currencyCode === withdrawCurrency);
      if (index > -1) {
        newBalances[index] = { ...newBalances[index], amount: newBalances[index].amount - amount, lastUpdated: getCurrentTimestamp() };
      }
      return newBalances;
    });

    setTransactions(prev => [...prev, {
      id: generateUniqueId(),
      type: 'withdraw',
      timestamp: getCurrentTimestamp(),
      currencyCode: withdrawCurrency,
      amount: -amount,
      status: 'completed',
      description: `Withdrawal via ${withdrawMethod}`,
    }]);

    setNotifications(prev => [...prev, {
      id: generateUniqueId(),
      type: 'success',
      message: `Successfully withdrew ${formatAmount(amount, withdrawCurrency)} ${withdrawCurrency}.`,
      timestamp: getCurrentTimestamp(),
      isRead: false,
    }]);

    closeWithdrawModal();
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(newBudgetLimit);
    if (limit <= 0 || isNaN(limit)) {
      setBudgetError('Please enter a valid budget limit.');
      return;
    }

    setBudgets(prev => [...prev, {
      id: generateUniqueId(),
      currencyCode: newBudgetCurrency,
      limit: limit,
      spent: 0,
      period: newBudgetPeriod,
      category: newBudgetCategory,
      isActive: true,
    }]);

    setNotifications(prev => [...prev, {
      id: generateUniqueId(),
      type: 'success',
      message: `New ${newBudgetCategory} budget for ${newBudgetCurrency} set to ${formatAmount(limit, newBudgetCurrency)} ${newBudgetPeriod}ly.`,
      timestamp: getCurrentTimestamp(),
      isRead: false,
    }]);

    closeBudgetModal();
  };

  const handleToggleBudgetActive = (budgetId: string) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, isActive: !b.isActive } : b));
  };

  const handleRemoveBudget = (budgetId: string) => {
    setBudgets(prev => prev.filter(b => b.id !== budgetId));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleAIAssistantMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatMessage.trim()) return;

    const userMessage = aiChatMessage;
    setAiChatHistory(prev => [...prev, { sender: 'user', message: userMessage }]);
    setAiChatMessage('');
    setAiIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      let aiResponse = "I'm sorry, I didn't understand that. Can you please rephrase?";
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('balance')) {
        const totalUSD = balances.reduce((sum, b) => {
          const rate = getExchangeRateMock(b.currencyCode, 'USD');
          return sum + (b.amount * rate);
        }, 0);
        aiResponse = `Your total portfolio value is approximately ${formatAmount(totalUSD, 'USD')} USD. You have ${balances.length} active currency accounts.`;
      } else if (lowerMessage.includes('exchange rate')) {
        const from = lowerMessage.includes('usd') ? 'USD' : (lowerMessage.includes('eur') ? 'EUR' : 'USD');
        const to = lowerMessage.includes('gbp') ? 'GBP' : (lowerMessage.includes('jpy') ? 'JPY' : 'EUR');
        const rate = getExchangeRateMock(from, to);
        aiResponse = `The current simulated exchange rate for ${from} to ${to} is 1 ${from} = ${rate.toFixed(4)} ${to}.`;
      } else if (lowerMessage.includes('budget')) {
        const activeBudgets = budgets.filter(b => b.isActive).length;
        aiResponse = `You have ${activeBudgets} active budgets. Your highest budget utilization is ${Math.max(...budgets.map(b => b.spent / b.limit * 100), 0).toFixed(0)}%.`;
      } else if (lowerMessage.includes('help') || lowerMessage.includes('features')) {
        aiResponse = "I can help you with balance inquiries, exchange rates, budget summaries, transaction history, and security settings. Just ask!";
      } else if (lowerMessage.includes('security')) {
        aiResponse = `Your current security level is ${userProfile.securityLevel.replace('_', ' ')}. You can manage security settings in the 'Security' tab.`;
      } else if (lowerMessage.includes('fraud')) {
        aiResponse = "Our AI-powered fraud detection system actively monitors your transactions for unusual patterns and will alert you to any suspicious activity.";
      } else if (lowerMessage.includes('recommendation')) {
        aiResponse = getAIExchangeRecommendation(fromCurrency, toCurrency);
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        aiResponse = "Hello there! How can I assist you today?";
      } else if (lowerMessage.includes('thank you') || lowerMessage.includes('thanks')) {
        aiResponse = "You're welcome! Is there anything else?";
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', message: aiResponse }]);
      setAiIsTyping(false);
    }, 1500 + Math.random() * 1000); // Simulate AI processing time
  };

  const getExchangeRateMock = (from: string, to: string): number => {
    if (from === to) return 1;
    const rates: { [key: string]: { [key: string]: number } } = {
      USD: { EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.35, CHF: 0.90, CNY: 7.25, INR: 83.0, BRL: 4.95 },
      EUR: { USD: 1.08, GBP: 0.86, JPY: 162.5, CAD: 1.47, CHF: 0.98, CNY: 7.88, INR: 90.0, BRL: 5.38 },
      GBP: { USD: 1.27, EUR: 1.16, JPY: 189.0, CAD: 1.70, CHF: 1.14, CNY: 9.15, INR: 105.0, BRL: 6.25 },
      JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, CAD: 0.0090, CHF: 0.0060, CNY: 0.048, INR: 0.55, BRL: 0.033 },
    };
    return rates[from]?.[to] || (1 / (rates[to]?.[from] || 1)); // Fallback to inverse or 1
  };


  // --- Modal Control ---
  const openExchangeModal = () => {
    const userCurrencies = balances.map(b => b.currencyCode);
    if (userCurrencies.length > 0) {
      setFromCurrency(userCurrencies[0]);
      const otherCurrency = SUPPORTED_CURRENCIES.find(c => !userCurrencies.includes(c.code));
      setToCurrency(otherCurrency ? otherCurrency.code : SUPPORTED_CURRENCIES[1].code);
    }
    setExchangeModalOpen(true);
  };

  const closeExchangeModal = () => {
    setExchangeModalOpen(false);
    setFromAmount('');
    setToAmount('');
    setExchangeError(null);
    setExchangeType('market');
    setLimitPrice('');
    setIsRecurringExchange(false);
  };

  const openAddCurrencyModal = () => {
    const available = availableCurrenciesToAdd.at(0);
    if (available) setNewCurrencyToAdd(available.code);
    setAddCurrencyModalOpen(true);
  };

  const closeAddCurrencyModal = () => {
    setAddCurrencyModalOpen(false);
    setNewCurrencyToAdd('');
  };

  const openDepositModal = () => {
    setDepositCurrency(userCurrencyCodes[0] || 'USD');
    setDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setDepositModalOpen(false);
    setDepositAmount('');
    setDepositError(null);
  };

  const openWithdrawModal = () => {
    setWithdrawCurrency(userCurrencyCodes[0] || 'USD');
    setWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
    setWithdrawAmount('');
    setWithdrawError(null);
  };

  const openBudgetModal = () => {
    setNewBudgetCurrency(userCurrencyCodes[0] || 'USD');
    setBudgetModalOpen(true);
  };

  const closeBudgetModal = () => {
    setBudgetModalOpen(false);
    setNewBudgetLimit('');
    setNewBudgetCategory('General');
    setNewBudgetPeriod('monthly');
    setBudgetError(null);
  };

  const openNotificationCenter = () => {
    setNotificationCenterOpen(true);
  };

  const closeNotificationCenter = () => {
    setNotificationCenterOpen(false);
  };

  const openAIAssistantModal = () => {
    setAIAssistantModalOpen(true);
  };

  const closeAIAssistantModal = () => {
    setAIAssistantModalOpen(false);
  };

  const openSecuritySettingsModal = () => {
    setSecuritySettingsModalOpen(true);
  };

  const closeSecuritySettingsModal = () => {
    setSecuritySettingsModalOpen(false);
  };

  // --- Memoized Values ---
  const userCurrencyCodes = useMemo(() => balances.map(b => b.currencyCode), [balances]);

  const availableCurrenciesToAdd = useMemo(() =>
    SUPPORTED_CURRENCIES.filter(c => !userCurrencyCodes.includes(c.code)),
    [userCurrencyCodes]
  );

  const totalPortfolioValueUSD = useMemo(() => {
    return balances.reduce((total, balance) => {
      const rate = getExchangeRateMock(balance.currencyCode, 'USD');
      return total + (balance.amount * rate);
    }, 0);
  }, [balances]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const aiExchangeRecommendation = useMemo(() => getAIExchangeRecommendation(fromCurrency, toCurrency), [fromCurrency, toCurrency, getAIExchangeRecommendation]);

  // --- Render Logic for Tabs ---
  const renderDashboard = () => (
    <div style={styles.dashboardGrid}>
      <div style={{ ...styles.dashboardCard, ...styles.dashboardCardPrimary }}>
        <h3 style={styles.dashboardCardTitle}>Total Portfolio Value</h3>
        <p style={styles.dashboardValue}>{getCurrencyDetails('USD')?.symbol}{formatAmount(totalPortfolioValueUSD, 'USD')}</p>
        <p style={styles.dashboardSubtitle}>Equivalent in {userProfile.preferredCurrency}</p>
        <div style={styles.dashboardActions}>
          <button style={styles.actionButton} onClick={openExchangeModal}>Exchange</button>
          <button style={{ ...styles.actionButton, ...styles.secondaryButton }} onClick={openDepositModal}>Deposit</button>
          <button style={{ ...styles.actionButton, ...styles.secondaryButton }} onClick={openWithdrawModal}>Withdraw</button>
        </div>
      </div>

      <div style={styles.dashboardCard}>
        <h3 style={styles.dashboardCardTitle}>Recent Activity</h3>
        <ul style={styles.activityList}>
          {transactions.slice(0, 5).map(tx => (
            <li key={tx.id} style={styles.activityItem}>
              <span style={styles.activityType}>{tx.type.toUpperCase()}</span>
              <span style={styles.activityDescription}>{tx.description}</span>
              <span style={styles.activityAmount}>
                {tx.amount < 0 ? '-' : ''}
                {getCurrencyDetails(tx.currencyCode)?.symbol}
                {formatAmount(Math.abs(tx.amount), tx.currencyCode)}
              </span>
            </li>
          ))}
        </ul>
        <button style={styles.viewAllButton} onClick={() => setActiveTab('history')}>View All Transactions</button>
      </div>

      <div style={styles.dashboardCard}>
        <h3 style={styles.dashboardCardTitle}>Currency Distribution (AI Insight)</h3>
        <div style={styles.chartPlaceholder}>
          {balances.length > 0 ? (
            balances.map(b => (
              <div key={b.currencyCode} style={styles.distributionItem}>
                <span style={styles.distributionLabel}>{getCurrencyDetails(b.currencyCode)?.flag} {b.currencyCode}</span>
                <span style={styles.distributionValue}>{((b.amount * getExchangeRateMock(b.currencyCode, 'USD')) / totalPortfolioValueUSD * 100).toFixed(1)}%</span>
              </div>
            ))
          ) : (
            <p>No balances to display distribution.</p>
          )}
        </div>
        <p style={styles.aiInsightText}>{userProfile.aiPersonalizationEnabled ? "AI analysis indicates potential over-diversification. Reviewing your current risk exposure is mandatory." : "Enable AI personalization for tailored insights."}</p>
      </div>

      <div style={styles.dashboardCard}>
        <h3 style={styles.dashboardCardTitle}>Budget Overview</h3>
        <ul style={styles.budgetOverviewList}>
          {budgets.slice(0, 3).map(budget => (
            <li key={budget.id} style={styles.budgetOverviewItem}>
              <span style={styles.budgetOverviewCategory}>{budget.category} ({budget.currencyCode})</span>
              <span style={styles.budgetOverviewProgress}>
                {formatAmount(budget.spent, budget.currencyCode)} / {formatAmount(budget.limit, budget.currencyCode)}
              </span>
              <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBarFill, width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
        <button style={styles.viewAllButton} onClick={() => setActiveTab('budgeting')}>Manage Budgets</button>
      </div>
    </div>
  );

  const renderExchange = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>Currency Exchange Center</h2>
      <p style={styles.featureSubtitle}>Execute market orders, set limit orders, and manage recurring exchanges with AI-powered insights.</p>

      <div style={styles.exchangeControls}>
        <button
          style={{ ...styles.tabButton, ...(exchangeType === 'market' ? styles.tabButtonActive : {}) }}
          onClick={() => setExchangeType('market')}
        >
          Market Order
        </button>
        <button
          style={{ ...styles.tabButton, ...(exchangeType === 'limit' ? styles.tabButtonActive : {}) }}
          onClick={() => setExchangeType('limit')}
        >
          Limit Order
        </button>
      </div>

      <form onSubmit={handleExchangeSubmit} style={styles.exchangeForm}>
        <div style={styles.exchangeRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="from-currency-exchange">From</label>
            <select id="from-currency-exchange" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} style={styles.select}>
              {balances.map(b => (
                <option key={b.currencyCode} value={b.currencyCode}>{getCurrencyDetails(b.currencyCode)?.flag} {b.currencyCode} ({formatAmount(b.amount, b.currencyCode)})</option>
              ))}
            </select>
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0.00"
              style={styles.input}
            />
            <p style={styles.balanceInfo}>Available: {formatAmount(getBalanceForCurrency(fromCurrency), fromCurrency)} {fromCurrency}</p>
          </div>

          <div style={styles.swapButtonContainer}>
            <button type="button" onClick={handleSwapCurrencies} style={styles.swapButton}>&#x21C6;</button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="to-currency-exchange">To</label>
            <select id="to-currency-exchange" value={toCurrency} onChange={e => setToCurrency(e.target.value)} style={styles.select}>
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <input
              type="text"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder="0.00"
              style={styles.input}
              readOnly={true} // To amount is calculated
            />
            <p style={styles.balanceInfo}>Est. Receive: {toAmount || '0.00'} {toCurrency}</p>
          </div>
        </div>

        {exchangeType === 'limit' && (
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="limit-price">Limit Price (1 {fromCurrency} = ? {toCurrency})</label>
            <input
              type="text"
              id="limit-price"
              value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              placeholder={exchangeRate ? `e.g., ${exchangeRate.toFixed(4)}` : 'Enter desired rate'}
              style={styles.input}
            />
            <p style={styles.infoText}>Your order will execute only when the market rate reaches or exceeds this price.</p>
          </div>
        )}

        <div style={styles.rateInfo}>
          {exchangeRate ? `Current Rate: 1 ${fromCurrency} = ${exchangeRate.toFixed(getCurrencyDetails(toCurrency)?.decimalPlaces || 4)} ${toCurrency}` : 'Fetching rate...'}
          {exchangeFeePercentage > 0 && (
            <span style={styles.feeInfo}> (Fee: {exchangeFeePercentage * 100}%)</span>
          )}
        </div>

        <div style={styles.aiRecommendationBox}>
          <p style={styles.aiRecommendationTitle}>AI Exchange Recommendation:</p>
          <p style={styles.aiRecommendationText}>{aiExchangeRecommendation}</p>
        </div>

        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="recurring-exchange"
            checked={isRecurringExchange}
            onChange={e => setIsRecurringExchange(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="recurring-exchange" style={styles.checkboxLabel}>Set as Recurring Exchange</label>
        </div>

        {isRecurringExchange && (
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="recurring-frequency">Frequency</label>
            <select
              id="recurring-frequency"
              value={recurringFrequency}
              onChange={e => setRecurringFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
              style={styles.select}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <p style={styles.infoText}>AI will automatically execute this exchange at the chosen frequency.</p>
          </div>
        )}

        {exchangeError && <p style={styles.errorText}>{exchangeError}</p>}

        <div style={styles.modalActions}>
          <button type="submit" style={styles.modalButton} disabled={!exchangeRate || !fromAmount || parseFloat(fromAmount) <= 0}>
            {exchangeType === 'market' ? 'Convert Now' : 'Place Limit Order'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderHistory = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>Transaction History</h2>
      <p style={styles.featureSubtitle}>Detailed record of all your financial activities.</p>

      <div style={styles.filterControls}>
        <select style={styles.select}>
          <option value="">All Types</option>
          <option value="exchange">Exchange</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
          <option value="fee">Fee</option>
        </select>
        <select style={styles.select}>
          <option value="">All Currencies</option>
          {userCurrencyCodes.map(code => <option key={code} value={code}>{code}</option>)}
        </select>
        <input type="date" style={styles.input} />
        <button style={styles.actionButton}>Apply Filters</button>
      </div>

      <div style={styles.transactionTableContainer}>
        <table style={styles.transactionTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Type</th>
              <th style={styles.tableHeader}>Description</th>
              <th style={styles.tableHeader}>Currency</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(tx => (
              <tr key={tx.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{new Date(tx.timestamp).toLocaleString()}</td>
                <td style={styles.tableCell}>{tx.type}</td>
                <td style={styles.tableCell}>{tx.description}</td>
                <td style={styles.tableCell}>{tx.currencyCode}</td>
                <td style={{ ...styles.tableCell, color: tx.amount < 0 ? '#d93025' : '#28a745' }}>
                  {getCurrencyDetails(tx.currencyCode)?.symbol} {formatAmount(Math.abs(tx.amount), tx.currencyCode)}
                </td>
                <td style={styles.tableCell}>
                  <span style={{ ...styles.statusBadge, ...styles[`statusBadge_${tx.status}`] }}>{tx.status}</span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={6} style={styles.emptyStateText}>No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={styles.paginationControls}>
        <button style={styles.paginationButton} disabled>Previous</button>
        <span style={styles.paginationText}>Page 1 of 1</span>
        <button style={styles.paginationButton} disabled>Next</button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>Financial Analytics & Insights</h2>
      <p style={styles.featureSubtitle}>Visualize your portfolio performance and spending patterns with AI-driven analysis.</p>

      <div style={styles.analyticsGrid}>
        <div style={styles.analyticsCard}>
          <h3 style={styles.analyticsCardTitle}>Portfolio Allocation (AI Optimized)</h3>
          <div style={styles.chartPlaceholder}>
            {balances.length > 0 ? (
              balances.map(b => (
                <div key={b.currencyCode} style={styles.distributionItem}>
                  <span style={styles.distributionLabel}>{getCurrencyDetails(b.currencyCode)?.flag} {b.currencyCode}</span>
                  <span style={styles.distributionValue}>{((b.amount * getExchangeRateMock(b.currencyCode, 'USD')) / totalPortfolioValueUSD * 100).toFixed(1)}%</span>
                </div>
              ))
            ) : (
              <p>No balances to analyze.</p>
            )}
          </div>
          <p style={styles.aiInsightText}>AI analysis suggests your current allocation is highly sensitive to minor market shifts. Immediate rebalancing is not recommended without further consultation.</p>
          <button style={styles.actionButton}>View Detailed Allocation</button>
        </div>

        <div style={styles.analyticsCard}>
          <h3 style={styles.analyticsCardTitle}>Spending Trends (AI Categorized)</h3>
          <div style={styles.chartPlaceholder}>
            <p style={styles.chartText}>[Simulated Bar Chart: Monthly Spending by Category]</p>
            <ul style={styles.spendingCategoryList}>
              <li>Shopping: {getCurrencyDetails('USD')?.symbol}250.00</li>
              <li>Travel: {getCurrencyDetails('EUR')?.symbol}120.00</li>
              <li>Utilities: {getCurrencyDetails('GBP')?.symbol}80.00</li>
            </ul>
          </div>
          <p style={styles.aiInsightText}>AI detected a 15% increase in 'Shopping' expenses. This trend is within acceptable variance, but manual review is advised.</p>
          <button style={styles.actionButton} onClick={openBudgetModal}>Set New Budget</button>
        </div>

        <div style={styles.analyticsCard}>
          <h3 style={styles.analyticsCardTitle}>Currency Performance (AI Predicted)</h3>
          <div style={styles.chartPlaceholder}>
            <p style={styles.chartText}>[Simulated Line Chart: USD/EUR over 30 days]</p>
            <p style={styles.infoText}>USD/EUR: +0.5% (Last 24h)</p>
            <p style={styles.infoText}>GBP/USD: -0.2% (Last 24h)</p>
          </div>
          <p style={styles.aiInsightText}>AI prediction confidence is low due to global uncertainty. Expect high volatility and avoid speculative exchanges.</p>
          <button style={styles.actionButton}>Set Rate Alert</button>
        </div>

        <div style={styles.analyticsCard}>
          <h3 style={styles.analyticsCardTitle}>Risk Assessment (AI Powered)</h3>
          <div style={styles.chartPlaceholder}>
            <p style={styles.chartText}>[Simulated Risk Meter: Moderate]</p>
            <p style={styles.infoText}>Overall Portfolio Risk: Moderate</p>
            <p style={styles.infoText}>Volatility Exposure: 25%</p>
          </div>
          <p style={styles.aiInsightText}>Your portfolio risk is currently unquantifiable due to data limitations. Assume maximum risk until manually verified.</p>
          <button style={styles.actionButton}>Adjust Risk Profile</button>
        </div>
      </div>
    </div>
  );

  const renderBudgeting = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>Budgeting & Spending Controls</h2>
      <p style={styles.featureSubtitle}>Take control of your finances with AI-assisted budgeting and spending insights.</p>

      <button style={styles.actionButton} onClick={openBudgetModal}>Create New Budget</button>

      <div style={styles.budgetList}>
        {budgets.map(budget => (
          <div key={budget.id} style={styles.budgetCard}>
            <div style={styles.budgetCardHeader}>
              <h4 style={styles.budgetCardTitle}>{budget.category} ({budget.currencyCode})</h4>
              <span style={{ ...styles.statusBadge, ...styles[budget.isActive ? 'statusBadge_active' : 'statusBadge_inactive'] }}>
                {budget.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p style={styles.budgetCardAmount}>
              Spent: {getCurrencyDetails(budget.currencyCode)?.symbol}{formatAmount(budget.spent, budget.currencyCode)} / Limit: {getCurrencyDetails(budget.currencyCode)?.symbol}{formatAmount(budget.limit, budget.currencyCode)}
            </p>
            <div style={styles.progressBarContainer}>
              <div style={{ ...styles.progressBarFill, width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}></div>
            </div>
            <p style={styles.budgetCardPeriod}>Period: {budget.period}</p>
            <p style={styles.aiInsightText}>AI Insight: {budget.spent / budget.limit > 0.7 ? "You have exceeded 70% of your limit. Immediate action is required to prevent failure." : "Spending is low. This may indicate underutilization of funds or inaccurate tracking."}</p>
            <div style={styles.budgetCardActions}>
              <button style={{ ...styles.actionButton, ...styles.secondaryButton }} onClick={() => handleToggleBudgetActive(budget.id)}>
                {budget.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button style={{ ...styles.actionButton, ...styles.dangerButton }} onClick={() => handleRemoveBudget(budget.id)}>Remove</button>
            </div>
          </div>
        ))}
        {budgets.length === 0 && (
          <p style={styles.emptyStateText}>No budgets set. Create one to start managing your spending!</p>
        )}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>Security Center</h2>
      <p style={styles.featureSubtitle}>Enhance your account security with advanced protection features.</p>

      <div style={styles.securityCard}>
        <h3 style={styles.securityCardTitle}>Two-Factor Authentication (2FA)</h3>
        <p style={styles.securityCardDescription}>Add an extra layer of security by requiring a code from your mobile device.</p>
        <div style={styles.securityStatus}>
          Status: <span style={userProfile.securityLevel === '2fa_enabled' || userProfile.securityLevel === 'biometric_enabled' ? styles.statusActive : styles.statusInactive}>
            {userProfile.securityLevel === '2fa_enabled' || userProfile.securityLevel === 'biometric_enabled' ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <button style={styles.actionButton} onClick={openSecuritySettingsModal}>Manage 2FA</button>
      </div>

      <div style={styles.securityCard}>
        <h3 style={styles.securityCardTitle}>Biometric Authentication</h3>
        <p style={styles.securityCardDescription}>Secure your account with fingerprint or facial recognition (device dependent).</p>
        <div style={styles.securityStatus}>
          Status: <span style={userProfile.securityLevel === 'biometric_enabled' ? styles.statusActive : styles.statusInactive}>
            {userProfile.securityLevel === 'biometric_enabled' ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <button style={styles.actionButton} onClick={openSecuritySettingsModal}>Manage Biometrics</button>
      </div>

      <div style={styles.securityCard}>
        <h3 style={styles.securityCardTitle}>AI-Powered Fraud Detection</h3>
        <p style={styles.securityCardDescription}>Our advanced AI continuously monitors your transactions for suspicious patterns and alerts you to potential fraud.</p>
        <div style={styles.securityStatus}>
          Status: <span style={userProfile.notificationPreferences.fraudAlerts ? styles.statusActive : styles.statusInactive}>
            {userProfile.notificationPreferences.fraudAlerts ? 'Active' : 'Inactive'}
          </span>
        </div>
        <button style={styles.actionButton} onClick={openSecuritySettingsModal}>Configure Alerts</button>
      </div>

      <div style={styles.securityCard}>
        <h3 style={styles.securityCardTitle}>Account Activity Log</h3>
        <p style={styles.securityCardDescription}>Review recent logins and account changes to ensure your account's integrity.</p>
        <button style={styles.actionButton}>View Activity Log</button>
      </div>
    </div>
  );

  const renderAIAssistant = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>AI Financial Assistant</h2>
      <p style={styles.featureSubtitle}>Your intelligent companion for all financial queries and insights.</p>

      <div style={styles.aiChatContainer}>
        <div style={styles.aiChatHistory}>
          {aiChatHistory.map((msg, index) => (
            <div key={index} style={{ ...styles.aiChatMessage, ...(msg.sender === 'user' ? styles.aiChatMessageUser : styles.aiChatMessageAI) }}>
              <span style={styles.aiChatSender}>{msg.sender === 'user' ? 'You' : 'AI Assistant'}:</span> {msg.message}
            </div>
          ))}
          {aiIsTyping && (
            <div style={styles.aiChatMessageAI}>
              <span style={styles.aiChatSender}>AI Assistant:</span> <span>Typing...</span>
            </div>
          )}
        </div>
        <form onSubmit={handleAIAssistantMessageSend} style={styles.aiChatInputForm}>
          <input
            type="text"
            value={aiChatMessage}
            onChange={e => setAiChatMessage(e.target.value)}
            placeholder="Ask me anything about your finances..."
            style={styles.aiChatInput}
            disabled={aiIsTyping}
          />
          <button type="submit" style={styles.aiChatSendButton} disabled={aiIsTyping || !aiChatMessage.trim()}>Send</button>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={styles.featureSection}>
      <h2 style={styles.featureTitle}>Account Settings</h2>
      <p style={styles.featureSubtitle}>Manage your profile, preferences, and system configurations.</p>

      <div style={styles.settingsGroup}>
        <h3 style={styles.settingsGroupTitle}>Personal Information</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input type="text" value={userProfile.fullName} onChange={e => setUserProfile(prev => ({ ...prev, fullName: e.target.value }))} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input type="email" value={userProfile.email} readOnly style={styles.inputReadOnly} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Preferred Currency</label>
          <select value={userProfile.preferredCurrency} onChange={e => setUserProfile(prev => ({ ...prev, preferredCurrency: e.target.value }))} style={styles.select}>
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>
            ))}
          </select>
        </div>
        <button style={styles.actionButton}>Save Profile</button>
      </div>

      <div style={styles.settingsGroup}>
        <h3 style={styles.settingsGroupTitle}>AI & Personalization</h3>
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="ai-personalization"
            checked={userProfile.aiPersonalizationEnabled}
            onChange={e => setUserProfile(prev => ({ ...prev, aiPersonalizationEnabled: e.target.checked }))}
            style={styles.checkbox}
          />
          <label htmlFor="ai-personalization" style={styles.checkboxLabel}>Enable AI-Powered Personalization</label>
        </div>
        <p style={styles.infoText}>Allow AI to analyze your financial data to provide tailored recommendations and insights.</p>
      </div>

      <div style={styles.settingsGroup}>
        <h3 style={styles.settingsGroupTitle}>Notification Preferences</h3>
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="notify-exchange"
            checked={userProfile.notificationPreferences.exchangeAlerts}
            onChange={e => setUserProfile(prev => ({ ...prev, notificationPreferences: { ...prev.notificationPreferences, exchangeAlerts: e.target.checked } }))}
            style={styles.checkbox}
          />
          <label htmlFor="notify-exchange" style={styles.checkboxLabel}>Exchange Rate Alerts</label>
        </div>
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="notify-fraud"
            checked={userProfile.notificationPreferences.fraudAlerts}
            onChange={e => setUserProfile(prev => ({ ...prev, notificationPreferences: { ...prev.notificationPreferences, fraudAlerts: e.target.checked } }))}
            style={styles.checkbox}
          />
          <label htmlFor="notify-fraud" style={styles.checkboxLabel}>AI Fraud Detection Alerts</label>
        </div>
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="notify-budget"
            checked={userProfile.notificationPreferences.budgetAlerts}
            onChange={e => setUserProfile(prev => ({ ...prev, notificationPreferences: { ...prev.notificationPreferences, budgetAlerts: e.target.checked } }))}
            style={styles.checkbox}
          />
          <label htmlFor="notify-budget" style={styles.checkboxLabel}>Budget Utilization Alerts</label>
        </div>
        <button style={styles.actionButton}>Save Preferences</button>
      </div>

      <div style={styles.settingsGroup}>
        <h3 style={styles.settingsGroupTitle}>Account Management</h3>
        <button style={{ ...styles.actionButton, ...styles.dangerButton }}>Close Account</button>
        <p style={styles.infoText}>This action is irreversible and will permanently delete your financial data.</p>
      </div>
    </div>
  );


  // --- Main Render ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Standard Financial Management System</h1>
        <p style={styles.subtitle}>A standard platform for managing global finances. We provide basic tools and require user diligence for all decisions.</p>
      </header>

      <nav style={styles.navBar}>
        <button style={{ ...styles.navButton, ...(activeTab === 'dashboard' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'exchange' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('exchange')}>Exchange</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'history' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('history')}>History</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'analytics' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('analytics')}>Analytics</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'budgeting' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('budgeting')}>Budgeting</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'security' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('security')}>Security</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'ai_assistant' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('ai_assistant')}>AI Assistant</button>
        <button style={{ ...styles.navButton, ...(activeTab === 'settings' ? styles.navButtonActive : {}) }} onClick={() => setActiveTab('settings')}>Settings</button>
        <button style={styles.navButton} onClick={openNotificationCenter}>
          Notifications {unreadNotificationsCount > 0 && <span style={styles.notificationBadge}>{unreadNotificationsCount}</span>}
        </button>
      </nav>

      <div style={styles.contentArea}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'exchange' && renderExchange()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'budgeting' && renderBudgeting()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'ai_assistant' && renderAIAssistant()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Modals */}
      {isExchangeModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Currency Exchange</h2>
            <p style={styles.modalSubtitle}>Quickly convert between your available currencies.</p>
            <form onSubmit={handleExchangeSubmit}>
              <div style={styles.exchangeRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="modal-from-currency">From</label>
                  <select id="modal-from-currency" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} style={styles.select}>
                    {balances.map(b => (
                      <option key={b.currencyCode} value={b.currencyCode}>{getCurrencyDetails(b.currencyCode)?.flag} {b.currencyCode} ({formatAmount(b.amount, b.currencyCode)})</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0.00"
                    style={styles.input}
                  />
                  <p style={styles.balanceInfo}>Available: {formatAmount(getBalanceForCurrency(fromCurrency), fromCurrency)} {fromCurrency}</p>
                </div>

                <div style={styles.swapButtonContainer}>
                  <button type="button" onClick={handleSwapCurrencies} style={styles.swapButton}>&#x21C6;</button>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="modal-to-currency">To</label>
                  <select id="modal-to-currency" value={toCurrency} onChange={e => setToCurrency(e.target.value)} style={styles.select}>
                    {SUPPORTED_CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={toAmount}
                    onChange={handleToAmountChange}
                    placeholder="0.00"
                    style={styles.input}
                    readOnly={true}
                  />
                  <p style={styles.balanceInfo}>Est. Receive: {toAmount || '0.00'} {toCurrency}</p>
                </div>
              </div>

              <div style={styles.rateInfo}>
                {exchangeRate ? `Current Rate: 1 ${fromCurrency} = ${exchangeRate.toFixed(getCurrencyDetails(toCurrency)?.decimalPlaces || 4)} ${toCurrency}` : 'Fetching rate...'}
                {exchangeFeePercentage > 0 && (
                  <span style={styles.feeInfo}> (Fee: {exchangeFeePercentage * 100}%)</span>
                )}
              </div>

              {exchangeError && <p style={styles.errorText}>{exchangeError}</p>}

              <div style={styles.modalActions}>
                <button type="button" onClick={closeExchangeModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Cancel</button>
                <button type="submit" style={styles.modalButton} disabled={!exchangeRate || !fromAmount || parseFloat(fromAmount) <= 0}>Convert</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddCurrencyModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Add New Currency Account</h2>
            <p style={styles.modalSubtitle}>Select a currency to add to your wallet. You can deposit funds later.</p>
            <form onSubmit={handleAddCurrencySubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="new-currency">Select Currency</label>
                <select
                  id="new-currency"
                  value={newCurrencyToAdd}
                  onChange={e => setNewCurrencyToAdd(e.target.value)}
                  style={{ ...styles.select, width: '100%' }}
                >
                  {availableCurrenciesToAdd.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={closeAddCurrencyModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Cancel</button>
                <button type="submit" style={styles.modalButton} disabled={!newCurrencyToAdd}>Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDepositModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Deposit Funds</h2>
            <p style={styles.modalSubtitle}>Add funds to your selected currency account.</p>
            <form onSubmit={handleDepositSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="deposit-currency">Currency</label>
                <select id="deposit-currency" value={depositCurrency} onChange={e => setDepositCurrency(e.target.value)} style={styles.select}>
                  {userCurrencyCodes.map(code => (
                    <option key={code} value={code}>{getCurrencyDetails(code)?.flag} {code}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="deposit-amount">Amount</label>
                <input
                  type="text"
                  id="deposit-amount"
                  value={depositAmount}
                  onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value) || e.target.value === '') setDepositAmount(e.target.value); }}
                  placeholder="0.00"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="deposit-method">Deposit Method</label>
                <select id="deposit-method" value={depositMethod} onChange={e => setDepositMethod(e.target.value as 'bank' | 'card' | 'crypto')} style={styles.select}>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>
              {depositError && <p style={styles.errorText}>{depositError}</p>}
              <div style={styles.modalActions}>
                <button type="button" onClick={closeDepositModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Cancel</button>
                <button type="submit" style={styles.modalButton} disabled={!depositAmount || parseFloat(depositAmount) <= 0}>Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isWithdrawModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Withdraw Funds</h2>
            <p style={styles.modalSubtitle}>Transfer funds from your selected currency account.</p>
            <form onSubmit={handleWithdrawSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="withdraw-currency">Currency</label>
                <select id="withdraw-currency" value={withdrawCurrency} onChange={e => setWithdrawCurrency(e.target.value)} style={styles.select}>
                  {userCurrencyCodes.map(code => (
                    <option key={code} value={code}>{getCurrencyDetails(code)?.flag} {code} (Available: {formatAmount(getBalanceForCurrency(code), code)})</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="withdraw-amount">Amount</label>
                <input
                  type="text"
                  id="withdraw-amount"
                  value={withdrawAmount}
                  onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value) || e.target.value === '') setWithdrawAmount(e.target.value); }}
                  placeholder="0.00"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="withdraw-method">Withdrawal Method</label>
                <select id="withdraw-method" value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value as 'bank' | 'crypto')} style={styles.select}>
                  <option value="bank">Bank Transfer</option>
                  <option value="crypto">Cryptocurrency Wallet</option>
                </select>
              </div>
              {withdrawError && <p style={styles.errorText}>{withdrawError}</p>}
              <div style={styles.modalActions}>
                <button type="button" onClick={closeWithdrawModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Cancel</button>
                <button type="submit" style={styles.modalButton} disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}>Withdraw</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBudgetModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Create New Budget</h2>
            <p style={styles.modalSubtitle}>Set spending limits to manage your finances effectively.</p>
            <form onSubmit={handleBudgetSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="budget-currency">Currency</label>
                <select id="budget-currency" value={newBudgetCurrency} onChange={e => setNewBudgetCurrency(e.target.value)} style={styles.select}>
                  {userCurrencyCodes.map(code => (
                    <option key={code} value={code}>{getCurrencyDetails(code)?.flag} {code}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="budget-limit">Budget Limit</label>
                <input
                  type="text"
                  id="budget-limit"
                  value={newBudgetLimit}
                  onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value) || e.target.value === '') setNewBudgetLimit(e.target.value); }}
                  placeholder="0.00"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="budget-period">Period</label>
                <select id="budget-period" value={newBudgetPeriod} onChange={e => setNewBudgetPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')} style={styles.select}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="budget-category">Category</label>
                <input
                  type="text"
                  id="budget-category"
                  value={newBudgetCategory}
                  onChange={e => setNewBudgetCategory(e.target.value)}
                  placeholder="e.g., Shopping, Travel, Food"
                  style={styles.input}
                />
              </div>
              {budgetError && <p style={styles.errorText}>{budgetError}</p>}
              <div style={styles.modalActions}>
                <button type="button" onClick={closeBudgetModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Cancel</button>
                <button type="submit" style={styles.modalButton} disabled={!newBudgetLimit || parseFloat(newBudgetLimit) <= 0}>Create Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNotificationCenterOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Notifications</h2>
            <p style={styles.modalSubtitle}>Stay informed about your account activity and important alerts.</p>
            <div style={styles.notificationList}>
              {notifications.length > 0 ? (
                notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(n => (
                  <div key={n.id} style={{ ...styles.notificationItem, ...(n.isRead ? styles.notificationItemRead : {}) }}>
                    <div style={styles.notificationHeader}>
                      <span style={{ ...styles.notificationTypeBadge, ...styles[`notificationTypeBadge_${n.type}`] }}>{n.type.toUpperCase()}</span>
                      <span style={styles.notificationTimestamp}>{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                    <p style={styles.notificationMessage}>{n.message}</p>
                    {!n.isRead && (
                      <button style={styles.markAsReadButton} onClick={() => handleMarkNotificationAsRead(n.id)}>Mark as Read</button>
                    )}
                  </div>
                ))
              ) : (
                <p style={styles.emptyStateText}>No new notifications.</p>
              )}
            </div>
            <div style={styles.modalActions}>
              {notifications.length > 0 && (
                <button type="button" onClick={handleClearAllNotifications} style={{ ...styles.modalButton, ...styles.dangerButton }}>Clear All</button>
              )}
              <button type="button" onClick={closeNotificationCenter} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isAIAssistantModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>AI Financial Assistant</h2>
            <p style={styles.modalSubtitle}>Your intelligent companion for all financial queries and insights.</p>
            <div style={styles.aiChatContainer}>
              <div style={styles.aiChatHistory}>
                {aiChatHistory.map((msg, index) => (
                  <div key={index} style={{ ...styles.aiChatMessage, ...(msg.sender === 'user' ? styles.aiChatMessageUser : styles.aiChatMessageAI) }}>
                    <span style={styles.aiChatSender}>{msg.sender === 'user' ? 'You' : 'AI Assistant'}:</span> {msg.message}
                  </div>
                ))}
                {aiIsTyping && (
                  <div style={styles.aiChatMessageAI}>
                    <span style={styles.aiChatSender}>AI Assistant:</span> <span>Typing...</span>
                  </div>
                )}
              </div>
              <form onSubmit={handleAIAssistantMessageSend} style={styles.aiChatInputForm}>
                <input
                  type="text"
                  value={aiChatMessage}
                  onChange={e => setAiChatMessage(e.target.value)}
                  placeholder="Ask me anything about your finances..."
                  style={styles.aiChatInput}
                  disabled={aiIsTyping}
                />
                <button type="submit" style={styles.aiChatSendButton} disabled={aiIsTyping || !aiChatMessage.trim()}>Send</button>
              </form>
            </div>
            <div style={styles.modalActions}>
              <button type="button" onClick={closeAIAssistantModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isSecuritySettingsModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Security Settings</h2>
            <p style={styles.modalSubtitle}>Manage your authentication and fraud protection preferences.</p>
            <div style={styles.settingsGroup}>
              <h3 style={styles.settingsGroupTitle}>Two-Factor Authentication (2FA)</h3>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="enable-2fa"
                  checked={userProfile.securityLevel === '2fa_enabled' || userProfile.securityLevel === 'biometric_enabled'}
                  onChange={e => setUserProfile(prev => ({ ...prev, securityLevel: e.target.checked ? '2fa_enabled' : 'basic' }))}
                  style={styles.checkbox}
                />
                <label htmlFor="enable-2fa" style={styles.checkboxLabel}>Enable 2FA</label>
              </div>
              <p style={styles.infoText}>Requires a code from your authenticator app or SMS for login.</p>
            </div>
            <div style={styles.settingsGroup}>
              <h3 style={styles.settingsGroupTitle}>Biometric Authentication</h3>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="enable-biometrics"
                  checked={userProfile.securityLevel === 'biometric_enabled'}
                  onChange={e => setUserProfile(prev => ({ ...prev, securityLevel: e.target.checked ? 'biometric_enabled' : '2fa_enabled' }))}
                  style={styles.checkbox}
                  disabled={userProfile.securityLevel === 'basic'} // Biometrics usually require 2FA first
                />
                <label htmlFor="enable-biometrics" style={styles.checkboxLabel}>Enable Biometrics (Fingerprint/Face ID)</label>
              </div>
              <p style={styles.infoText}>Requires 2FA to be enabled first. Provides quick and secure access on supported devices.</p>
            </div>
            <div style={styles.settingsGroup}>
              <h3 style={styles.settingsGroupTitle}>AI Fraud Detection Alerts</h3>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="enable-fraud-alerts"
                  checked={userProfile.notificationPreferences.fraudAlerts}
                  onChange={e => setUserProfile(prev => ({ ...prev, notificationPreferences: { ...prev.notificationPreferences, fraudAlerts: e.target.checked } }))}
                  style={styles.checkbox}
                />
                <label htmlFor="enable-fraud-alerts" style={styles.checkboxLabel}>Receive AI Fraud Alerts</label>
              </div>
              <p style={styles.infoText}>Our AI system will notify you of any unusual or potentially fraudulent activity.</p>
            </div>
            <div style={styles.modalActions}>
              <button type="button" onClick={closeSecuritySettingsModal} style={{ ...styles.modalButton, ...styles.secondaryButton }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          &copy; {new Date().getFullYear()} Standard Financial Management System. All rights reserved.
        </p>
        <p style={styles.footerMission}>
          Our goal is to provide functional financial tools. We rely heavily on user input and cannot guarantee efficiency or security beyond industry standards. All financial decisions remain the sole responsibility of the user.
        </p>
      </footer>
    </div>
  );
};


// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    padding: '40px',
    borderRadius: '12px',
    maxWidth: '1200px', // Increased max width
    margin: '40px auto',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', // Enhanced shadow
    color: '#1c1e21',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #e0e2e5',
    paddingBottom: '20px',
  },
  title: {
    color: '#050505',
    fontSize: '2.8rem', // Standard title size
    fontWeight: 700,
    margin: '0 0 10px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#606770',
    fontSize: '1.1rem',
    margin: 0,
    lineHeight: '1.5',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  navButton: {
    padding: '10px 18px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#606770',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
  },
  navButtonActive: {
    backgroundColor: '#e7f3ff',
    color: '#007bff',
    boxShadow: '0 1px 3px rgba(0, 123, 255, 0.1)',
  },
  notificationBadge: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: '#d93025',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  contentArea: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    minHeight: '600px', // Ensure content area has some height
  },
  featureSection: {
    marginBottom: '40px',
  },
  featureTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#1c1e21',
    marginBottom: '10px',
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: '1rem',
    color: '#606770',
    marginBottom: '30px',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 30px auto',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
  },
  dashboardCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  dashboardCardPrimary: {
    gridColumn: 'span 2', // Primary card layout adjustment
    backgroundColor: '#e7f3ff',
    border: '1px solid #cce0ff',
  },
  dashboardCardTitle: {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#007bff',
    margin: 0,
  },
  dashboardValue: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#050505',
    margin: '10px 0 5px 0',
    wordBreak: 'break-all',
  },
  dashboardSubtitle: {
    color: '#606770',
    fontSize: '0.9rem',
    margin: 0,
  },
  dashboardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    fontSize: '0.95rem',
  },
  activityType: {
    fontWeight: 600,
    color: '#007bff',
    minWidth: '80px',
  },
  activityDescription: {
    flexGrow: 1,
    color: '#333',
    margin: '0 10px',
  },
  activityAmount: {
    fontWeight: 600,
    color: '#050505',
  },
  viewAllButton: {
    marginTop: '15px',
    padding: '8px 15px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #007bff',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#007bff',
    transition: 'background-color 0.2s, color 0.2s',
  },
  chartPlaceholder: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
    border: '1px dashed #dee2e6',
  },
  chartText: {
    margin: '5px 0',
    fontStyle: 'italic',
  },
  distributionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '5px 0',
    borderBottom: '1px dotted #e9ecef',
  },
  distributionLabel: {
    fontWeight: 500,
    color: '#333',
  },
  distributionValue: {
    fontWeight: 600,
    color: '#007bff',
  },
  aiInsightText: {
    fontSize: '0.85rem',
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
  },
  budgetOverviewList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  budgetOverviewItem: {
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  budgetOverviewCategory: {
    fontWeight: 600,
    color: '#333',
    marginBottom: '5px',
    display: 'block',
  },
  budgetOverviewProgress: {
    fontSize: '0.9rem',
    color: '#606770',
    marginBottom: '8px',
    display: 'block',
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: '4px',
    transition: 'width 0.3s ease-in-out',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '30px',
  },
  actionButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  balancesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  flag: {
    fontSize: '1.5rem',
  },
  currencyCode: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1c1e21',
  },
  amount: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#050505',
    wordBreak: 'break-all',
  },
  currencyName: {
    color: '#606770',
    fontSize: '0.9rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px', // Slightly wider modals
    boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    marginTop: 0,
    marginBottom: '10px',
    textAlign: 'center',
    color: '#1c1e21',
    fontSize: '1.8rem',
  },
  modalSubtitle: {
    textAlign: 'center',
    color: '#606770',
    fontSize: '0.95rem',
    marginBottom: '20px',
  },
  exchangeRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#606770',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '8px',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputReadOnly: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #eee',
    marginTop: '8px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
    color: '#606770',
  },
  select: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    marginTop: '8px',
    width: '100%',
    boxSizing: 'border-box',
  },
  swapButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '81px', /* Align with input + label */
  },
  swapButton: {
    cursor: 'pointer',
    background: '#f0f2f5',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#007bff',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  rateInfo: {
    textAlign: 'center',
    margin: '16px 0',
    color: '#333',
    fontWeight: 500,
    minHeight: '24px',
    fontSize: '0.95rem',
  },
  feeInfo: {
    color: '#6c757d',
    fontSize: '0.85rem',
    marginLeft: '8px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '24px',
  },
  modalButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    transition: 'background-color 0.2s',
  },
  errorText: {
    color: '#d93025',
    textAlign: 'center',
    fontSize: '0.9rem',
    margin: '10px 0',
  },
  profileSection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #ddd',
  },
  profileTitle: {
    color: '#1c1e21',
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '20px',
    textAlign: 'center',
  },
  profileDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    justifyContent: 'center',
  },
  profileLabel: {
    color: '#606770',
    fontWeight: 500,
  },
  profileValue: {
    color: '#1c1e21',
    fontWeight: 600,
  },
  profileDisclaimer: {
    color: '#333',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginTop: '20px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // New styles for expanded features
  tabButton: {
    padding: '10px 18px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid #e0e2e5',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    color: '#606770',
    transition: 'all 0.2s ease-in-out',
    marginRight: '5px',
  },
  tabButtonActive: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
  },
  exchangeControls: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
    gap: '10px',
  },
  exchangeForm: {
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
  },
  balanceInfo: {
    fontSize: '0.85rem',
    color: '#606770',
    marginTop: '5px',
  },
  aiRecommendationBox: {
    backgroundColor: '#e7f3ff',
    border: '1px solid #cce0ff',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  aiRecommendationTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#007bff',
    margin: '0 0 8px 0',
  },
  aiRecommendationText: {
    fontSize: '0.9rem',
    color: '#333',
    margin: 0,
    lineHeight: '1.5',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '15px',
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
  },
  checkboxLabel: {
    fontSize: '0.95rem',
    color: '#333',
    cursor: 'pointer',
  },
  infoText: {
    fontSize: '0.85rem',
    color: '#6c757d',
    marginTop: '8px',
    lineHeight: '1.4',
  },
  filterControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  transactionTableContainer: {
    overflowX: 'auto',
    marginBottom: '20px',
    border: '1px solid #e0e2e5',
    borderRadius: '8px',
  },
  transactionTable: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px', // Ensure table doesn't get too narrow
  },
  tableHeader: {
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #e0e2e5',
    color: '#333',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.1s',
  },
  tableRowHover: {
    ':hover': {
      backgroundColor: '#f0f2f5',
    },
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '0.9rem',
    color: '#1c1e21',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  statusBadge_completed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusBadge_pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusBadge_failed: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusBadge_active: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusBadge_inactive: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
  emptyStateText: {
    textAlign: 'center',
    padding: '20px',
    color: '#6c757d',
    fontStyle: 'italic',
  },
  paginationControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '8px 15px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
  },
  paginationText: {
    fontSize: '0.9rem',
    color: '#606770',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  analyticsCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eee',
  },
  analyticsCardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#007bff',
    marginBottom: '15px',
  },
  spendingCategoryList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0 0',
    textAlign: 'left',
    width: '100%',
  },
  budgetList: {
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  budgetCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eee',
  },
  budgetCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  budgetCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1c1e21',
    margin: 0,
  },
  budgetCardAmount: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#050505',
    margin: '5px 0 10px 0',
  },
  budgetCardPeriod: {
    fontSize: '0.9rem',
    color: '#606770',
    marginTop: '10px',
  },
  budgetCardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  securityCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eee',
    marginBottom: '15px',
  },
  securityCardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1c1e21',
    marginBottom: '5px',
  },
  securityCardDescription: {
    fontSize: '0.9rem',
    color: '#606770',
    marginBottom: '10px',
  },
  securityStatus: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '15px',
  },
  statusActive: {
    color: '#28a745',
    fontWeight: 700,
  },
  statusInactive: {
    color: '#dc3545',
    fontWeight: 700,
  },
  settingsGroup: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fdfdfd',
  },
  settingsGroupTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#007bff',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  aiChatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '450px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  aiChatHistory: {
    flexGrow: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  aiChatMessage: {
    maxWidth: '80%',
    padding: '10px 15px',
    borderRadius: '15px',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  aiChatMessageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    color: 'white',
    borderBottomRightRadius: 0,
  },
  aiChatMessageAI: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9ecef',
    color: '#1c1e21',
    borderBottomLeftRadius: 0,
  },
  aiChatSender: {
    fontWeight: 600,
    marginRight: '5px',
  },
  aiChatInputForm: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  aiChatInput: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    marginRight: '10px',
    fontSize: '1rem',
  },
  aiChatSendButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#28a745',
    color: '#fff',
  },
  notificationList: {
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  notificationItem: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    marginBottom: '10px',
    borderRadius: '6px',
    backgroundColor: '#fdfdfd',
    borderLeft: '4px solid #007bff',
  },
  notificationItemRead: {
    opacity: 0.7,
    borderLeft: '4px solid #ccc',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  notificationTypeBadge: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  notificationTypeBadge_alert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  notificationTypeBadge_info: {
    backgroundColor: '#cce5ff',
    color: '#004085',
  },
  notificationTypeBadge_warning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  notificationTypeBadge_success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  notificationTimestamp: {
    fontSize: '0.8rem',
    color: '#6c757d',
  },
  notificationMessage: {
    margin: '5px 0',
    fontSize: '0.95rem',
    color: '#333',
  },
  markAsReadButton: {
    marginTop: '8px',
    padding: '5px 10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #e0e2e5',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#606770',
    margin: '0 0 10px 0',
  },
  footerMission: {
    fontSize: '0.8rem',
    color: '#999',
    lineHeight: '1.4',
    maxWidth: '800px',
    margin: '0 auto',
    fontStyle: 'italic',
  }
};