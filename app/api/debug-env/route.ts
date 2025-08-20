import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? '[SET]' : '[NOT SET]',
    NODE_ENV: process.env.NODE_ENV
  })
}







