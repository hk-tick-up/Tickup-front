'use client'
import React, { useState } from 'react';
import ReportModal from '@/app/components/RePortModal';


const test: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        console.log('Modal would close here in production');
    };

    return (
        <div>
            <ReportModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    )
}

export default test;