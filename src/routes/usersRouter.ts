import { Hono } from "hono";
import { CustomError } from "../utils/errors.js";
import { StatusCodes } from "http-status-codes";
import { createResponse, USER_SUCCESS_REGISTER, USER_SUCCESS_DETAILS_RETRIEVED } from "../utils/responses.js";
import { getUserById, registerUser } from "../services/usersService.js";

const usersRouter = new Hono();

usersRouter.post('/', async (c) => {
    try {
        const userData = await c.req.json();
        const user = await registerUser(userData);
        return createResponse(c, user, USER_SUCCESS_REGISTER, StatusCodes.CREATED);
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails)
        }
    }
});

usersRouter.get('/:id', async (c) => {
    try {
        const userId = c.req.param('id');
        const user = await getUserById(userId);
        return createResponse(c, user, USER_SUCCESS_DETAILS_RETRIEVED, StatusCodes.OK);
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails);
        }
    }
});

export default usersRouter;
