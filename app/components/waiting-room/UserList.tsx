import React from 'react';
import { ParticipantsInfo } from '@/app/types/Game';

interface UserListProps {
    users: ParticipantsInfo[];
    currentUserId: string;
}

export default function UserList({ users, currentUserId }: UserListProps) {
    return (
        <ul>
        {users.map((user) => (
            <li key={user.userId}>
            <div className={user.userId === currentUserId ? 'user-highlight' : 'user-none-highlight'}>
                <div className="flex-1">
                <span className='font-custom'>{user.nickname}</span>
                </div>
                <div className="flex-1 flex justify-center">
                <p className={user.userStatus === '대기중' ? 'status-wait' : 'status-ready'}>
                    {user.userStatus}
                </p>
                </div>
            </div>
            </li>
        ))}
        </ul>
    );
}

