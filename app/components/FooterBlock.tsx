import Image from 'next/image';
import '../css/main.css'

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
            <div>
                <p>{title}</p>
                <p>{subtitle}</p>
            </div>
            <div className='flex'>
                <p className='footer-announce'>{announcement}</p>
                <p><Image src={iconSrc} alt={iconAlt} width={27} height={27} className='footer-icon-detective'/></p>
            </div>
            </div>
            <div><Image src='/images/icon/right-arrow.png' alt="화살표" width={15} height={15} className="footer-icon-arrow" /></div>    
        </>
        );
    };

export default FooterBlock;

