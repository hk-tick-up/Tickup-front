import Image from 'next/image';
import '@/app/css/main.css'

interface FooterBlockProps {
    title: string;
    subtitle: string;
    announcement: string;
    iconSrc: string;
    iconAlt: string;
}

const FooterBlock: React.FC<FooterBlockProps> = ({ title, subtitle, announcement, iconSrc, iconAlt }) => {
    return (
        <>
            <div className='footer-block-big'>
            <div className='text-base'>
                <p>{title}</p>
                <p>{subtitle}</p>
            </div>
            <div className='flex items-center'>
                <p className='footer-announce'>{announcement}</p>
                <p><Image src={iconSrc} alt={iconAlt} width={20} height={20} className='ml-1'/></p>
            </div>
            </div>
            <div><Image src='/images/icon/right-arrow.png' alt="화살표" width={15} height={15} className="footer-icon-arrow" /></div>    
        </>
        );
    };

export default FooterBlock;

