import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const authService = {
  login: async ({ username, password }) => {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.is_active) {
      throw new Error("USER_INACTIVE");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        station: user.station,
      },
    };
  },
};