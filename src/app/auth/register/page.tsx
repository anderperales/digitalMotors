"use client"

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Image from 'next/image';
import { useState } from 'react';
import Loader from '@/components/Loader';
import Link from 'next/link';
function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmPassword) {
            return alert('Password dot not match')
        }

        setIsLoading(true);
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }


        })
        if (res.ok) {
            setIsLoading(false);
            router.push('/auth/login');
        }
        else {
            setIsLoading(false);
            const result = await res.json();
            setError(result?.message);
        }
    })
    return (

        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(255, 0, 0, 0.3)), url('/bg.png')`,
            }}
        >
            <section >
                {isLoading ? (
                    <Loader /> // Muestra el loader mientras isLoading es true
                ) : (
                    <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
                        <Link href={"/"}>
                        <Image
                            style={{ objectFit: 'contain', backgroundColor: 'transparent' }} className="mr-2 mb-5" src="/logo.png" alt="logo" height={169} width={300}></Image>
                        </Link>
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <form action="" onSubmit={onSubmit} className="space-y-4 md:space-y-6">

                                    <h1 className='text-xl mb-4 text-gray-900 font-semibold'>Regístrate aquí</h1>
                                    {error && (
                                        <p className="text-red-500 text-sm mb-4">
                                            {error}
                                        </p>
                                    )}
                                    <div className='relative z-0 w-full mb-5 group'>

                                        <input type="text"
                                            {...register("username", {
                                                required: 'Este campo es requerido'
                                            })}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer "
                                            placeholder=''
                                        />
                                        <label htmlFor='username' className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Nombre de usuario</label>
                                        {errors.username?.message && (
                                            <span className="text-red-500 text-xs">{String(errors.username.message)}</span>
                                        )}
                                    </div>

                                    <div className='relative z-0 w-full mb-5 group'>
                                        <input type="email"
                                            {...register("email", {
                                                required: 'Este campo es requerido'
                                            })}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer "
                                            placeholder=''
                                        />
                                        <label htmlFor='email' className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Correo electrónico</label>

                                        {errors.email?.message && (
                                            <span className="text-red-500 text-xs">{String(errors.email.message)}</span>
                                        )}
                                    </div>



                                    <div className='relative z-0 w-full mb-5 group'>
                                        <input type="password"
                                            {...register("password", {
                                                required: 'Este campo es requerido'
                                            })}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer "
                                            placeholder=''
                                        />
                                        <label htmlFor='password' className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Contraseña</label>
                                        {errors.password?.message && (
                                            <span className="text-red-500 text-xs">{String(errors.password.message)}</span>
                                        )}
                                    </div>

                                    <div className='relative z-0 w-full mb-5 group'>

                                        <input type="password"
                                            {
                                            ...register("confirmPassword", {
                                                required: 'Este campo es requerido'
                                            })
                                            }
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer "
                                            placeholder=''
                                        />
                                        <label htmlFor='confirmPassword' className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Confirmar contraseña</label>

                                        {errors.confirmPassword?.message && (
                                            <span className="text-red-500 text-xs">{String(errors.confirmPassword.message)}</span>
                                        )}

                                    </div>
                                    <button className="border-gray-300 border w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mb-6 mt-2">
                                        Registrarme
                                    </button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        ¿Ya tienes una cuenta? <a href="/auth/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Ingresa aquí</a>
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


export default RegisterPage;