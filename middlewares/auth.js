import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers[`authorization`];
    if (!authHeader)
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing Token" });
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null)
      return res
        .sendStatus(401)
        .json({ message: "Unauthorized: Invalid Token Format" });
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No Token Provided" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          console.error(`Token Verification Error : ${err}`);
          return res
            .sendStatus(403)
            .json({ message: "Forbidden: Invalid Token" });
        }
        // If valid, attach the user info to the Request object
        // This allows us to know WHO is logged in inside the next controller
        req.user = user;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
}
