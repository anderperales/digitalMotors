"use client"
import FooterV2 from "@/components/FooterV2";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        
        <div
            className="min-h-screen  h-screen flex flex-col items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 128, 0.5)), url('/bg.png')`,
            }}
        >
                 <div className="flex-1 flex flex-col items-center justify-center">
                <Link href={"/"}>
                    <Image
                        style={{ objectFit: 'contain', backgroundColor: 'transparent' }}
                        className="mr-2"
                        src="/logo.svg"
                        width={300} 
                        height={100} 
                        alt="Logo Terra Construye" 
                    />
                </Link>
                
                
                <Link href={"/auth/login"}>
                    <button
                    type="submit"
                    className="mt-8 w-full  bg-gray-100 text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-1 focus:outline-none focus:ring-blue-400 hover:bg-gray-200 dark:focus:ring-blue-400"
                    >
                        INGRESAR A LA PLATAFORMA
                    </button>
                </Link>
            </div>
                        
                        
            <FooterV2/>
        </div>
    );
}
