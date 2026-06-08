export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Питание' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'shopping', label: 'Покупки' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'other', label: 'Другое' },
];

export function getCategoryLabel(id) {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export const CHART_COLORS = [
  '#2d6a4f',
  '#40916c',
  '#52b788',
  '#74c69d',
  '#95d5b2',
];
