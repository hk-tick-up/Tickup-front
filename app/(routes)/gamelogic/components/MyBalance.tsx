import React, { useState } from "react";
import '../css/MyBalance.css';

interface BalanceDetailProps {
    turn: number;
    totalTurns: number;
    sellAmount: number;
    buyAmount: number;
    previousBalance: number;
}

interface MyBalanceProps {
    balance?: number;
    balanceHistory?: BalanceDetailProps[];
}

const MyBalance: React.FC<MyBalanceProps> = ({
  balance = 1456354, // 기본 잔고
  balanceHistory = [
    { turn: 1, totalTurns: 5, sellAmount: 300000, buyAmount: 568230, previousBalance: 300000 },
    { turn: 2, totalTurns: 5, sellAmount: 300000, buyAmount: 568230, previousBalance: 300000 },
    { turn: 3, totalTurns: 5, sellAmount: 300000, buyAmount: 568230, previousBalance: 300000 },
    { turn: 4, totalTurns: 5, sellAmount: 300000, buyAmount: 568230, previousBalance: 300000 },
    { turn: 5, totalTurns: 5, sellAmount: 300000, buyAmount: 568230, previousBalance: 300000 },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-balance">
      {/* 잔고 섹션 */}
      <div className="balance-header">
        <p className="text-medium">나의 잔고</p>
        <p className="text-amount-large">{balance.toLocaleString()}원</p>
      </div>

      {/* 토글 버튼 */}
      <button
        className="balance-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        지난 턴에 {balanceHistory[balanceHistory.length - 1]?.previousBalance.toLocaleString() || 0}원을
        사용했어요!
        <svg
          className={`toggle-icon ${isOpen ? "icon-rotated" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 토글 내용 */}
      {isOpen && (
        <div className="toggle-content">
          {balanceHistory.map((detail, index) => (
            <div key={index} className="history-item">
              <span className="history-turn">{`${index + 1} 번째 Turn`}</span>
              <span className="sell-amount">-{detail.sellAmount.toLocaleString()}원</span>
              <span className="buy-amount">+{detail.buyAmount.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBalance;
