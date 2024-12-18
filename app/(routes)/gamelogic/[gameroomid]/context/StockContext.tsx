/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState } from 'react';

interface StockContextType {
    stockData: { [key: string]: any };
    setStockData: (data: any) => void;
    chartHistory: { [key: string]: number[] };
    setChartHistory: (data: any) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stockData, setStockData] = useState<{ [key: string]: any }>({});
    const [chartHistory, setChartHistory] = useState<{ [key: string]: number[] }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <StockContext.Provider value={{
            stockData,
            setStockData,
            chartHistory,
            setChartHistory,
            selectedCategory,
            setSelectedCategory,
            isLoading,
            setIsLoading,
        }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStockContext = () => {
    const context = useContext(StockContext);
    if (!context) {
        throw new Error('useStockContext must be used within a StockProvider');
    }
    return context;
};
