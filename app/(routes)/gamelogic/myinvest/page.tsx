"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import '../css/GameLogic.css';
import MyBalance from '../components/MyBalance';

interface MyInvestment {
    userId: number;
    companyId: number;
    name: string;
    image: string; // base64 인코딩 이미지 데이터라고 일단 가정
    amount: number;
    profit: number;
    shareHold: number;
    profitPercentage: number;
}

interface MyStockBalance {
    userId: number;
    myStockBalance: number;
    profit: number;
    balance: number;
    previousBalance?: number;
}

export default function Myinvest() {
    const [investments, setInvestments] = useState<MyInvestment[]>([]);
    const [stockBalance, setStockBalance] = useState<MyStockBalance>({
        // 초기값 설정
        userId: 1, //test용 초기 dummydata
        myStockBalance: 1144,
        profit: 443,
        balance: 1456354,
        previousBalance: 300000,
    });

    useEffect(() => {
        // 화면 출력 예시를 위한 dummy data
        const userInvestments: MyInvestment[] = [
            { userId: 1, companyId: 1, name: '나이키', image: '/images/gamelogic/dummy_nike_logo.png', amount: 1000000, profit: -489, profitPercentage: -32.4, shareHold: 2},
            { userId: 1, companyId: 2, name: '애플', image: '/images/gamelogic/dummy_apple_logo.png', amount: 2000000, profit: -489, profitPercentage: -32.4, shareHold: 10 },
        ];

        setInvestments(userInvestments);

    }, []);



    return (
        <div className="container">
            <div className="content">

                <div className='my-investment'>
                    <p className='text-medium'>나의 투자 내역</p>
                    <p className='text-amount-large'>{stockBalance.myStockBalance.toLocaleString()}원</p>
                    <p className={`'text-profit-large' ${
                        stockBalance.profit >=0 
                            ? 'text-profit-positive-large mt-1'
                            : 'text-profit-negative-large mt-1'
                    }`}
                    >{stockBalance.profit.toLocaleString()}원</p>
                </div>

                {/* Investment List */}
                <div className="investment-card">
                    {investments.map((investment) => (
                    <div
                        key={investment.companyId}
                        className="investment-item"
                    >
                        <div className="investment-image">
                        <Image
                            src={investment.image}
                            alt={investment.name}
                            width={45}
                            height={45}
                        />
                        </div>

                        <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                            <p className="text-medium pb-1">{investment.name}</p>
                            <p className="text-sub">{investment.shareHold}주</p>
                            </div>
                            <div className="text-right">
                            <p className="text-medium pb-1">
                                {investment.amount.toLocaleString()} 원
                            </p>
                            <p className={`'text-profit-large' ${
                                investment.profit >=0 
                                ? 'text-profit-positive'
                                : 'text-profit-negative'
                            }`}>
                                {investment.profit.toLocaleString()}원 (
                                {investment.profitPercentage}%)
                            </p>
                            
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                <MyBalance />



            </div>
        </div>
    );
}
