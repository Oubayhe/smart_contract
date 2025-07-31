import { CustomError, 
    EMAIL_PASSWORD_INCORRECT, 
    VALIDATION_ERROR } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';
import {sign} from 'hono/jwt';
import { comparePasswords } from '../utils/password.js';
import { loginSchema, validate } from '../utils/validation.js';
import { findUserByEmail } from './usersService.js';



const JWT_SECRET = process.env['JWT_SECRET']!;

const JWT_EXPIRATION = Math.floor(Date.now() / 1000) + 60 * 60 * 24


export const authenticateUser = async (loginData: { email: string; password: string }) => {
  const { email, password } = loginData;

  const isValidInput = validate(loginSchema, { email, password } )
  if (!isValidInput.success){
    throw new CustomError(VALIDATION_ERROR, StatusCodes.FORBIDDEN, isValidInput.parsedData);
  }

  const existingUser = await findUserByEmail(email)

  if (existingUser.length === 0) {
    throw EMAIL_PASSWORD_INCORRECT
  }

  const user = existingUser[0];

  const passwordMatch = await comparePasswords(password, user.passwordHash);
  if (!passwordMatch) {
    throw EMAIL_PASSWORD_INCORRECT
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    exp: JWT_EXPIRATION,
  }

  const token = await sign(payload, JWT_SECRET);

  return token
};
