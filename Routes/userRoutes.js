import * as UserController from "../controllers/userControllers.js";
import express from "express";
import checkToken from "../middlewares/authHandler.js";

const userRoutes = express.Router();

// Public routes
userRoutes.post("/register", UserController.register);
userRoutes.post("/login", UserController.login);


userRoutes.get("/customer/ordering", checkToken, (req, res) => {
    if (req.user.role === "customer") {
        return res.status(200).json({
            success: true,
            message: "Customer access granted ✔",
            user: req.user
        });
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Customer only ❌"
        });
    }
});

userRoutes.get("/rider/delivery", checkToken, (req, res) => {
    if (req.user.role === "rider") {
        return res.status(200).json({
            success: true,
            message: "Rider access granted ✔",
            user: req.user
        });
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Rider only ❌"
        });
    }
});

userRoutes.get("/staff", checkToken, (req, res) => {
    if ( req.user.role === "staff") {
        return res.status(200).json({
            success: true,
            message: "Staff access granted ✔",
            user: req.user
        });
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Staff only ❌"
        });
    }
});

userRoutes.get("/admin/inventory", checkToken, (req, res) => {
    if (req.user.role === "admin") {
        return res.status(200).json({
            success: true,
            message: "Admin access granted ✔",
            user: req.user
        });
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Admin only ❌"
        });
    }
});

export default userRoutes;