import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const payload = {
    id: '64abc123',
    name: "sawastik Bhullar",
    role: 'user'
};
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log("your test token : ");
console.log(token);
