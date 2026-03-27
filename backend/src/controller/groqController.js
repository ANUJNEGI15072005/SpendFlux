import Groq from "groq-sdk"
import dotenv from "dotenv"
dotenv.config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export const getInsights = async (req, res) => {
    try {
        const { budget, totalSpent, categories } = req.body

        if (!budget || budget <= 0) {
            return res.status(400).json({ error: "Invalid budget" })
        }

        const percent = (totalSpent / budget) * 100

        let risk = "low"
        if (percent >= 40 && percent < 80) risk = "medium"
        else if (percent >= 80) risk = "high"

        const prompt = `
You are a financial assistant inside a budgeting app.

User Data:
- Budget: ₹${budget}
- Spent: ₹${totalSpent}
- Categories: ${JSON.stringify(categories)}

Rules:
- Spending % is already calculated
- Risk is: ${risk} (DO NOT change it)
- <40% = low, 40–80% = medium, >80% = high

Strict Instructions:
- DO NOT repeat numbers
- MUST use category data
- If spending is low → keep insight positive
- If one category dominates → mention it
- Suggestion must be practical (not generic)
- Keep responses short

Return ONLY JSON:

{
  "insight": "max 15 words",
  "suggestion": "max 15 words"
}
`

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
        })

        const content = response?.choices?.[0]?.message?.content

        if (!content) {
            throw new Error("No response from AI")
        }

        let parsed

        try {
            let clean = content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()

            const start = clean.indexOf("{")
            const end = clean.lastIndexOf("}")

            if (start === -1 || end === -1) {
                throw new Error("No JSON boundaries found")
            }

            clean = clean.substring(start, end + 1)

            parsed = JSON.parse(clean)

        } catch (err) {
            console.error("JSON Parse Error:", err)

            return res.json({
                insights: JSON.stringify({
                    insight: "Your spending pattern is under control.",
                    risk,
                    suggestion:
                        risk === "low"
                            ? "Keep managing expenses consistently."
                            : "Review your highest spending category.",
                }),
            })
        }

        res.json({
            insights: JSON.stringify({
                insight: parsed.insight || "Spending pattern analyzed.",
                risk,
                suggestion: parsed.suggestion || "Review your expenses for better balance.",
            }),
        })

    } catch (err) {
        console.error("INSIGHT ERROR:", err)

        res.status(500).json({
            error: "Failed to generate insights",
        })
    }
}