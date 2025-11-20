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


// export const authenticateToken = (req, res, next) => {
//   // 1. Get the token from the header
//   // The client sends: "Authorization: Bearer <token_string>"
//   const authHeader = req.headers['authorization'];

//   // We split by space to get just the token part
//   const token = authHeader && authHeader.split(' ')[1];

//   // 2. If there is no token, stop right here
//   if (!token) {
//     return res.status(401).json({ message: "Access Denied: No Token Provided" });
//   }

//   // 3. Verify the token
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       // If token is expired or modified, reject
//       return res.status(403).json({ message: "Invalid or Expired Token" });
//     }

//     // 4. If valid, attach the user info to the Request object
//     // This allows us to know WHO is logged in inside the next controller
//     req.user = user;

//     // 5. Move to the next stop (The Books Controller)
//     next();
//   });
// };
