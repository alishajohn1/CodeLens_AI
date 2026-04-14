const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../middleware/auth");
const { PLAN_LIMITS } = require("../middleware/planLimit");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/user/me — get current user profile + usage
router.get("/me", authenticate, async (req, res) => {
  try {
    const { password, ...user } = req.user;
    const limit = PLAN_LIMITS[user.plan];
    res.json({
      ...user,
      usage: {
        reviewsToday: user.reviewsToday,
        limit: limit === Infinity ? "unlimited" : limit,
        remaining: limit === Infinity ? "unlimited" : Math.max(0, limit - user.reviewsToday),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
