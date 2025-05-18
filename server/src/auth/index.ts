import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt, { decode, JwtPayload } from "jsonwebtoken";

export function Userauth(req: any, res: any, next: NextFunction) {
  // const authHeader = req.headers.authorization;
  // const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const JWT_SECRET = process.env.JWT_SECRET!;

  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      // req.user = decoded as JwtPayload;
       req.user = {
        _id: decoded.sub || decoded.id, // support both sub or id fields
        email: decoded.email,
        source: "jwt",
      };
      next();
    });
  }else if(req.user){
    req.user = {
      _id: req.user._id,
      email: req.user.email,
      source: "google",
    };
    next();
  }else{
    return res.status(401).json({ message: "Unauthorized" });
  }
}
