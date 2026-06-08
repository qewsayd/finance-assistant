import { formatMoney } from '../utils/format';

export default function BalanceCard({ balance, income, expense }) {
  return (
    <section className="balance-card">
      <p className="balance-label">Баланс за месяц</p>
      <p className={`balance-value ${balance >= 0 ? 'positive' : 'negative'}`}>
        {formatMoney(balance)}
      </p>
      <div className="balance-row">
        <div>
          <span>Доходы</span>
          <strong className="income">{formatMoney(income)}</strong>
        </div>
        <div>
          <span>Расходы</span>
          <strong className="expense">{formatMoney(expense)}</strong>
        </div>
      </div>
    </section>
  );
}
