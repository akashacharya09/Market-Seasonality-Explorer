// Comprehensive cryptocurrency data for the application
export const cryptoCurrencies = [
  // Major Cryptocurrencies
  { value: 'BTC-USD', label: 'Bitcoin (BTC)', category: 'Major' },
  { value: 'ETH-USD', label: 'Ethereum (ETH)', category: 'Major' },
  { value: 'BNB-USD', label: 'Binance Coin (BNB)', category: 'Major' },
  { value: 'XRP-USD', label: 'Ripple (XRP)', category: 'Major' },
  { value: 'ADA-USD', label: 'Cardano (ADA)', category: 'Major' },
  { value: 'SOL-USD', label: 'Solana (SOL)', category: 'Major' },
  { value: 'DOGE-USD', label: 'Dogecoin (DOGE)', category: 'Major' },
  { value: 'DOT-USD', label: 'Polkadot (DOT)', category: 'Major' },
  { value: 'MATIC-USD', label: 'Polygon (MATIC)', category: 'Major' },
  { value: 'SHIB-USD', label: 'Shiba Inu (SHIB)', category: 'Major' },
  
  // DeFi Tokens
  { value: 'UNI-USD', label: 'Uniswap (UNI)', category: 'DeFi' },
  { value: 'LINK-USD', label: 'Chainlink (LINK)', category: 'DeFi' },
  { value: 'AAVE-USD', label: 'Aave (AAVE)', category: 'DeFi' },
  { value: 'CRV-USD', label: 'Curve DAO (CRV)', category: 'DeFi' },
  { value: 'SUSHI-USD', label: 'SushiSwap (SUSHI)', category: 'DeFi' },
  { value: 'COMP-USD', label: 'Compound (COMP)', category: 'DeFi' },
  { value: 'MKR-USD', label: 'Maker (MKR)', category: 'DeFi' },
  { value: 'SNX-USD', label: 'Synthetix (SNX)', category: 'DeFi' },
  
  // Layer 1 Blockchains
  { value: 'AVAX-USD', label: 'Avalanche (AVAX)', category: 'Layer 1' },
  { value: 'LUNA-USD', label: 'Terra (LUNA)', category: 'Layer 1' },
  { value: 'ALGO-USD', label: 'Algorand (ALGO)', category: 'Layer 1' },
  { value: 'ATOM-USD', label: 'Cosmos (ATOM)', category: 'Layer 1' },
  { value: 'NEAR-USD', label: 'NEAR Protocol (NEAR)', category: 'Layer 1' },
  { value: 'FTM-USD', label: 'Fantom (FTM)', category: 'Layer 1' },
  { value: 'HBAR-USD', label: 'Hedera (HBAR)', category: 'Layer 1' },
  
  // Layer 2 Solutions
  { value: 'LRC-USD', label: 'Loopring (LRC)', category: 'Layer 2' },
  { value: 'IMX-USD', label: 'Immutable X (IMX)', category: 'Layer 2' },
  { value: 'OP-USD', label: 'Optimism (OP)', category: 'Layer 2' },
  
  // Meme Coins
  { value: 'PEPE-USD', label: 'Pepe (PEPE)', category: 'Meme' },
  { value: 'FLOKI-USD', label: 'Floki (FLOKI)', category: 'Meme' },
  { value: 'BABYDOGE-USD', label: 'Baby Doge (BABYDOGE)', category: 'Meme' },
  
  // Gaming & NFT
  { value: 'AXS-USD', label: 'Axie Infinity (AXS)', category: 'Gaming' },
  { value: 'SAND-USD', label: 'The Sandbox (SAND)', category: 'Gaming' },
  { value: 'MANA-USD', label: 'Decentraland (MANA)', category: 'Gaming' },
  { value: 'ENJ-USD', label: 'Enjin Coin (ENJ)', category: 'Gaming' },
  { value: 'GALA-USD', label: 'Gala (GALA)', category: 'Gaming' },
  
  // Privacy Coins
  { value: 'XMR-USD', label: 'Monero (XMR)', category: 'Privacy' },
  { value: 'ZEC-USD', label: 'Zcash (ZEC)', category: 'Privacy' },
  { value: 'DASH-USD', label: 'Dash (DASH)', category: 'Privacy' },
  
  // Exchange Tokens
  { value: 'CRO-USD', label: 'Cronos (CRO)', category: 'Exchange' },
  { value: 'FTT-USD', label: 'FTX Token (FTT)', category: 'Exchange' },
  { value: 'HT-USD', label: 'Huobi Token (HT)', category: 'Exchange' },
  { value: 'OKB-USD', label: 'OKB (OKB)', category: 'Exchange' },
  
  // Stablecoins
  { value: 'USDT-USD', label: 'Tether (USDT)', category: 'Stablecoin' },
  { value: 'USDC-USD', label: 'USD Coin (USDC)', category: 'Stablecoin' },
  { value: 'BUSD-USD', label: 'Binance USD (BUSD)', category: 'Stablecoin' },
  { value: 'DAI-USD', label: 'Dai (DAI)', category: 'Stablecoin' },
  
  // Traditional Assets
  { value: 'SPY', label: 'S&P 500 ETF (SPY)', category: 'Traditional' },
  { value: 'QQQ', label: 'Nasdaq ETF (QQQ)', category: 'Traditional' },
  { value: 'AAPL', label: 'Apple Inc. (AAPL)', category: 'Traditional' },
  { value: 'TSLA', label: 'Tesla Inc. (TSLA)', category: 'Traditional' },
  { value: 'MSFT', label: 'Microsoft (MSFT)', category: 'Traditional' },
  { value: 'GOOGL', label: 'Alphabet (GOOGL)', category: 'Traditional' },
  { value: 'AMZN', label: 'Amazon (AMZN)', category: 'Traditional' },
  { value: 'META', label: 'Meta Platforms (META)', category: 'Traditional' },
  { value: 'NVDA', label: 'NVIDIA (NVDA)', category: 'Traditional' },
  { value: 'NFLX', label: 'Netflix (NFLX)', category: 'Traditional' },
];

export const getCategorizedCurrencies = () => {
  const categories = [...new Set(cryptoCurrencies.map(c => c.category))];
  return categories.reduce((acc, category) => {
    acc[category] = cryptoCurrencies.filter(c => c.category === category);
    return acc;
  }, {} as Record<string, typeof cryptoCurrencies>);
};

export const searchCurrencies = (query: string) => {
  return cryptoCurrencies.filter(currency =>
    currency.label.toLowerCase().includes(query.toLowerCase()) ||
    currency.value.toLowerCase().includes(query.toLowerCase())
  );
};