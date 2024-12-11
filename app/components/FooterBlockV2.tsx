import Image from 'next/image';
import '@/app/css/main.css'

interface FooterBlockProps {
    title: string;
    subtitle: string;
    iconSrc: string;
    iconAlt: string;
    announcement: string;
}

const FooterBlock: React.FC<FooterBlockProps> = ({ title, subtitle, announcement, iconSrc, iconAlt }) => {
    return (
        <>
            <div className='footer-block-big'>
            <div>
                <div className='text-base'>
                    <p>{title}</p>
                    <div className='flex items-center'>
                        <p>{subtitle}</p>
                        <p><Image src={iconSrc} alt={iconAlt} width={20} height={20} className='ml-1'/></p>
                    </div>
                </div>
            </div>
            <div className='flex'>
                <p className='footer-announce'>{announcement}</p>
            </div>
            </div>
            <div><Image src='/images/icon/right-arrow.png' alt="화살표" width={15} height={15} className="footer-icon-arrow" /></div>    
        </>
        );
    };

export default FooterBlock;

