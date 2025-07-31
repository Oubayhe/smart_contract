import { StatusCodes } from "http-status-codes";
import { CustomError, FAILD_CREATING_NEW_PACKAGE, PACKAGE_ALREADY_EXISTS, PACKAGE_NOT_FOUND, VALIDATION_ERROR } from "../utils/errors.js";
import { createNewPackageSchema, validate } from "../utils/validation.js";
import { db } from "../config/database.js";
import { packages } from "../db/schemas/packagesSchema.js";
import { eq, sql } from 'drizzle-orm';

export const createNewPackage = async (
    createNewPackageInput: {
        name: string, 
        description: string,
        abi: object,
        bytecode: string,
        isPublic: boolean
     }, 
    createdBy: string) => {
    const isValidInput = validate(createNewPackageSchema, {...createNewPackageInput, createdBy} )
    if (!isValidInput.success){
        throw new CustomError(VALIDATION_ERROR, StatusCodes.FORBIDDEN, isValidInput.parsedData);
    }

    const { name, description, abi, bytecode, isPublic } = createNewPackageInput;

    const existingPackage = await findPackageByName(name)
    if (existingPackage.length > 0) {
        throw new CustomError(PACKAGE_ALREADY_EXISTS, StatusCodes.UNAUTHORIZED);
    }

    try {
        const [newPackage] = await db
        .insert(packages)
            .values({
            name,
            description,
            abi,
            bytecode,
            isPublic,
            createdBy
        })
        .returning();

        return newPackage

    } catch (error) {
        throw new CustomError(FAILD_CREATING_NEW_PACKAGE, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export const getArrayPackages = async (
    query: string | undefined, 
    isPublic: boolean | undefined 
) => {
    let queryBuilder = db
        .select({
            id: packages.id,
            name: packages.name,
            description: packages.description,
            isPublic: packages.isPublic,
            createdBy: packages.createdBy,
            createdAt: packages.createdAt,
            updatedAt: packages.updatedAt

        })
        .from(packages)
    
    
    if (query !== undefined && isPublic !== undefined) {
        queryBuilder.where(
            sql`${packages.isPublic} = ${isPublic}
            AND lower(${packages.name}) LIKE ${'%' + query.toLowerCase() + '%'} 
            OR lower(${packages.description}) LIKE ${'%' + query.toLowerCase() + '%'}
            `
       )
    } 
    
    if (query !== undefined && isPublic === undefined) {
        queryBuilder.where(
            sql`lower(${packages.name}) LIKE ${'%' + query.toLowerCase() + '%'} 
            OR lower(${packages.description}) LIKE ${'%' + query.toLowerCase() + '%'}`
        )
    }
        
    if (query === undefined && isPublic !== undefined) {
        queryBuilder.where(eq(packages.isPublic, isPublic))
    }

    const arrayPackages = await queryBuilder.execute()

    return arrayPackages
}

export const getPackageDetails = async (packageId: string) => {
    const result = await db
        .select()
        .from(packages)
        .where(eq(packages.id, packageId))
        
    if (result.length === 0) {
        throw new CustomError(PACKAGE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const selectedPackage = result[0]
    return {
        id: selectedPackage.id,
        name: selectedPackage.name,
        description: selectedPackage.description,
        abi: selectedPackage.abi,
        bytecode: selectedPackage.bytecode,
        isPublic: selectedPackage.isPublic,
        createdBy: selectedPackage.createdBy,
        createdAt: selectedPackage.createdAt,
        updatedAt: selectedPackage.updatedAt
    }
}

const findPackageByName = async (name: string) => {
    const existingPackage = await db
        .select()
        .from(packages)
        .where(eq(packages.name, name))
        .limit(1)
    return existingPackage
}

