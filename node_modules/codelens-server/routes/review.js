const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../middleware/auth");
const { checkLimit } = require("../middleware/planLimit");
const { reviewCode } = require("../services/claude");

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/review — submit code for review
router.post("/", authenticate, checkLimit, async (req, res) => {
  try {
    const { code, language } = req.body;
    // console.log(`Review request from user ${req.user.id} for language ${language}`);
    if (!code || !language) return res.status(400).json({ error: "Code and language are required" });
    if (code.length > 10000) return res.status(400).json({ error: "Code too long (max 10,000 chars)" });

    const feedback = await reviewCode(code, language);

    // Save to DB and increment usage
    const [review] = await Promise.all([
      prisma.review.create({
        data: {
          userId: req.user.id,
          language,
          code,
          feedback: JSON.stringify(feedback),
          score: feedback.score,
        },
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: { reviewsToday: { increment: 1 } },
      }),
    ]);

    res.json({ reviewId: review.id, feedback });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: "AI response parsing failed, please retry" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/review/history — get user's review history
router.get("/history", authenticate, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, language: true, score: true, createdAt: true, code: true },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/review/:id — get a specific review
router.get("/:id", authenticate, async (req, res) => {
  try {
    const review = await prisma.review.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    review.feedback = JSON.parse(review.feedback);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
