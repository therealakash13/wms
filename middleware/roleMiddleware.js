const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

export default roleMiddleware;
