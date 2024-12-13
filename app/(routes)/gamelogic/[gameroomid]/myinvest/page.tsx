"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import '../css/GameLogic.css';
import { MyBalanceProps, BalanceDetail } from '../components/MyBalance'; 
import MyBalance from '../components/MyBalance';
import TradeBar from '../components/TradeBar';
import { useWebSocket } from '../context/WebSocketContext';
import { usePathname } from 'next/navigation';

interface InvestmentDetail {
    ticker: string;
    companyName: string;
    shares: number;
    pricePerShare: number;
    valuationAmount: number;
    averagePurchasePrice: number;
    rateReturn: number;
}

interface MyInvestmentResponse {
    balance: number;
    netAssets: number;
    valuationAmount: number;
    returnRate: number;
    investments: InvestmentDetail[];
}

export default function MyInvest() {
const [investments, setInvestments] = useState<InvestmentDetail[]>([]);
const [balance, setBalance] = useState(0);
const [valuationAmount, setValuationAmount] = useState(0);
const [returnRate, setReturnRate] = useState(0);
const [netAssets, setNetAssets] = useState(0);
const { stompClient } = useWebSocket();
const pathname = usePathname();
const gameRoomId = pathname.split('/')[2];

const fetchInvestments = async () => {
    try {
        const BASE_URL = 'http://localhost:8080';  
        
        const response = await fetch(`${BASE_URL}/api/v1/${gameRoomId}/trade/investments?userId=1`, {
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
        setValuationAmount(data.valuationAmount || 0);
        setNetAssets(data.netAssets || 0);
        setReturnRate(data.returnRate || 0);
    } catch (error) {
        console.error('투자 내역 로드 오류:', error);
    }
};

useEffect(() => {
    fetchInvestments();
}, []);

// 턴 변경 및 투자 정보 업데이트를 위한 웹소켓 구독
useEffect(() => {
    if (!stompClient || !gameRoomId) {
        console.log('StompClient or gameRoomId not available');
        return;
    }

    let subscription: any;
    let connectionCheckInterval: NodeJS.Timeout;

    const subscribe = () => {
        if (stompClient.connected) {
            try {
                subscription = stompClient.subscribe(
                    `/topic/gameRoom/${gameRoomId}/player/1/investments`,
                    (message) => {
                        try {
                            const data: MyInvestmentResponse = JSON.parse(message.body);
                            console.log('Investment update received:', data);
                            
                            setInvestments(data.investments || []);
                            setBalance(data.balance || 0);
                            setValuationAmount(data.valuationAmount || 0);
                            setNetAssets(data.netAssets || 0);
                            setReturnRate(data.returnRate || 0);
                        } catch (error) {
                            console.error('Error processing investment update:', error);
                        }
                    }
                );
                console.log('Successfully subscribed to investment updates');
            } catch (error) {
                console.error('Error subscribing to investment updates:', error);
            }
        }
    };

    connectionCheckInterval = setInterval(() => {
        if (stompClient.connected && !subscription) {
            subscribe();
        }
    }, 1000);

    return () => {
        clearInterval(connectionCheckInterval);
        if (subscription) {
            try {
                subscription.unsubscribe();
                console.log('Unsubscribed from investment updates');
            } catch (error) {
                console.error('Error unsubscribing:', error);
            }
        }
    };
}, [stompClient, gameRoomId]);

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
                <p className={`text-profit-large ${
                    returnRate >= 0 
                        ? 'text-profit-positive-large mt-1'
                        : 'text-profit-negative-large mt-1'
                }`}
                >수익률: {returnRate.toFixed(2)}%</p>
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
                                    src={`/images/${investment.companyName}.png`}
                                    alt={investment.ticker}
                                    width={45}
                                    height={45}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-medium pb-1">{investment.companyName}</p>
                                        <p className="text-sub">{investment.shares}주</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-medium pb-1">
                                            {investment.valuationAmount.toLocaleString()} 원
                                        </p>
                                        <p className={`'text-profit-large' ${
                                            investment.rateReturn >=0 
                                            ? 'text-profit-positive'
                                            : 'text-profit-negative'
                                        }`}>
                                            {/* {investment.rateReturn.toLocaleString()}원 ( */}
                                            {(investment.rateReturn).toFixed(2)}%
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
            <MyBalance {...myBalanceProps} />
        </div>
    </div>
);
}