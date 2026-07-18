import jwt from 'jsonwebtoken';
import '../config.js'
import type {Request,Response,NextFunction} from 'express';


if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

type DecodedObj={
    name:string,
    email:string
}

const auth =(req:Request,res:Response,next:NextFunction)=>{

    const autheader:string |undefined=req.headers.authorization;

    if(!autheader){
return res.status(401).json({
    success:false,
    message:"access denied"
})
    }

    const token:string |undefined=autheader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:"access denied -invalid token format"
        });
 }

try{

    let decodedRaw:unknown=jwt.verify(token,process.env.JWT_SECRET!);
    if (typeof decodedRaw === "string") {
    return res.status(401).json({ success: false, message: "Invalid token payload" });
}

 const decoded = decodedRaw as DecodedObj
 req.user=decoded;

next();
} catch (err) {
    if (err instanceof Error) {
         if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        hint: 'Please login again to get a new token'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        hint: 'Token may be tampered or malformed'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
    }
}

}

export default auth;