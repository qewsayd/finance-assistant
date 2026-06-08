import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, getCategoryLabel } from '../utils/categories';
import { formatMoney } from '../utils/format';

export default function CategoryChart({ byCategory }) {
  const data = Object.entries(byCategory).map(([id, value]) => ({
    name: getCategoryLabel(id),
    value,
  }));

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Нет расходов за выбранный месяц</p>
      </div>
    );
  }

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatMoney(v)} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="chart-legend">
        {data.map((item, i) => (
          <li key={item.name}>
            <span
              className="legend-dot"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {item.name}: {formatMoney(item.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}
