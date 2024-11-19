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
    <div className="flex flex-col min-h-screen bg-gray-50">
    <TradeBar />
    
    {/* 종목 카테고리 */}
    <div className="flex justify-between px-4 py-6 bg-white">
        {Object.entries(categoryIcons).map(([category, Icon]) => (
        <div
            key={category}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedCategory(category)}
        >
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
            selectedCategory === category ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
            <Icon className={`w-6 h-6 ${
                selectedCategory === category ? 'text-white' : 'text-gray-600'
            }`} />
            </div>
            <span className="text-xs mt-1">{category}</span>
        </div>
        ))}
    </div>

    {/* 주가 정보 */}
    <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-2">{selectedCategory} 주가</h1>
        <div className="text-3xl font-bold mb-1">
        {stockInfo[selectedCategory].price.toLocaleString()}원
        </div>
        <div className={`${
        stockInfo[selectedCategory].change > 0 ? 'text-red-500' : 'text-blue-500'
        } mb-6`}>
        {stockInfo[selectedCategory].change > 0 ? '+' : ''}
        {stockInfo[selectedCategory].change.toLocaleString()}원 (
        {stockInfo[selectedCategory].changePercent}%)
        </div>

        {/* 차트 */}
        <div className="h-32 mb-6">
        <Line options={chartOptions} data={getChartData(selectedCategory)} />
        </div>

        {/* 뉴스 섹션 */}
        <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3 flex items-center">
            <span className="mr-2">📰</span>
            오늘의 시장 상황
        </h2>
        <div className="space-y-3">
            {newsData[selectedCategory].map((news) => (
            <p key={news.id} className="text-sm text-gray-600 leading-relaxed">
                {news.content}
            </p>
            ))}
        </div>
        </div>
    </div>
    </div>
)
}