import Link from "next/link";

interface GameOptionsProps {
    onRandomMatch: () => void;
    isLoading: boolean;
}

export default function GameOptions({ onRandomMatch, isLoading }: GameOptionsProps) {
    return (
        <div className="flex justify-center space-x-10">
        <div>
            <button onClick={onRandomMatch} disabled={isLoading}>
            <img src="/images/waiting-room/dice.png" className="custom-img select-random-btn" alt="Random Match" />
            <p className="font-design text-lg">랜덤 매칭</p>
            </button>
        </div>
        <div>
            <Link href="/game/together">
            <button>
                <img src="/images/waiting-room/together.png" className="custom-img select-together-btn" alt="Play Together" />
                <p className="font-design text-lg">함께 하기</p>
            </button>
            </Link>
        </div>
        </div>
    );
}

