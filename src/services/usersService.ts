import { db } from '../config/database.js';
import { users } from '../db/schemas/usersSchema.js';
import { hashPassword } from '../utils/password.js';
import { sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { CustomError, USER_ALREADY_EXISTS, USER_NOT_FOUND, VALIDATION_ERROR } from '../utils/errors.js';
import { userSchema, validate } from '../utils/validation.js';

export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  const { username, email, password } = userData;

  const isValidInput = validate(userSchema, { username, email, password } )
   if (!isValidInput.success){
    throw new CustomError(VALIDATION_ERROR, StatusCodes.FORBIDDEN, isValidInput.parsedData);
  }

  const existingUser = await findUserByEmail(email)
  const existingUserByUsername = await findUserByUsername(username)

  if (existingUser.length > 0 || existingUserByUsername.length > 0) {
    throw new CustomError(USER_ALREADY_EXISTS, StatusCodes.UNAUTHORIZED);
  }

  const hashedPassword = await hashPassword(password);

  const newUserResult = await db.insert(users).values({
    username,
    email,
    passwordHash: hashedPassword,
  }).returning();

  const newUser = newUserResult[0];

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

export const getUserById = async (userId: string) => {
  const user = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${userId}`)
    .execute();

  if (user.length === 0) {
    throw new CustomError(USER_NOT_FOUND, StatusCodes.NOT_FOUND);
  }
  const foundUser = user[0];
  
  return {
    id: foundUser.id,
    username: foundUser.username,
    email: foundUser.email,
    createdAt: foundUser.createdAt,
    updatedAt: foundUser.updatedAt,
  };
};

export const findUserByEmail = async (email:string) => {
  const user = await db
    .select()
    .from(users)
    .where(sql`${users.email} = ${email}`)
    .execute();
  return user
}

export const findUserByUsername = async (username:string) => {
  const user = await db
    .select()
    .from(users)
    .where(sql`${users.username} = ${username}`)
    .execute();
  return user
}