// components/ParallaxImage.tsx

import { useEffect, useRef } from 'react';

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className }) => {
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (imageRef.current) {
                const { clientX, clientY } = e;
                const { offsetWidth, offsetHeight } = imageRef.current;

                // Calculate the movement based on mouse position
                const x = (clientX / window.innerWidth) * 20 - 10; // Adjust this value for effect strength
                const y = (clientY / window.innerHeight) * 20 - 10; // Adjust this value for effect strength

                // Apply the transform to the image
                imageRef.current.style.transform = `translate(${x}px, ${y}px)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div ref={imageRef} className='flex flex-col items-center justify-center'>
            <img src={src} alt={alt} className={`h-24 filter brightness-125 drop-shadow-md transition-transform`} draggable={false} />
            <h4 className="font-normal text-base text-text drop-shadow-lg" >more than just a record label</h4>
        </div>
    );
};

export default ParallaxImage;
