import { formatMoney } from '../utils/format';

export default function StatCards({ income, expense, balance }) {
  return (
    <div className="stat-cards">
      <article className="stat-card income-card">
        <span>Доходы</span>
        <strong className="income">{formatMoney(income)}</strong>
      </article>
      <article className="stat-card expense-card">
        <span>Расходы</span>
        <strong className="expense">{formatMoney(expense)}</strong>
      </article>
      <article className="stat-card balance-card-mini">
        <span>Баланс</span>
        <strong className={balance >= 0 ? 'income' : 'expense'}>
          {formatMoney(balance)}
        </strong>
      </article>
    </div>
  );
}
