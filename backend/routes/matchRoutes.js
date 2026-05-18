const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    const ranked = candidates.map(candidate => {

      const matchedSkills = candidate.skills.filter(skill =>
        requiredSkills.includes(skill)
      );

      const score =
        matchedSkills.length / requiredSkills.length;

      return {
        ...candidate._doc,
        matchedSkills,
        matchScore: Math.round(score * 100)
      };
    })
    .filter(c => c.experience >= minExperience)
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json(ranked);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/ai", async (req, res) => {
  try {

    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    const prompt = `
Job requires:
Skills: ${requiredSkills.join(", ")}
Minimum Experience: ${minExperience} years

Candidates:
${candidates.map((c, i) =>
`${i + 1}. ${c.name} - Skills: ${c.skills.join(", ")} - Experience: ${c.experience} years`
).join("\n")}

Rank candidates and explain why.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;