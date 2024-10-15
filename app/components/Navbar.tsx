import Image from 'next/image';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-black text-text py-4">
            <div className="container mx-auto flex justify-center items-center">
                <div className="flex-1 flex justify-end space-x-20">
                    <a href="#legal" className="hover:text-gray-300 transition duration-300 font-medium">LEGAL</a>
                    <a href="#submit" className="hover:text-gray-300 transition duration-300 font-medium">SUBMIT</a>
                </div>
                <div className="mx-12">
                    <Image src="/logos/big.png" alt="MANIAK" width={120} height={40} />
                </div>
                <div className="flex-1 flex justify-start space-x-20">
                    <a href="#artists" className="hover:text-gray-300 transition duration-300 font-medium">ARTISTS</a>
                    <a href="#why-work-with-us" className="hover:text-gray-300 transition duration-300 font-medium">WHY WORK WITH US</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;