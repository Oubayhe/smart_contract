import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { CustomError, FAILD_ADDING_NEW_MEMBER, FAILD_TEAM_CREATION } from '../utils/errors.js';
import { addMemberToTeam, createTeam } from '../services/teamsService.js';
import { createResponse, TEAM_SUCCESS_CREATED, TEAM_SUCCESS_MEMBER_ADDED } from '../utils/responses.js';

const teamsRouter = new Hono();

teamsRouter.post('', async (c) => {
    try {
        const payload = c.get('jwtPayload');
        const userId = payload.id;
        const createTeamInput = await c.req.json();

        const team = await createTeam(createTeamInput, userId);

        return createResponse(c, team, TEAM_SUCCESS_CREATED, StatusCodes.CREATED);
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails);
        }
        throw new CustomError(FAILD_TEAM_CREATION, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

teamsRouter.post('/:teamId/members', async (c) => {
    try {
        const teamId = c.req.param('teamId');
        const { userId } = await c.req.json();

        const teamMember = await addMemberToTeam({teamId, userId});

        return createResponse(c, teamMember, TEAM_SUCCESS_MEMBER_ADDED, StatusCodes.OK)
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.statusCode, error.errorDetails);
        }
        throw new CustomError(FAILD_ADDING_NEW_MEMBER, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default teamsRouter;
