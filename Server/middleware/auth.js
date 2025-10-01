const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { query } = require("../database/database");

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// -------------------- Middleware --------------------

// Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// Require superadmin role
const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ success: false, message: "Superadmin access required" });
  }
  next();
};

// -------------------- Auth Functions --------------------

// Login user
const login = async (email, password) => {
  try {
    const [user] = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return { success: false, message: "Invalid credentials" };

    // Compare password with bcrypt hash
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) return { success: false, message: "Invalid credentials" };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login failed" };
  }
};

// Register new admin
const registerAdmin = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, "admin"]
    );

    return { success: true, message: "Admin user created successfully" };
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code?.includes("ER_DUP_ENTRY")) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "Registration failed" };
  }
};

// -------------------- Exports --------------------
module.exports = {
  authenticateToken,
  requireAdmin,
  requireSuperAdmin,
  login,
  registerAdmin,
};
