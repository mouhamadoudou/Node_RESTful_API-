
const roleMiddleware = (requiredRole) => (req, res, next) => {
    const { role } = req.user;
    console.log(role)
    if (role !== requiredRole) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
};

module.exports = roleMiddleware;