import TopNavBar from './components/TopNavBar';
import GameProgressBar from './components/GameProgressBar';
import './css/layout.css'

export default async function GameLogicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // todo - 백앤드 웹소켓과 연결
    // // 서버에서 데이터를 가져오는 로직
    // const response = await fetch('http://your-backend-url/api/game/turn', {
    //     cache: 'no-store', // 실시간 데이터를 위해 캐시 비활성화
    // });
    // const { turn: initialTurn, totalTurns: initialTotalTurns } = await response.json();

    // 더미 데이터 사용
    const initialTurn = 1; // 더미 값
    const initialTotalTurns = 5; // 더미 값


    return (
        <div className='screen'>
            <div className='header'>
                <GameProgressBar initialTurn={initialTurn} initialTotalTurns={initialTotalTurns} />
                <TopNavBar />
            </div>
            
            <div className='space-between'/>
            
            <main className='main-container'>
                {/* 본문 내용 시작 */}
                {children}
            </main>
        </div>
    );
}
