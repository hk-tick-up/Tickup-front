"use client";

import { useState, useEffect } from 'react';
import '../css/GameLogic.css';

interface Investment {
    id: number;
    name: string;
    amount: number;
    profit: number;
}

export default function Home() {
    const [investments, setInvestments] = useState<Investment[]>([]);

    useEffect(() => {
        const dummyData = [
            { id: 1, name: '나이키', amount: 1000000, profit: 50000 },
            { id: 2, name: '애플', amount: 2000000, profit: -30000 },
        ];
        setInvestments(dummyData);
    }, []);

    return (
        <div className="container">
            <div className="content">
                <div className="investment-card">
                    {investments.length > 0 ? (
                        investments.map((investment) => (
                            <div key={investment.id} className="investment-item">
                                <h2 className="investment-name">{investment.name}</h2>
                                <p className="investment-amount">투자 금액: {investment.amount.toLocaleString()}원</p>
                                <p
                                    className={`investment-profit ${
                                        investment.profit >= 0
                                            ? 'text-profit-positive'
                                            : 'text-profit-negative'
                                    }`}
                                >
                                    수익: {investment.profit.toLocaleString()}원
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="no-investments">투자 내역이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
