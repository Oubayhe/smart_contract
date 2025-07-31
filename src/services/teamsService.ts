import { db } from '../config/database.js';
import { teams } from '../db/schemas/teamsSchema.js'
import { CustomError, FAILD_ADDING_NEW_MEMBER, FAILD_TEAM_CREATION, TEAM_NOT_FOUND, USER_ALREADY_A_MEMBER, VALIDATION_ERROR } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';
import { createTeamSchema, newTeamMemberSchema, validate } from '../utils/validation.js';
import { eq } from 'drizzle-orm';
import { teamMembers } from '../db/schemas/teamMembersSchema.js';


export const createTeam = async (createTeam: {name:string}, createdBy: string) => {
    const { name } = createTeam
    const isValidInput = validate(createTeamSchema, { name } )
    if (!isValidInput.success){
        throw new CustomError(VALIDATION_ERROR, StatusCodes.FORBIDDEN, isValidInput.parsedData);
    }
    try {
        const [newTeam] = await db
            .insert(teams)
            .values({
                name,
                createdBy
            })
            .returning();

        return newTeam;
    } catch (error) {
        throw new CustomError(FAILD_TEAM_CREATION, StatusCodes.BAD_REQUEST);
    }
};

export const addMemberToTeam = async (newTeamMember: {teamId: string, userId: string}) => {
    const {teamId, userId} = newTeamMember
    const isValidInput = validate(newTeamMemberSchema, {teamId, userId} )
    if (!isValidInput.success){
        throw new CustomError(VALIDATION_ERROR, StatusCodes.FORBIDDEN, isValidInput.parsedData);
    }

    const teamExists = await findTeamById(teamId)
    if (teamExists.length === 0) {
        throw new CustomError(TEAM_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const existingMember = await isUserATeamMember(userId, teamId)

    if (existingMember) {
        throw new CustomError(USER_ALREADY_A_MEMBER, StatusCodes.CONFLICT);
    }

    try {
        const [newMember] = await db
            .insert(teamMembers)
            .values({
                teamId,
                userId
            })
            .returning();

        return newMember;
    } catch (error) {
        throw new CustomError(FAILD_ADDING_NEW_MEMBER, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


const findTeamById = async (teamId: string) => {
    const teamExists = await db
        .select()
        .from(teams)
        .where(eq(teams.id, teamId))
        .limit(1);
    return teamExists
}

const findTeamByName = async (teamName: string) => {
    const teamExists = await db
        .select()
        .from(teams)
        .where(eq(teams.name, teamName))
        .limit(1);
    return teamExists
}

const isUserATeamMember = async (userId: string, teamId: string) => {
    const existingMember = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.teamId, teamId) && eq(teamMembers.userId, userId))
        .limit(1);
    return existingMember.length > 0
}