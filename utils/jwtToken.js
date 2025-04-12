export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJwtToken();                    //get method from userSchema.js to get the token
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ), // Set cookie expiration time
        httpOnly: true,               
    }; 

    res.status(statusCode).cookie("token", token, options).json({       // Send response with token in cookie
        success: true,
        user,
        message,
        token,
    });
};

