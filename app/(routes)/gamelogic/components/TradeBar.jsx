import styles from '../css/TradeBar.module.css';
import React from 'react';

export default function TradeBar() {
    return(
        <div className={styles.tradeBar}>
            <div className={styles.tradeContainer}>
                <div className={styles.sellButton}>
                    <p className={styles.tradeName}>판매하기</p>
                    {/* <p className={styles.tradeSubName}>판매하기</p> */}
                </div>
                <div className={styles.buyButton}>
                    <p className={styles.tradeName}>구매하기</p>
                    {/* <p className={styles.tradeSubName}>구매하기</p> */}
                </div>
            </div>
        </div>
    );

}
