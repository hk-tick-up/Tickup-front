'use client'

import { useState } from 'react'
import { Smartphone, Pill, TrendingUp, Truck } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import TradeBar from '../components/TradeBar'
import styles from '../css/StockInfoPage.module.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

// 차트 더미 데이터
const chartData = {
'A IT': [380000, 350000, 370000, 365000, 390000, 360000, 385000, 375000, 355000, 356780],
'B 레버': [280000, 290000, 285000, 295000, 300000, 292000, 298000, 305000, 301000, 308000],
'C 제약': [150000, 155000, 153000, 158000, 160000, 157000, 162000, 159000, 165000, 163000],
'D 유통': [90000, 92000, 91000, 93000, 95000, 94000, 96000, 98000, 97000, 99000],
}

// 주가 정보 더미 데이터
const stockInfo = {
'A IT': { price: 356780, change: -2360, changePercent: -27.9 },
'B 레버': { price: 308000, change: 7000, changePercent: 2.3 },
'C 제약': { price: 163000, change: -2000, changePercent: -1.2 },
'D 유통': { price: 99000, change: 2000, changePercent: 2.1 },
}

// 뉴스 더미 데이터
const newsData = {
'A IT': [
    { id: 1, content: '"세계 반도체 시장 첫 1500억 달러 돌파... A IT, 인텔 제치고 1위 달성!"' },
    { id: 2, content: '"A IT, 폴더블 디스플레이의 적용해 화면 커우는 스마트워치 특허출원!"' },
    { id: 3, content: '"A IT 새 CEO, 내부 비전자계열사도 \'올킬\'이 예정"' },
],
'B 레버': [
    { id: 1, content: '"B 레버, 신규 투자 상품 출시로 시장 점유율 상승"' },
    { id: 2, content: '"금융당국, B 레버 신규 상품에 대한 긍정적 평가"' },
    { id: 3, content: '"B 레버 CEO, "올해 실적 전망 밝다" 발언"' },
],
'C 제약': [
    { id: 1, content: '"C 제약, 신약 임상 3상 성공... FDA 승인 기대"' },
    { id: 2, content: '"글로벌 제약사, C 제약과 기술 제휴 체결"' },
    { id: 3, content: '"C 제약 연구진, 혁신적 신약 개발 논문 발표"' },
],
'D 유통': [
    { id: 1, content: '"D 유통, 온라인 플랫폼 리뉴얼로 매출 상승세"' },
    { id: 2, content: '"D 유통, 친환경 포장재 도입으로 ESG 경영 강화"' },
    { id: 3, content: '"D 유통 새 물류센터 오픈, 배송 시간 단축 기대"' },
],
}

export default function StockInfo() {
    const [selectedCategory, setSelectedCategory] = useState('A IT')

    const categoryIcons = {
    'A IT': Smartphone,
    'B 레버': TrendingUp,
    'C 제약': Pill,
    'D 유통': Truck,
    }

    const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
        display: false,
        },
        title: {
        display: false,
        },
    },
    scales: {
        x: {
        display: false,
        },
        y: {
        display: false,
        },
    },
    elements: {
        line: {
        tension: 0.4,
        },
        point: {
        radius: 0,
        },
    },
    }

    const getChartData = (category) => ({
    labels: ['', '', '', '', '', '', '', '', '', ''],
    datasets: [
        {
        data: chartData[category],
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
        },
    ],
    })

    return (
    <div className={styles.container}>
        <TradeBar />

        {/* 종목 카테고리 */}
        <div className={styles.tradeBarContainer}>
        {Object.entries(categoryIcons).map(([category, Icon]) => (
            <div
            key={category}
            className={styles.categoryItem}
            onClick={() => setSelectedCategory(category)}
            >
            <div
                className={`${styles.categoryIconContainer} ${
                selectedCategory === category
                    ? styles.categoryIconActive
                    : styles.categoryIconInactive
                }`}
            >
                <Icon
                className={`${
                    selectedCategory === category
                    ? styles.iconActive
                    : styles.iconInactive
                }`}
                />
            </div>
            <span className={styles.categoryLabel}>{category}</span>
            </div>
        ))}
        </div>

        {/* 주가 정보 */}
        <div>
        <h1 className={styles.stockHeader}>{selectedCategory} 주가</h1>
        <div className={styles.stockPrice}>
            {stockInfo[selectedCategory].price.toLocaleString()}원
        </div>
        <div
            className={`${
            stockInfo[selectedCategory].change > 0
                ? styles.priceChangePositive
                : styles.priceChangeNegative
            }`}
        >
            {stockInfo[selectedCategory].change > 0 ? '+' : ''}
            {stockInfo[selectedCategory].change.toLocaleString()}원 (
            {stockInfo[selectedCategory].changePercent}%)
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
            {newsData[selectedCategory].map((news) => (
                <p key={news.id} className={styles.newsItem}>
                {news.content}
                </p>
            ))}
            </div>
        </div>
        </div>
    </div>
    )
}