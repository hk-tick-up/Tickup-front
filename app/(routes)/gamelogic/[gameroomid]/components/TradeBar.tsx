import React, { useState } from 'react';
import styles from '../css/TradeBar.module.css';

interface TradeBarProps {
    onTradeComplete: (data: any) => void; // 거래 완료 후 데이터를 부모로 전달
    selectedTicker: string;
}

export default function TradeBar({ onTradeComplete, selectedTicker }: TradeBarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tradeType, setTradeType] = useState<'buy' | 'sell' | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState<{ message: string; success: boolean } | null>(null);

    const gameRoomId = 1;

    const openModal = (type: 'buy' | 'sell') => {
        setTradeType(type); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTradeType(null);
        setQuantity(1);
    };

    const handleQuantityChange = (change: number) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    const BASE_URL = 'http://localhost:8080';

    const handleTrade = async () => {
        if (!tradeType) return;

        const url = `${BASE_URL}/api/v1/${gameRoomId}/trade`;
        const payload = {
            userId: '1',
            ticker: selectedTicker,
            shares: quantity,
            tradeType: tradeType.toUpperCase(), // 서버에서 `BUY`/`SELL` 형식으로 처리
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '거래에 실패했습니다.');
            }

            setNotification({ message: data.message, success: true });
            onTradeComplete(data); // 서버에서 반환된 데이터 전달

            // 알림 제거
            setTimeout(() => setNotification(null), 3000);
        } catch (error: any) {
            setNotification({ message: error.message || '거래에 실패했습니다.', success: false });

            // 알림 제거
            setTimeout(() => setNotification(null), 3000);
        } finally {
            closeModal();
        }
    };

    return (
        <div className={styles.tradeBar}>
            <div className={styles.tradeContainer}>
                <button
                    className={`${styles.sellButton} ${styles.tradeButton}`}
                    onClick={() => openModal('sell')}
                >
                    판매하기
                </button>
                <button
                    className={`${styles.buyButton} ${styles.tradeButton}`}
                    onClick={() => openModal('buy')}
                >
                    구매하기
                </button>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={closeModal}>
                            &times;
                        </button>
                        <h2 className={styles.modalHeader}>
                            {tradeType === 'buy' ? '구매하기' : '판매하기'}
                        </h2>
                        <div className={styles.modalBody}>
                            <p className={styles.quantityLabel}>수량을 선택하세요:</p>
                            <div className={styles.quantitySelector}>
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(-1)}
                                >
                                    -
                                </button>
                                <input
                                    className={styles.quantityInput}
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                    }
                                />
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={`${styles.tradeActionButton} ${
                                    tradeType === 'buy' ? styles.buyAction : styles.sellAction
                                }`}
                                onClick={handleTrade}
                            >
                                {tradeType === 'buy' ? '구매하기' : '판매하기'}
                            </button>
                            <button className={styles.cancelButton} onClick={closeModal}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 거래 결과 알림 */}
            {notification && (
                <div
                    className={`${styles.notification} ${
                        notification.success ? styles.success : styles.error
                    }`}
                >
                    {notification.message}
                </div>
            )}
        </div>
    );
}
