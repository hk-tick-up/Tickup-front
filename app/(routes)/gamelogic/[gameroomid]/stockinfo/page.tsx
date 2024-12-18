/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useWebSocket } from '../context/WebSocketContext';
import { useStockContext } from '../context/StockContext';
import { usePathname } from 'next/navigation';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from '../css/StockInfoPage.module.css';
import TradeBar from '../components/TradeBar'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function StockInfo() {
    const {
        stockData,
        setStockData,
        chartHistory,
        setChartHistory,
        selectedCategory,
        setSelectedCategory,
        isLoading,
        setIsLoading,
    } = useStockContext();

    // 초기값 설정 (첫 번째 주식으로 기본값 설정)
    useEffect(() => {
        if (Object.keys(stockData).length > 0 && !selectedCategory) {
            setSelectedCategory(Object.keys(stockData)[0]);
        }
    }, [stockData, selectedCategory]);

    const { stompClient } = useWebSocket();
    const pathname = usePathname();
    const gameRoomId = pathname.split('/')[2];

    useEffect(() => {
        if (!stompClient || !gameRoomId) return;

        let stockSubscription: any;

        const handleStockUpdate = (message: any) => {
            try {
                const update = JSON.parse(message.body);
                setStockData(update.companyTurnResponse);

                if (Object.keys(update.companyTurnResponse).length > 0) {
                    setSelectedCategory(Object.keys(update.companyTurnResponse)[0]);
                }

                setChartHistory((prevHistory: any) => {
                    const newHistory = { ...prevHistory };
                    Object.entries(update.companyTurnResponse).forEach(([ticker, data]) => {
                        const stockdata = data as {stockPrice:number};
                        if (!newHistory[ticker]) newHistory[ticker] = [];
                        newHistory[ticker] = [...(newHistory[ticker] || []), stockdata.stockPrice];
                        if (newHistory[ticker].length > 10) {
                            newHistory[ticker] = newHistory[ticker].slice(-10);
                        }
                    });
                    return newHistory;
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error processing stock update:', error);
            }
        };

        const subscribeToWebSocket = () => {
            stockSubscription = stompClient.subscribe(
                `/topic/gameRoom/${gameRoomId}/stockUpdate`,
                handleStockUpdate
            );

            // 요청 초기 데이터
            stompClient.publish({
                destination: `/app/gameRoom/${gameRoomId}/fetchInitialTurnData`,
                body: JSON.stringify({ gameRoomId }),
            });
        };

        if (stompClient.connected) {
            subscribeToWebSocket();
        } else {
            stompClient.onConnect = subscribeToWebSocket;
        }

        return () => {
            if (stockSubscription) stockSubscription.unsubscribe();
        };
    }, [stompClient, gameRoomId]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        elements: {
            line: { tension: 0.4 },
            point: { radius: 0 },
        },
    };

    const getChartData = (category: string) => ({
        labels: new Array(Math.max(1, chartHistory[category]?.length || 0)).fill(''),
        datasets: [
            {
                data: chartHistory[category] || [],
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 2,
            },
        ],
    });

    if (isLoading) {
        return <div>Loading stock data...</div>;
    }

    const currentStock = stockData[selectedCategory];
    if (!currentStock) {
        return <div>No stock data available</div>;
    }

    return (
        <div className={styles.container}>
            <TradeBar selectedTicker={selectedCategory} onTradeComplete={() => console.log("거래 완료!")} />

            {/* 종목 카테고리 */}
            <div className={styles.tradeBarContainer}>
                {Object.keys(stockData).map((ticker) => (
                    <div
                        key={ticker}
                        className={styles.categoryItem}
                        onClick={() => setSelectedCategory(ticker)}
                    >
                        <div
                            className={`${styles.categoryContainer} ${
                                selectedCategory === ticker ? styles.selected : ''
                            }`}
                        >
                            <span className={styles.categoryLabel}>{stockData[ticker]?.companyName || ticker}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 주가 정보 */}
            <div>
                <h1 className={styles.stockHeader}>{stockData[selectedCategory]?.companyName || selectedCategory} 주가</h1>
                <div className={styles.stockPrice}>
                    {currentStock.stockPrice.toLocaleString()}원
                </div>
                <div
                    className={`${
                        currentStock.changeRate > 0
                            ? styles.priceChangePositive
                            : styles.priceChangeNegative
                    }`}
                >
                    {currentStock.changeRate > 0 ? '+' : ''}
                    {currentStock.changeRate}%
                </div>

                {/* 차트 */}
                <div className={styles.chartContainer}>
                    <Line options={chartOptions} data={getChartData(selectedCategory)} />
                </div>

                {/* 뉴스 섹션 */}
                <div className={styles.newsSection}>
                    <h2 className={styles.newsHeader}>
                        <span className="mr-2">📰</span>
                        오늘의 시장 상황
                    </h2>
                    <div className={styles.newsContent}>
                        {currentStock.eventContent ? (
                            <p className={styles.newsItem}>{currentStock.eventContent}</p>
                        ) : (
                            <p className={styles.newsItem}>이 기업에 대한 이벤트가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
