const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
};

/**
 * Clean and parse JSON from markdown code block wrappers if Gemini returned markdown.
 */
function cleanJsonMarkdown(text) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    return JSON.parse(cleaned.trim());
  } catch (err) {
    throw new Error('Failed to parse response as JSON');
  }
}

/**
 * Robust API calling utility that retries different model names and API versions
 */
async function callGeminiWithFallback(payload, systemInstruction = null) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server');

  // List of models and endpoints to try in sequence
  const attempts = [
    // 1. Stable v1 endpoint (base flash model)
    {
      url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      payload: { ...payload }
    },
    // 2. v1beta version with model alias suffix
    {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      payload: { ...payload }
    },
    // 3. Classic gemini-pro (v1beta)
    {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      payload: { ...payload }
    },
    // 4. Stable v1 classic gemini-pro
    {
      url: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
      payload: { ...payload }
    },
    // 5. Newer v1beta flash model
    {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      payload: { ...payload }
    }
  ];

  // Inject system instructions if supported & provided
  attempts.forEach((att) => {
    if (systemInstruction) {
      att.payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }
  });

  let lastError = null;

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    try {
      const response = await axios.post(`${attempt.url}?key=${apiKey}`, attempt.payload);
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message;
      console.warn(`Gemini attempt #${i + 1} (${attempt.url}) failed:`, errMsg);
      lastError = err;
      // If it's a key permission/quota issue (not 404), fail fast. Otherwise continue.
      if (err.response?.status === 400 && errMsg.includes('API key')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// @route    POST api/ai/chat
// @desc     Proxy chat request to Gemini API
// @access   Private
router.post('/chat', auth, async (req, res) => {
  const { messages, userContext } = req.body;
  const apiKey = getApiKey();

  if (!apiKey) {
    return res.json({
      success: true,
      text: "I am operating in local sandbox mode because the `GEMINI_API_KEY` is not configured on the server. Please add your Gemini API Key in the server configuration to enable the fully functional AI Assistant!",
    });
  }

  try {
    const formattedContents = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are ProductivityOS AI, a professional full-stack productivity coach and study planner.
Your goal is to help the user manage their tasks, habits, goals, notes, and wellness stats.
Provide actionable, clear, and encouraging advice. Keep responses concise.

Current User Context:
${userContext}`;

    const text = await callGeminiWithFallback({ contents: formattedContents }, systemInstruction);

    res.json({
      success: true,
      text,
    });
  } catch (error) {
    const errorDetail = error.response?.data?.error?.message || error.message;
    console.error('Server Gemini API Chat Error:', errorDetail);
    res.status(500).json({
      success: false,
      message: `Failed to connect to Gemini API. Error details: "${errorDetail}".`,
    });
  }
});

// @route    POST api/ai/milestones
// @desc     Proxy milestones suggestions request to Gemini API
// @access   Private
router.post('/milestones', auth, async (req, res) => {
  const { title, description } = req.body;
  const apiKey = getApiKey();

  if (!apiKey) {
    return res.json({
      success: true,
      milestones: [
        'Research best practices and gather study materials',
        'Create a baseline architecture plan',
        'Build first prototype modules',
        'Deploy application and run QA verification'
      ],
    });
  }

  try {
    const prompt = `Goal Title: "${title}"
Goal Description: "${description}"

Deconstruct this goal into exactly 4 clear, action-oriented, and sequential milestones/sub-tasks.
Return ONLY a valid JSON array of strings, for example:
["Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4"]
Do not add other text, markdown explanations, or wrappers.`;

    const text = await callGeminiWithFallback({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const milestones = cleanJsonMarkdown(text);
    res.json({ success: true, milestones });
  } catch (error) {
    console.error('Server Gemini API Milestones Error:', error.message);
    res.json({
      success: true,
      milestones: [
        'Define clear objectives and requirements',
        'Establish a weekly checklist',
        'Schedule dedicated blocks for execution',
        'Perform final self-evaluation'
      ],
    });
  }
});

// @route    POST api/ai/summary
// @desc     Proxy note summary request to Gemini API
// @access   Private
router.post('/summary', auth, async (req, res) => {
  const { title, content } = req.body;
  const apiKey = getApiKey();

  if (!apiKey) {
    return res.json({
      success: true,
      summary: `[Mock AI Summary] "${title}" outlines core guidelines. The main points focus on task prioritization, setting target schedules, and iterating designs step-by-step.`,
    });
  }

  try {
    const prompt = `Note Title: "${title}"
Note Body:
"""
${content}
"""

Provide a brief, 3-sentence summary highlighting the core takeaways of this note. Use markdown formatting.`;

    const text = await callGeminiWithFallback({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    res.json({
      success: true,
      summary: text,
    });
  } catch (error) {
    console.error('Server Gemini API Summary Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate summary' });
  }
});

// @route    POST api/ai/productivity
// @desc     Proxy productivity analysis request to Gemini API
// @access   Private
router.post('/productivity', auth, async (req, res) => {
  const { stats } = req.body;
  const apiKey = getApiKey();

  if (!apiKey) {
    const taskPercent = stats.tasksTotal > 0 ? Math.round((stats.tasksCompleted / stats.tasksTotal) * 100) : 0;
    const stepsPercent = stats.stepsTarget > 0 ? Math.round((stats.stepsLogged / stats.stepsTarget) * 100) : 0;
    
    let score = Math.round((taskPercent * 0.4) + (stepsPercent * 0.3) + (stats.habitsCompleted * 10) + 30);
    score = Math.min(Math.max(score, 10), 100);

    return res.json({
      success: true,
      analysis: {
        score,
        analysis: `Your score is ${score}% reflecting your baseline execution. You have completed ${stats.tasksCompleted} out of ${stats.tasksTotal} tasks and performed ${stats.stepsLogged.toLocaleString()} steps today. While your task completion rate is at ${taskPercent}%, incorporating more structure around wellness targets will directly improve focus.`,
        recommendations: [
          `Create at least 2 high-priority tasks tonight to jumpstart tomorrow morning's coding flow.`,
          `Perform a check-in for remaining habits to build daily streak continuity.`,
          `Incorporate 250ml water logs every 2 hours while coding to maintain hydration.`
        ]
      }
    });
  }

  try {
    const prompt = `User Productivity & Wellness Stats:
- Completed Tasks: ${stats.tasksCompleted} / ${stats.tasksTotal}
- Habits Checked-in Today: ${stats.habitsCompleted}
- Steps Logged: ${stats.stepsLogged} / ${stats.stepsTarget}
- Water Drank: ${stats.waterLogged} / ${stats.waterTarget} ml
- Sleep Hours: ${stats.sleepLogged} / ${stats.sleepTarget} hrs

Perform a comprehensive review of this daily telemetry log.
Calculate a balanced score (0 to 100) reflecting their achievements (tasks & habits) alongside their recovery/health metrics (sleep, steps, water).
Write a short analysis explanation (2-3 sentences) detailing their current state.
Provide 3 action-oriented, personalized recommendations to help them improve focus, wellness, or efficiency tomorrow.

Return ONLY a valid JSON object matching the schema below:
{
  "score": number,
  "analysis": "string detailing why the score was given, strengths, and weaknesses",
  "recommendations": ["string 1", "string 2", "string 3"]
}
Do not add any explanation, wrappers, or markdown formatting outside the JSON code block.`;

    const text = await callGeminiWithFallback({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const analysis = cleanJsonMarkdown(text);
    res.json({ success: true, analysis });
  } catch (error) {
    const errorDetail = error.response?.data?.error?.message || error.message;
    console.error('Server Gemini API Productivity Analysis Error:', errorDetail);
    res.json({
      success: true,
      analysis: {
        score: 75,
        analysis: `Calculated baseline score of 75% due to API network limitations. Diagnostic Error Details: "${errorDetail}". Please ensure GEMINI_API_KEY is correctly set in your Vercel Project Settings.`,
        recommendations: [
          'Organize your task categories to filter priority projects.',
          'Log sleep logs daily to evaluate cognitive recovery.',
          'Use the Pomodoro timer to enforce focused task blocks.'
        ]
      }
    });
  }
});

module.exports = router;
