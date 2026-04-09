import jwt from 'jsonwebtoken';
export const generateToken = (userId: number, role: string, type: string) => {
    const payload = { userId, role };
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = type === 'accessToken' ? '60m' : '15d';
    return jwt.sign(payload, secretKey as string, { expiresIn });
}