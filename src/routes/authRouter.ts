import { Hono } from "hono";
import { CustomError } from "../utils/errors.js";
import { StatusCodes } from "http-status-codes";
import { AUTH_SUCCESS_LOGIN } from "../utils/responses.js";
import { authenticateUser } from "../services/authService.js";

const authRouter = new Hono()

authRouter.post('/login', async (c) => {
    try {
        const loginData = await c.req.json();
        const token = await authenticateUser(loginData)
        return c.json({message: AUTH_SUCCESS_LOGIN, token}, StatusCodes.OK)
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails)
        }
    }
})

authRouter.get('/me', async (c) => {
    try {
        const payload = c.get('jwtPayload')
        const { exp, ...userDetails } = payload
        return c.json( userDetails, StatusCodes.OK)
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails)
        }
    }
})

export default authRouter