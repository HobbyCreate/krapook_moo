import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;

export const registerService = async (email, firstname, lastname, password) => {
    // check email
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    })
    if (existingUser) throw new Error("อีเมลนี้ถูกใช้งาน, กรุณาใช้อีเมลอื่น");

    // hash password
    const newPassword = await bcrypt.hash(password, 10);

    // add user to db
    const newUser = await prisma.user.create({
        data: {
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: newPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    // remove password before return
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

export const loginService = async (email, password) => {
    // check user 
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    })
    if (!existingUser) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

    // compare password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

    //create JWT
    const accessToken = jwt.sign({
        userId: existingUser.id,
        email: existingUser.email
    },
        JWT_SECRET,
        JWT_SECRET_EXPIRES_IN
    )

    return { 
        accessToken, 
        user: {
            id: existingUser.id,
            email: existingUser.email,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname
        } 
    };
}

export const logoutService = () => {

}