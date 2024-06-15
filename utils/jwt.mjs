// import { sign } from "jsonwebtoken"
// import { JWT_SECRET } from "../config";
import pkg from 'jsonwebtoken';
const { sign } = pkg;

export const createToken = async(identifier, password) => {
    return await sign({ identifier, password }, process.env.JWT_SECRET, {
        expiresIn: "99 years"
    })
}