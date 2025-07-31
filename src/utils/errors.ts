import type { StatusCode } from "hono/utils/http-status";
import { StatusCodes } from "http-status-codes";

// * This a class of my Customed Error
export class CustomError extends Error {
    success: boolean;
    statusCode: StatusCode;
    errorDetails?: object;
  
    constructor(message: string, statusCode: StatusCode, errorDetails?: object) {
      super(message);
      this.statusCode = statusCode;
      this.errorDetails = errorDetails;
      this.success = false;
      this.name = 'CustomError';
    }
}

// * This is some constants error messages
export const TOO_MANY_REQUESTS_ERROR_MSG = "Too many request!!"
export const PASSWORD_NOT_STRONG = "Password must be at least 8 characters long and contain both letters and numbers."

export const DEFAULT_ERROR_MESSAGE = "Ooops! Something went wrong. Might be nothing having the authorization! Check that if you're authenticated (Authorization Header with Bearer token)!";
export const USER_ALREADY_EXISTS = "User's email or/and username already in use. Please try again with different ones.";
export const VALIDATION_ERROR = "Some of the input fields are invalid or empty. Please review the information and try again.";
export const USER_NOT_FOUND = "User not found"
export const FAILD_TEAM_CREATION = "Failed to create team. Name might already exist."
export const FAILD_ADDING_NEW_MEMBER = "Failed to add member to team."
export const USER_ALREADY_A_MEMBER = "User is already a member of the team."
export const TEAM_NOT_FOUND = "No team exists with such id."
export const PACKAGE_ALREADY_EXISTS = "Package name already in use. Please choose a different one."
export const FAILD_CREATING_NEW_PACKAGE = "Faild to create a new package."
export const FAILD_GETTING_PACKAGES = "Faild to get requested packages."
export const FAILD_GETTING_PACKAGE_ID = "Failed to retrieve package details"
export const PACKAGE_NOT_FOUND = "Package not found"


const EMAIL_PASSWORD_INCORRECT_MSG = "The email or password you entered is incorrect. Please try again."

// * Here I will put the errors that I'll be using
export const EMAIL_PASSWORD_INCORRECT = new CustomError(
  EMAIL_PASSWORD_INCORRECT_MSG,
  StatusCodes.UNAUTHORIZED
);

