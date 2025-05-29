import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from "@/libs/prisma";
import bcrypt from 'bcrypt';

const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 3600
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@email.com" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },
            async authorize(credentials, req) {
                // Verifica que las credenciales no sean undefined
                if (!credentials) {
                    return null;
                }

                // Busca el usuario en la base de datos
                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    include: {
                        persona: true,
                    }
                });

                // Si el usuario no existe, retorna null
                if (!userFound) throw new Error('Usuario y/o contraseña incorrecta.');
                

                // Compara las contraseñas usando bcrypt
                const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

                // Si las contraseñas no coinciden, retorna null
                if (!matchPassword) throw new Error('Usuario y/o contraseña incorrecta.');

                if (!userFound.state)
                {
                    throw new Error('Usted no cuenta con una membresía activa.');
                }
                
                // Retorna el objeto de usuario autorizado
                return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.username,
                    cvUrl: userFound.cvUrl,
                    cvUpdatedAt: userFound.cvUpdatedAt,
                    state: userFound.state,
                    type: userFound.type,
                    persona: userFound.persona
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Almacena los detalles del usuario en el token
            if (user) {
                token.id = user.id; // Almacena el ID del usuario
                token.email = user.email; // Almacena el correo electrónico
                token.name = user.name; // Almacena el nombre
                token.cvUrl = user.cvUrl; // Almacena la URL del CV
                token.cvUpdatedAt = user.cvUpdatedAt; // Almacena la URL del CV,
                token.state = user.state;
                token.type = user.type;
                token.persona = user.persona;
            }
            return token; // Devuelve el token actualizado
        },
        async session({ session, token }) {
            // Devuelve la sesión con información adicional
            session.user.id = token.id; // Agrega el ID del usuario a la sesión
            session.user.email = token.email; // Agrega el correo electrónico a la sesión
            session.user.name = token.name; // Agrega el nombre a la sesión
            session.user.cvUrl = token.cvUrl; // Agrega cvUrl a la sesión
            session.user.cvUpdatedAt = token.cvUpdatedAt; // Agrega cvUrl a la sesión
            session.user.state = token.state
            session.user.type = token.type
            session.user.persona = token.persona
            return session; // Devuelve la sesión actualizada
        }
    },
    pages: {
        signIn: "/auth/login",
    }
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions };