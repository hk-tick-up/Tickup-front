import TopNavBar from './components/TopNavBar';
import GameProgressBar from './components/GameProgressBar';
//import '../../../public/css/fontawesome.css';
//import '../../../public/css/all.css';

export default function GameLogicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <>
            <GameProgressBar />
            <TopNavBar />
            <main>{children}</main>
        </>

    )
}