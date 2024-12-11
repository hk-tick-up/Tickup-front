"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import '../css/GameLogic.css';
import { MyBalanceProps, BalanceDetail } from '../components/MyBalance'; 
import MyBalance from '../components/MyBalance';
import TradeBar from '../components/TradeBar';

interface InvestmentDetail {
    ticker: string;
    shares: number;
    pricePerShare: number;
    valuationAmount: number;
    averagePurchasePrice: number;
    rateReturn: number;
}

interface MyInvestmentResponse {
    balance: number;
    netAssets: number;
    valuationAmouunt: number;
    returnRate: number;
    investments: InvestmentDetail[];
}

export default function MyInvest() {
    const [investments, setInvestments] = useState<InvestmentDetail[]>([]);
    const [balance, setBalance] = useState(0);
    const [valuationAmount, setValuationAmount] = useState(0);
    const [returnRate, setReturnRate] = useState(0);
    const [netAssets, setNetAssets] = useState(0);

    const fetchInvestments = async () => {
        try {
            const BASE_URL = 'http://localhost:8080';  // TradeBar와 동일하게 설정
            
            const response = await fetch(`${BASE_URL}/api/v1/1/trade/investments?userId=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', errorData);
                throw new Error('투자 내역을 불러오는 데 실패했습니다.');
            }
    
            const data: MyInvestmentResponse = await response.json();
            console.log('Received investment data:', data); // 디버깅용
            setInvestments(data.investments || []);
            setBalance(data.balance || 0);
            setValuationAmount(data.valuationAmouunt || 0);
            setNetAssets(data.netAssets || 0);
            setReturnRate(parseFloat(data.returnRate.toFixed(1)) || 0);
        } catch (error) {
            console.error('투자 내역 로드 오류:', error);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const handleTradeComplete = async (data: any) => {
        try {
            // TradeBar에서 이미 거래 처리를 했으므로, 여기서는 상태만 업데이트
            if (data) {
                setInvestments(data.investments);
                setBalance(data.balance);
                setNetAssets(data.netAssets);
            }
        } catch (error: any) {
            console.error('상태 업데이트 오류:', error);
        }
    
    };

    const myBalanceProps: MyBalanceProps = {
        balance,
        balanceHistory: [] // 실제 데이터로 채워야 함
    };

    return (
        <div className="container">
            <div className="content">
                <div className='my-investment'>
                    <p className='text-medium'>나의 투자 내역</p>
                    <p className='text-amount-large'>{valuationAmount.toLocaleString()}원</p>
                    <p className='text-amount-medium'>{returnRate.toLocaleString()}%</p>
                </div>

                {/* Investment List */}
                <div className="investment-card">
                    {investments.length > 0 ? (
                        investments.map((investment) => (
                            <div
                                key={investment.ticker}
                                className="investment-item"
                            >
                                <div className="investment-image">
                                    <Image
                                        src={`/images/${investment.ticker}.png`}
                                        alt={investment.ticker}
                                        width={45}
                                        height={45}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-medium pb-1">{investment.ticker}</p>
                                            <p className="text-sub">{investment.shares}주</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-medium pb-1">
                                                {investment.valuationAmount.toLocaleString()} 원
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-investments">보유 주식이 없습니다.</p>
                    )}
                </div>

                <TradeBar onTradeComplete={handleTradeComplete} selectedTicker="AAPL" />
                <MyBalance {...myBalanceProps} />
            </div>
        </div>
    );
}