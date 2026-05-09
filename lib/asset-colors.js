export function getPinColor(assetClass) {
  const colors = {
    'Industrial': '#FF6B6B',
    'Office': '#4ECDC4',
    'Retail': '#45B7D1',
    'Multifamily': '#FFA07A',
    'Land': '#98D8C8',
    'Mobile Home Park': '#F7DC6F',
    'Self Storage': '#BB8FCE',
    'Medical Office': '#85C1E2',
    'Hotel': '#F8B88B',
    'Mixed Use': '#AED6F1',
    'Hospitality': '#F5B041',
  }
  return colors[assetClass] || '#888888'
}

export const LEGEND_ITEMS = [
  { label: 'Industrial', color: '#FF6B6B' },
  { label: 'Office', color: '#4ECDC4' },
  { label: 'Retail', color: '#45B7D1' },
  { label: 'Multifamily', color: '#FFA07A' },
  { label: 'Land', color: '#98D8C8' },
  { label: 'Mobile Home Park', color: '#F7DC6F' },
  { label: 'Self Storage', color: '#BB8FCE' },
  { label: 'Medical Office', color: '#85C1E2' },
  { label: 'Hotel', color: '#F8B88B' },
  { label: 'Mixed Use', color: '#AED6F1' },
  { label: 'Hospitality', color: '#F5B041' },
]
