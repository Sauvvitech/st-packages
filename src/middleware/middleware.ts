import { Request, Response, NextFunction } from 'express';
import { EUserGroup } from '../enums';

export const authorizeByGroup =
  (expectedGroup: EUserGroup) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const userGroup = req.header('x-user-groups');

    if (!userGroup) {
      return res.status(400).json({
        error: 'Missing x-user-groups header',
      });
    }

    if (userGroup !== expectedGroup) {
      return res.status(403).json({
        error: `Access denied'`,
      });
    }

    return next();
  };
