import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {

    const data = await request.json();
    const emailFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      }
    })

    if(emailFound) {
      return NextResponse.json({
        message: "El email ya existe."
      }, {
        status: 400
      })
    }

    const usernameFound = await prisma.user.findUnique({
      where: {
        username: data.username,
      }
    })

    
    if(usernameFound) {
      return NextResponse.json({
        message: "El usuario ya existe"
      }, {
        status: 400
      })
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashPassword,
      },
    });

    const {password: _, ...user} = newUser
    return NextResponse.json(user);

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}