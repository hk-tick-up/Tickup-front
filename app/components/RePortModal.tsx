'use client';

import {useEffect, useState} from "react";
import Image from 'next/image'

import '../css/components/report-modal.css'

import { X } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}



const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [nickname, setNickname] = useState<string | null>("");

    useEffect(() => {
        setNickname(sessionStorage.getItem("nickname"));
    }, []);



    return (
        <div className='report-modal-root' >
            <X onClick={onClose} />
            <div className='report-mdal-main'>
                <div className='report-title'>{nickname}님의 리포트예요!</div>
                <div className='content-custom'>
                    <div><img src ="/images/link-to/game.png" className='icon-custom' /></div>
                    <div>게임 결과 요약</div>
                </div>
                <div>
                    <div className='content-custom-1' >다른 유저들은 이렇게 했어요</div>
                    <div>도표</div>
                    <div>도표</div>
                    <div className='content-custom-2'>
                        {nickname}님의 게임 최종 금액은 512,000원으로 5명 중 5등입니다!
                        <br/>
                        이번 게임에서 많은 유저들이 B에너지에 활발하게 거래했어요!
                    </div>
                </div>
                <div>
                    <div className='content-custom'>
                        <div><img src = "/images/icon/alien.png" className='icon-custom'/></div>
                        <div className="mt-1">투자 성향 분석</div>
                    </div>
                    <div>
                        투자성향 내용
                    </div>
                </div>
            </div>

        </div>
        
    );
};

export default ReportModal;
