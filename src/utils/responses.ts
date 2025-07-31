import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';


export function createResponse<T extends Record<string, any>>(
    c: Context,
    detail: T,
    message: string,
    statusCode: StatusCode
) {
    const response = {
        message,
        ...detail,
    };

    return c.json(response, statusCode);
}


// * Here I put all the success reponses/messages for each end point indicated in the test document for task 1
// User Management
export const USER_SUCCESS_REGISTER = "User successfully registered";
export const USER_SUCCESS_DETAILS_RETRIEVED = "User details retrieved";

// Authentication
export const AUTH_SUCCESS_LOGIN = "Authentication successful";
export const AUTH_SUCCESS_PROFILE_RETRIEVED = "User profile retrieved";

// Team Management
export const TEAM_SUCCESS_CREATED = "Team successfully created";
export const TEAM_SUCCESS_MEMBER_ADDED = "Member added to the team";

// Package Management
export const PACKAGE_SUCCESS_CREATED = "Package successfully created";
export const PACKAGE_SUCCESS_SEARCH_RETRIEVED = "Packages retrieved";
export const PACKAGE_SUCCESS_DETAILS_RETRIEVED = "Package details retrieved";

