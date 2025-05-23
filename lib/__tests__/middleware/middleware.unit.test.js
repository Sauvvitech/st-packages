"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const middleware_1 = require("../../middleware");
describe('authorizeByGroup', () => {
    let req;
    let res;
    let next;
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
        req.header.mockReturnValue(enums_1.EUserGroup.ADMIN);
        const middleware = (0, middleware_1.authorizeByGroup)(enums_1.EUserGroup.ADMIN);
        middleware(req, res, next);
        expect(req.header).toHaveBeenCalledWith('x-user-groups');
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    it('should return 400 if x-user-groups header is missing', () => {
        req.header.mockReturnValue(undefined);
        const middleware = (0, middleware_1.authorizeByGroup)(enums_1.EUserGroup.ADMIN);
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Missing x-user-groups header',
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 403 if user group does not match expected group', () => {
        req.header.mockReturnValue(enums_1.EUserGroup.APP_USER);
        const middleware = (0, middleware_1.authorizeByGroup)(enums_1.EUserGroup.ADMIN);
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: `Access denied`,
        });
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=middleware.unit.test.js.map