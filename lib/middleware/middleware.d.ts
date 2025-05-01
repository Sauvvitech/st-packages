import { Request, Response, NextFunction } from 'express';
import { EUserGroup } from '../enums';
export declare const authorizeByGroup: (expectedGroup: EUserGroup) => (req: Request, res: Response, next: NextFunction) => Response | void;
