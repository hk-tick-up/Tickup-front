// context/InvestmentContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

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

interface InvestmentContextProps {
    investments: InvestmentDetail[];
    balance: number;
    netAssets: number;
    valuationAmount: number;
    returnRate: number;
    fetchInvestments: (gameRoomId: string) => Promise<void>;
}

const InvestmentContext = createContext<InvestmentContextProps | undefined>(undefined);

export const InvestmentProvider = ({ children }: { children: React.ReactNode }) => {
    const [investments, setInvestments] = useState<InvestmentDetail[]>([]);
    const [balance, setBalance] = useState(0);
    const [valuationAmount, setValuationAmount] = useState(0);
    const [returnRate, setReturnRate] = useState(0);
    const [netAssets, setNetAssets] = useState(0);

    const fetchInvestments = useCallback(async (gameRoomId: string) => {
        try {
            const BASE_URL = 'http://localhost:8080';
            const token = sessionStorage.getItem('jwtToken');

            if (!token) {
                throw new Error('JWT token not found');
            }

            const response = await fetch(
                `${BASE_URL}/api/v1/gamelogic/${gameRoomId}/trade/investments`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch investments');
            }

            const data: MyInvestmentResponse = await response.json();
            setInvestments(data.investments || []);
            setBalance(data.balance || 0);
            setValuationAmount(data.valuationAmount || 0);
            setNetAssets(data.netAssets || 0);
            setReturnRate(data.returnRate || 0);
        } catch (error) {
            console.error('Error fetching investments:', error);
        }
    }, []);

    return (
        <InvestmentContext.Provider
            value={{ investments, balance, netAssets, valuationAmount, returnRate, fetchInvestments }}
        >
            {children}
        </InvestmentContext.Provider>
    );
};

export const useInvestments = () => {
    const context = useContext(InvestmentContext);
    if (!context) {
        throw new Error('useInvestments must be used within an InvestmentProvider');
    }
    return context;
};
