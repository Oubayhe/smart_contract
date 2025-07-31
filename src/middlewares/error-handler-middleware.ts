import { CustomError } from "../utils/errors.js";

export const handleErrorResponse = (c: any, error: unknown, defaultMessage: string, defaultStatusCode = 500) => {
    if (error instanceof CustomError) {
        return c.json(
            {
                success: error.success,
                error: error.message,
                details: error.errorDetails,
            },
            error.statusCode
        );
    }

    return c.json(
        {
            success: false,
            error: defaultMessage,
        },
        defaultStatusCode
    );
};
