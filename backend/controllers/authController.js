import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, userId: user._id });
};
