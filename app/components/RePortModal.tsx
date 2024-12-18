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
                <div className='report-title'>경쾌한 콜리님의 리포트예요!</div>
                <div>

                    <div className='content-custom-2'>
                        경쾌한 콜리님의 게임 최종 금액은 
                        <br/>
                        15,664,000원으로 5명 중 1등입니다!
                        <br/>
                        이번 게임에서 많은 유저들이 에 활발하게 거래했어요!
                    </div>
                </div>
                <div>
                    <div className='content-custom'>
                        <div><img src = "/images/icon/alien.png" className='icon-custom'/></div>
                        <div className="mt-1">투자 성향 분석</div>
                    </div>
                    <div className="position-content">
                        <div>
                            <div>
                                경쾌한 콜리 님은 수익 실현 중심의 실리형 투자자!
                            </div>
                            <div className="font-blue">
                                #수익은 실현할 때 가치가 있다.
                            </div>
                        </div>
                        <div>
                            <div>
                                수익이 목표다! 
                            </div>
                            <div className="font-gray">
                                투자한 자산의 가치를 실현하려는 실리형 투자자.
                            </div>
                        </div>
                        <div>
                            <div>
                                리스크를 줄이고 실속을 챙긴다.
                            </div>
                            <div className="font-gray">
                                높은 매도 비율로 자산을 효율적으로 관리
                            </div>
                        </div>
                        <div>
                            <div>
                                현금이 가장 중요하다!
                            </div>
                            <div className="font-gray">
                                자산의 유동성을 높여 기회를 탐색
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        
    );
};

export default ReportModal;
