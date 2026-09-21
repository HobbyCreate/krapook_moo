import { z } from 'zod'

export const registerSchema = z.object({
    email : z.string().email(),
    firstname : z.string().min(2, "กรุณากรอกชื่อ"),
    lastname : z.string().min(2, "กรุณากรอกนามสกุล"),
    password : z.string().min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),
})

export const loginSchema = z.object({
    email : z.string().email(),
    password : z.string().min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),
})