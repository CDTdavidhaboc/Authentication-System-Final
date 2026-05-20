import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModels.js";

const checkToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        const result = await UserModel.getUser(decoded.id);
        const user = result[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

     
        req.user = user;

        console.log("USER SET IN REQUEST:", req.user);

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export default checkToken;