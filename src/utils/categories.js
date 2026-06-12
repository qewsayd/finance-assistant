export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Питание', icon: '🍽️' },
  { id: 'transport', label: 'Транспорт', icon: '🚌' },
  { id: 'shopping', label: 'Покупки', icon: '🛍️' },
  { id: 'entertainment', label: 'Развлечения', icon: '🎬' },
  { id: 'other', label: 'Другое', icon: '📦' },
];

export function getCategoryLabel(id) {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryIcon(id) {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.icon ?? '📦';
}

export const CHART_COLORS = [
  '#2d6a4f',
  '#40916c',
  '#52b788',
  '#74c69d',
  '#95d5b2',
];
