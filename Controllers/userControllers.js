import * as UserModel from "../models/userModels.js";

export const register = async (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
        role
    } = req.body;

    try {
        const UserProfile = {
            firstName,
            lastName,
            phoneNumber,
            address,
        };

        const user = await UserModel.createUser(UserProfile, email, password, role);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message || err
        });
    }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const token = await UserModel.login(email, password, role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message || err
        });
    }
};