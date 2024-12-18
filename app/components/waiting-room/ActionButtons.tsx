import React from 'react';

interface ActionButtonsProps {
    isHost: boolean;
    userStatus: string;
    allUsersReady: boolean;
    onReady: () => void;
    onStart: () => void;
}

export default function ActionButtons({ isHost, userStatus, allUsersReady, onReady, onStart }: ActionButtonsProps) {
    if (isHost) {
        return (
        <button
            onClick={onStart}
            disabled={!allUsersReady}
            className={`px-6 py-3 rounded-lg ${
            allUsersReady ? 'start-btn' : 'start-btn-gray'
            }`}
        >
            게임 시작
        </button>
        );
    }

    return (
        <button
        onClick={onReady}
        className={`px-6 py-3 rounded-lg ${
            userStatus === '준비완료' ? 'cancle-btn' : 'ready-btn'
        }`}
        >
        {userStatus === '준비완료' ? '준비 취소' : '준비 완료'}
        </button>
    );
}

