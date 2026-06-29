import { authService } from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    console.error(err.message);

    switch (err.message) {
      case "USER_NOT_FOUND":
        return res.status(404).json({ message: "User not found" });

      case "USER_INACTIVE":
        return res.status(403).json({ message: "User inactive" });

      case "INVALID_CREDENTIALS":
        return res.status(401).json({ message: "Invalid credentials" });

      default:
        return res.status(500).json({ message: "Server error" });
    }
  }
};

export const logout = async (req, res) => {
  res.clearCookie("app_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.json({ message: "Logout successful" });
};