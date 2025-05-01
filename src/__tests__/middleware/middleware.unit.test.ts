import { EUserGroup } from '../../enums';
import { Request, Response, NextFunction } from 'express';
import { authorizeByGroup } from '../../middleware';

describe('authorizeByGroup', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should call next if user group matches expected group', () => {
    (req.header as jest.Mock).mockReturnValue(EUserGroup.ADMIN);

    const middleware = authorizeByGroup(EUserGroup.ADMIN);
    middleware(req as Request, res as Response, next);

    expect(req.header).toHaveBeenCalledWith('x-user-groups');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 if x-user-groups header is missing', () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    const middleware = authorizeByGroup(EUserGroup.ADMIN);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing x-user-groups header',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user group does not match expected group', () => {
    (req.header as jest.Mock).mockReturnValue(EUserGroup.APP_USER);

    const middleware = authorizeByGroup(EUserGroup.ADMIN);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: `Access denied'`,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
