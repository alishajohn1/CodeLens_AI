const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PLAN_LIMITS = { FREE: 5, PRO: Infinity, TEAM: Infinity };

const checkLimit = async (req, res, next) => {
  const user = req.user;
  const limit = PLAN_LIMITS[user.plan];

  // Reset daily count if it's a new day
  const today = new Date().toDateString();
  const lastReset = new Date(user.lastResetDate).toDateString();

  if (today !== lastReset) {
    await prisma.user.update({
      where: { id: user.id },
      data: { reviewsToday: 0, lastResetDate: new Date() },
    });
    req.user.reviewsToday = 0;
  }

  if (req.user.reviewsToday >= limit) {
    return res.status(429).json({
      error: `Daily limit reached. Upgrade to Pro for unlimited reviews.`,
      plan: user.plan,
      limit,
    });
  }

  next();
};

module.exports = { checkLimit, PLAN_LIMITS };
