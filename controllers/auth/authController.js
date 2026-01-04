// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const User = require('../../models/user/userModel');
const verifyPassword = require('../../utils/passwordverify');
const generateAuthToken = require('../../utils/createToken');

async function registerUser(req, res) {
    try {
        const { password, userRole } = req.body;

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            ...req.body,
            hashedPassword: encryptedPassword,
            userRole: userRole || 'admin'
        });

        await newUser.save();

        return res.status(200).json({
            status: 200,
            message: 'User registered successfully'
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'User registration failed',
            error: err.message
        });
    }
}

async function loginUser(req, res) {
    try {
        const { emailAddress, password } = req.body;

        const existingUser = await User.findOne({ emailAddress });

        if (!existingUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        const passwordValid = await verifyPassword(
            password,
            existingUser.hashedPassword
        );

        if (!passwordValid) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        const authToken = generateAuthToken(existingUser);

        await User.findByIdAndUpdate(existingUser._id, {
            authToken
        });

        return res.status(200).json({
            status: 200,
            message: 'Login successful',
            token: authToken,
            user: existingUser
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'Login failed',
            error: err.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser
};
