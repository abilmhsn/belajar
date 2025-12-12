// API Route for Gemini AI analysis
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: image.split(",")[1] || image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error("Gemini API request failed")
    }

    const data = await response.json()
    const textResponse = data.candidates[0]?.content?.parts[0]?.text || "{}"

    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    const jsonResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Error in Gemini API:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
