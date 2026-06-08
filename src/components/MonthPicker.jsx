import { monthKey, monthLabel } from '../utils/format';

export default function MonthPicker({ value, onChange }) {
  const shift = (delta) => {
    const [y, m] = value.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    onChange(monthKey(d));
  };

  return (
    <div className="month-picker">
      <button type="button" className="btn-icon" onClick={() => shift(-1)}>
        ‹
      </button>
      <span className="month-label">{monthLabel(value)}</span>
      <button
        type="button"
        className="btn-icon"
        onClick={() => shift(1)}
        disabled={value >= monthKey()}
      >
        ›
      </button>
    </div>
  );
}
