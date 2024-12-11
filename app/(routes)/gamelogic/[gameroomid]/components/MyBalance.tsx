import React, { useState } from "react";
import '../css/MyBalance.css';

export interface BalanceDetail {
    turn: number;
    totalTurns: number;
    sellAmount: number;
    buyAmount: number;
    previousBalance: number;
}

export interface MyBalanceProps {
    balance: number;
    balanceHistory: BalanceDetail[];
}

const MyBalance: React.FC<MyBalanceProps> = ({ balance, balanceHistory }) => {
    const [isOpen, setIsOpen] = useState(false);

    const lastTurnDetail = balanceHistory.length > 0 ? balanceHistory[balanceHistory.length - 1] : null;

    const toggleContent = () => {
        setIsOpen((prevState) => !prevState);
    };

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
                onClick={toggleContent}
            >
                {lastTurnDetail
                    ? `지난 턴에 ${lastTurnDetail.previousBalance.toLocaleString()}원을 사용했어요!`
                    : '지난 턴 정보가 없습니다.'}
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
                            <span className="history-turn">{`${detail.turn} 번째 Turn`}</span>
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