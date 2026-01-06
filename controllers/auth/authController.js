const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../../models/user/userModel');
const verifyPassword = require('../../utils/passwordverify');
const generateAuthToken = require('../../utils/createToken');

/*REGISTER USER */
async function registerUser(req, res) {
    try {
        const { password, userRole } = req.body;

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            ...req.body,
            hashedPassword: encryptedPassword,
            userRole: userRole || 'admin',
            isActive: true
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

/*LOGIN USER */
async function loginUser(req, res) {
    try {
        const { emailAddress, password } = req.body;

        const existingUser = await User.findOne({
            emailAddress,
            isActive: true
        });

        if (!existingUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found or account is inactive'
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

/*CHANGE PASSWORD */
async function changePassword(req, res) {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: 'Old password and new password are required'
            });
        }

        const user = await User.findOne({ _id: userId, isActive: true });

        if (!user) {
            return res.status(404).json({
                message: 'Active user not found'
            });
        }

        const isOldPasswordCorrect = await verifyPassword(
            oldPassword,
            user.hashedPassword
        );

        if (!isOldPasswordCorrect) {
            return res.status(401).json({
                message: 'Old password is incorrect'
            });
        }

        user.hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to change password',
            error: err.message
        });
    }
}

/*FORGOT PASSWORD */
async function forgotPassword(req, res) {
    try {
        const { emailAddress } = req.body;

        if (!emailAddress) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({
            emailAddress,
            isActive: true
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found or inactive'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 15 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = tokenExpiry;
        await user.save();

        return res.status(200).json({
            message: 'Password reset token generated',
            resetToken
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Forgot password failed',
            error: err.message
        });
    }
}

/*RESET PASSWORD */
async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Token and new password are required'
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
            isActive: true
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid, expired, or inactive account'
            });
        }

        user.hashedPassword = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: 'Password reset successful'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Reset password failed',
            error: err.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword
};
