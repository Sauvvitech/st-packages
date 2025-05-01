"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeByGroup = void 0;
const authorizeByGroup = (expectedGroup) => (req, res, next) => {
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
exports.authorizeByGroup = authorizeByGroup;
//# sourceMappingURL=middleware.js.map