import { Request, Response, NextFunction } from 'express';
import { EUserGroup } from '../enums';

export const authorizeByGroup =
  (expectedGroup: EUserGroup) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const userGroup = req.header('x-user-groups');

    if (!userGroup) {
      res.status(400).json({
        error: 'Missing x-user-groups header',
      });
      return;
    }

    if (userGroup !== expectedGroup) {
      res.status(403).json({
        error: `Access denied`,
      });
      return;
    }

    next();
  };
