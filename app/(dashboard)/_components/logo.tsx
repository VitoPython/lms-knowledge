import Image from 'next/image';

export const Logo = () => {
    return (
        <Image 
            height={140}
            width={140}
            alt="Logo"
            src="/logo.svg"
            
            />
    )
}