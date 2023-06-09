import userSchema from "../database/models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleLoginService = async (email, password) => {
  const userExists = await userSchema.findOne({ email });
  if (!userExists) {
    console.log("Not valid email");
    throw new Error("Not valid credentials");
  }

  const match = await bcrypt.compare(password, userExists.password);

  if (!match) {
    console.log("Not valid password");
    throw new Error("Not valid credentials");
  }

  //Get just the Roles code to hide the roles from the client
  const roles = Object.values(userExists.roles).filter(Boolean);

  //Generate access token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: userExists.email,
        roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: 900,
    }
  );
  //Generate refresh token
  const refreshToken = jwt.sign(
    { email: userExists.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: 86400,
    }
  );
  //Add refresh token to user document
  await userSchema.findOneAndUpdate(
    { email },
    { refreshToken: refreshToken },
    { new: true }
  );

  return [
    refreshToken,
    accessToken,
    roles,
    userExists._id,
    userExists.name,
    userExists.lastName,
    userExists.phone,
  ];
};
