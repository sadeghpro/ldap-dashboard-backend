import { Response } from "express";


export default function noSessionResponse(res: Response) {
    res.status(401);
    res.send({
        status: false,
        error: {
            code: 1002,
            message: 'There is no session or it\'s expired.',
        }
    })
}