import { MarketData } from '@/components/MarketCalendar';

// Export data as CSV
export const exportToCSV = (data: MarketData[], filename: string = 'market-data') => {
  const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Volatility (%)', 'Liquidity', 'Performance (%)'];
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.date,
      row.open.toFixed(2),
      row.high.toFixed(2),
      row.low.toFixed(2),
      row.close.toFixed(2),
      row.volume,
      (row.volatility * 100).toFixed(2),
      row.liquidity.toFixed(1),
      (row.performance * 100).toFixed(2)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data as JSON
export const exportToJSON = (data: MarketData[], filename: string = 'market-data') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export calendar view as image
export const exportCalendarAsImage = (elementId: string, filename: string = 'calendar-view') => {
  // This would require html2canvas library
  // For now, we'll provide a placeholder that could be implemented
  console.log('Image export would require html2canvas library');
  alert('Image export functionality would be implemented with html2canvas library');
};

// Generate PDF report
export const exportToPDF = (data: MarketData[], instrument: string, dateRange: string) => {
  // This would require jsPDF library
  // For now, we'll provide a placeholder
  console.log('PDF export would require jsPDF library');
  alert(`PDF export for ${instrument} (${dateRange}) would be implemented with jsPDF library`);
};

// Export summary statistics
export const exportSummaryStats = (data: MarketData[], filename: string = 'summary-stats') => {
  const stats = calculateSummaryStats(data);
  const csvContent = [
    'Metric,Value',
    `Average Price,${stats.avgPrice.toFixed(2)}`,
    `Total Volume,${stats.totalVolume}`,
    `Average Volatility,${(stats.avgVolatility * 100).toFixed(2)}%`,
    `Average Liquidity,${stats.avgLiquidity.toFixed(1)}`,
    `Total Return,${(stats.totalReturn * 100).toFixed(2)}%`,
    `Max Drawdown,${(stats.maxDrawdown * 100).toFixed(2)}%`,
    `Sharpe Ratio,${stats.sharpeRatio.toFixed(2)}`,
    `Win Rate,${(stats.winRate * 100).toFixed(1)}%`,
    `Best Day,${(stats.bestDay * 100).toFixed(2)}%`,
    `Worst Day,${(stats.worstDay * 100).toFixed(2)}%`
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Calculate summary statistics
export const calculateSummaryStats = (data: MarketData[]) => {
  if (data.length === 0) return null;

  const prices = data.map(d => d.close);
  const returns = data.map(d => d.performance);
  const volumes = data.map(d => d.volume);
  const volatilities = data.map(d => d.volatility);
  const liquidities = data.map(d => d.liquidity);

  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
  const avgVolatility = volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length;
  const avgLiquidity = liquidities.reduce((sum, liq) => sum + liq, 0) / liquidities.length;
  
  const totalReturn = (prices[prices.length - 1] - prices[0]) / prices[0];
  
  // Calculate max drawdown
  let peak = prices[0];
  let maxDrawdown = 0;
  for (const price of prices) {
    if (price > peak) peak = price;
    const drawdown = (peak - price) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Calculate Sharpe ratio (simplified)
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const returnStd = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);
  const sharpeRatio = returnStd > 0 ? avgReturn / returnStd : 0;

  const winRate = returns.filter(ret => ret > 0).length / returns.length;
  const bestDay = Math.max(...returns);
  const worstDay = Math.min(...returns);

  return {
    avgPrice,
    totalVolume,
    avgVolatility,
    avgLiquidity,
    totalReturn,
    maxDrawdown,
    sharpeRatio,
    winRate,
    bestDay,
    worstDay
  };
};