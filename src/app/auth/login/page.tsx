"use client"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Loader from '@/components/Loader'
import Link from 'next/link'
import { useSession } from "next-auth/react";

function LoginPage() {

    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const isAuthenticated = session?.user ? true : false;

    useEffect(() => {
        if (isAuthenticated) {
          router.replace("/dashboard");
        }
    }, [isAuthenticated]);
    
    // Manejar cierre de sesión
    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/auth/login" }); // Redirige al login
    }

    const onSubmit = handleSubmit(async data => {
        setIsLoading(true);
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
            callbackUrl: "/dashboard"
        })

        if (!res?.ok) {
            setError(res?.error ?? 'Error desconocido.');
            setIsLoading(false);
        } else {
            router.push(res.url ?? '/dashboard');
        }
    });

    if (isAuthenticated) {
        return (
            <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(255, 0, 0, 0.6)), url('/bg.png')`,
            }}
        >
            <section>
                <Loader />
                <button onClick={handleSignOut} className="text-white bg-red-600 p-2 rounded">Cerrar sesión</button>
            </section>
        </div>
        )
    } else {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(255, 0, 0, 0.3)), url('/bg.png')`,
                }}
            >
                <section>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
                            <Link href={"/"}>
                                <Image
                                    style={{ objectFit: 'contain', backgroundColor: 'transparent' }}
                                    className="mr-2 mb-5" 
                                    src="/logo.png"
                                    alt="logo"
                                    height={169}
                                    width={300}
                                
                                />
                            </Link>

                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className='text-xl mb-4 text-gray-900 font-semibold'>
                                        Ingresa a tu cuenta
                                    </h1>
                                    {error && (
                                        <p className="text-red-500 text-sm mb-4">
                                            {error}
                                        </p>
                                    )}
                                    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-500 dark:text-white">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="nombre@correo.com"
                                                {...register("email", {
                                                    required: 'Email is required'
                                                })}
                                            />
                                            {errors.email?.message && (
                                                <span className="text-red-500">{String(errors.email.message)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                                            <input
                                                type="password"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                {...register("password", {
                                                    required: 'Password is required'
                                                })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="remember"
                                                        aria-describedby="remember"
                                                        type="checkbox"
                                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300 pr-2">Recordarme</label>
                                                </div>
                                            </div>
                                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">¿Olvidaste tu contraseña?</a>
                                        </div>
                                        <button type="submit" className="border-gray-300 border w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Ingresar</button>
                                        <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                                            ¿No tienes una cuenta aún? <a href="/auth/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Regístrate aquí</a>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        );
    }
}

export default LoginPage;
