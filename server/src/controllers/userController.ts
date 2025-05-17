import { UserModel } from "../DB";
import { validateUserData } from "../zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!
export async function Signup(req: any, res: any) {
 const parsed = validateUserData.safeParse(req.body);
 console.log("Parsed data:", !parsed.success);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Enter Valid Details",
      errors: parsed.error.errors.map((e) => e.message),
    });
  }

  const { username, email, password } = parsed.data;

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const user = await UserModel.create({ username, email, password: hash });

    const payload = { sub: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });



   return res
      .status(200)
      .cookie("token", token, {
        httpOnly: false, // in production, set to true
        secure: false, // Needed for HTTPS (Render uses HTTPS)
        sameSite: "lax", // none for production
      })
      .json({
        success: true,
        message: "SignUp successful",
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function Signin(req: any, res: any) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: false, // in production, set to true
        secure: false, // Needed for HTTPS (Render uses HTTPS)
        sameSite: "lax", // none for production
      })
      .json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
