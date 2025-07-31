import { Hono } from "hono";
import { createResponse, PACKAGE_SUCCESS_CREATED } from "../utils/responses.js";
import { StatusCodes } from "http-status-codes";
import { CustomError, FAILD_CREATING_NEW_PACKAGE, FAILD_GETTING_PACKAGE_ID, FAILD_GETTING_PACKAGES } from "../utils/errors.js";
import { createNewPackage, getArrayPackages, getPackageDetails } from "../services/packagesService.js";
import { convertToBoolean } from "../utils/validation.js";

const packagesRouter = new Hono()

packagesRouter.post('', async (c) => {
    try {
        const payload = c.get('jwtPayload')
        const userId = payload.id
        const createNewPackageInput = await c.req.json()
        const newPackage = await createNewPackage(createNewPackageInput, userId)
        return createResponse(c, newPackage, PACKAGE_SUCCESS_CREATED, StatusCodes.CREATED)
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails);
        }
        throw new CustomError(FAILD_CREATING_NEW_PACKAGE, StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

packagesRouter.get('', async (c) => {
    try {
        const { query, isPublic} = c.req.query()
        const arrayPackages = await getArrayPackages(query, convertToBoolean(isPublic))
        return c.json(arrayPackages, StatusCodes.OK)
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails);
        }
        throw new CustomError(FAILD_GETTING_PACKAGES, StatusCodes.INTERNAL_SERVER_ERROR)
    }
})

packagesRouter.get('/:id', async (c) => {
    try {
        const packageId = c.req.param('id');
        const packageDetails = await getPackageDetails(packageId);
        return c.json(packageDetails, StatusCodes.OK);
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails);
        }
        throw new CustomError(FAILD_GETTING_PACKAGE_ID, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default packagesRouter