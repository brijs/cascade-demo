import { Request, Response } from 'express';

export interface PatientRequest extends Request {
    body: {
        name: string;
        identifier: string;
    };
}