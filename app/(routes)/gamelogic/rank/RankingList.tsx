'use client';

import styles from '../css/RankingList.module.css'; // module.css 스타일 가져오기
import { useState } from 'react';
import { ChevronDown, ChevronUp, Minus } from 'lucide-react';

// 더미 데이터 타입 정의
type PortfolioItem = {
category: string;
amount: number;
percentage: number;
};

type UserRanking = {
id: number;
rank: number;
username: string;
profileImage: string;
totalAmount: number;
portfolio: PortfolioItem[];
trend: 'up' | 'down' | 'neutral';
};

// 메달 컴포넌트
function RankMedal({ rank }: { rank: number }) {
if (rank === 1) {
    return <span className={styles.goldMedal}>🥇</span>;
} else if (rank === 2) {
    return <span className={styles.silverMedal}>🥈</span>;
} else if (rank === 3) {
    return <span className={styles.bronzeMedal}>🥉</span>;
}
return <span className={styles.rankText}>{rank}</span>;
}

// 트렌드 아이콘 컴포넌트
function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
if (trend === 'up') {
    return <ChevronUp className={styles.trendUp} />;
} else if (trend === 'down') {
    return <ChevronDown className={styles.trendDown} />;
}
return <Minus className={styles.trendNeutral} />;
}

// 금액 포맷팅 함수
function formatAmount(amount: number) {
return new Intl.NumberFormat('ko-KR').format(amount);
}

export default function RankingList({ rankings }: { rankings: UserRanking[] }) {
const [openPortfolios, setOpenPortfolios] = useState<number[]>([]);

return (
    <div className={styles.rankingList}>
    {rankings.map((user) => (
        <div
        key={user.id}
        className={`${styles.rankingItem} ${
            user.rank === 4 ? styles.rankingHighlight : ''
        }`}
        >
        <div className={styles.rankingHeader}>
            <div className={styles.userInfo}>
            <RankMedal rank={user.rank} />
            <img src={user.profileImage} alt="" className={styles.profileImage} />
            <div>
                <span className={styles.userName}>{user.username}</span>
                <div className={styles.assetInfo}>
                <span className={styles.totalAmount}>
                    평가금액 {formatAmount(user.totalAmount)}원
                </span>
                <button
                    onClick={() =>
                    setOpenPortfolios((prev) =>
                        prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id)
                        : [...prev, user.id]
                    )
                    }
                >
                    <ChevronDown
                    className={`${styles.expandButton} ${
                        openPortfolios.includes(user.id) ? styles.expandRotate : ''
                    }`}
                    />
                </button>
                </div>
            </div>
            </div>
            <TrendIcon trend={user.trend} />
        </div>

        {user.portfolio.length > 0 && openPortfolios.includes(user.id) && (
            <>
            <hr className={styles.divider} />
            <div className={styles.portfolioContainer}>
                <div className={styles.portfolioTitle}>보유 종목</div>
                {user.portfolio.map((item, index) => (
                <div key={index} className={styles.portfolioItem}>
                    <span>{item.category}</span>
                    <div className={styles.portfolioDetails}>
                    <span className={styles.portfolioAmount}>
                        {formatAmount(item.amount)}원
                    </span>
                    <span
                        className={
                        item.percentage > 0
                            ? styles.portfolioPositive
                            : styles.portfolioNegative
                        }
                    >
                        {item.percentage > 0 ? '+' : ''}
                        {item.percentage}%
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </>
        )}
        </div>
    ))}
    </div>
);
}
