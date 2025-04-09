import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import userModel from '../models/userModel.js';

// Zod Schema
const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
});

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = signupSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return res.json({ success: false, message: error.errors[0].message });
        }
        res.json({ success: false, message: "Internal Server Error" });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return res.json({ success: false, message: error.errors[0].message });
        }
        res.json({ success: false, message: "Internal Server Error" });
    }
};
