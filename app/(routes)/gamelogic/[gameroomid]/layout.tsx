// 'use client';

// import React from 'react';
// import TopNavBar from './components/TopNavBar';
// import GameProgressBar from './components/GameProgressBar';
// import { WebSocketProvider } from './context/WebSocketContext';
// import { StockProvider } from './context/StockContext';
// import { InvestmentProvider } from './context/InvestmentContext';
// import { usePathname } from 'next/navigation';
// import './css/layout.css';

// export default function GameLogicLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     // // 더미 데이터 설정
//     // const initialTurn = 1; // 초기 턴 (더미 값)
//     // const initialTotalTurns = 5; // 총 턴 수 (더미 값)

//     const pathname = usePathname();
//     const gameRoomId = pathname.split('/')[2]; // `gamelogic/[gamelogicid]`에서 ID 추출

//     return (
//         <WebSocketProvider> {/* 가장 상위에 위치 */}
//             <StockProvider>
//                 <LayoutContent gameRoomId={gameRoomId}>{children}</LayoutContent>
//             </StockProvider>
//         </WebSocketProvider>
//     );
// }

// function LayoutContent({ gameRoomId, children }: { gameRoomId: string; children: React.ReactNode }) {
//     useEffect(() => {
//         console.log(`Layout loaded with gameRoomId: ${gameRoomId}`);
//     }, [gameRoomId]);

//     // 더미 데이터 설정
//     const initialTurn = 1; // 초기 턴 (더미 값)
//     const initialTotalTurns = 5; // 총 턴 수 (더미 값)
    
//     return (
//         <div className="screen">
//             <div className="header">
//                 <GameProgressBar initialTurn={initialTurn} />
//                 <TopNavBar />
//             </div>
//             <div className="space-between" />
//             <main className="main-container">{children}</main>
//         </div>
//     );
// }

'use client';

import React from 'react';
import TopNavBar from './components/TopNavBar';
import GameProgressBar from './components/GameProgressBar';
import { WebSocketProvider } from './context/WebSocketContext';
import { StockProvider } from './context/StockContext';
import { InvestmentProvider } from './context/InvestmentContext';
import { usePathname } from 'next/navigation';
import './css/layout.css';

export default function GameLogicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const gameRoomId = pathname.split('/')[2];

    return (
        <WebSocketProvider>
            <StockProvider>
                <InvestmentProvider>
                    <LayoutContent gameRoomId={gameRoomId}>{children}</LayoutContent>
                </InvestmentProvider>
            </StockProvider>
        </WebSocketProvider>
    );
}

function LayoutContent({ gameRoomId, children }: { gameRoomId: string; children: React.ReactNode }) {
    return (
        <div className="screen">
            <div className="header">
                <GameProgressBar gameRoomId={gameRoomId} />
                <TopNavBar />
            </div>
            <div className="space-between" />
            <main className="main-container">{children}</main>
        </div>
    );
}
