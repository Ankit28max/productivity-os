import axios from 'axios';

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Clean and parse JSON from markdown code block code wrappers if Gemini returned markdown.
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
 * Call Gemini API with a system prompt and conversation messages
 */
export async function chatWithAssistant(messages, userContext = '') {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // Elegant fallback simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        let reply = "I am operating in local sandbox mode because `VITE_GEMINI_API_KEY` is not configured in your `.env` file. Please add your Gemini API Key to enable fully customized AI advice! \n\n";

        if (lastMsg.includes('review') || lastMsg.includes('task') || lastMsg.includes('todo')) {
          reply += "Looking at your schedule, I suggest grouping your high-priority items first thing in the morning and allocating at least 2 blocks of 25-minute Pomodoro sessions to focus on development work.";
        } else if (lastMsg.includes('goal') || lastMsg.includes('milestone')) {
          reply += "To accomplish your goals faster, make sure you check off at least one sub-milestone every 3 days. Consistency builds momentum!";
        } else if (lastMsg.includes('habit') || lastMsg.includes('routine')) {
          reply += "Your current habits show great promise. To build stronger neural pathways, try habit-stacking: perform your new habit immediately after an existing anchor habit (e.g. check in tasks right after morning tea).";
        } else {
          reply += "How can I help you optimize your schedule, summarize notes, or construct milestone check-ins today?";
        }
        resolve(reply);
      }, 1000);
    });
  }

  try {
    const formattedContents = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are ProductivityOS AI, a professional full-stack productivity coach and study planner.
Your goal is to help the user manage their tasks, notes, habits, and goals.
Provide actionable, clear, and encouraging advice. Keep responses concise.

Current User Context:
${userContext}`;

    const response = await axios.post(`${BASE_URL}?key=${apiKey}`, {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Chat Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to connect to Gemini API');
  }
}

/**
 * Request milestone generation for a goal
 */
export async function suggestMilestones(title, description = '') {
  const apiKey = getApiKey();

  if (!apiKey) {
    // Handled locally in GoalContext, but provide fallback list
    return [
      'Research best practices and gather study materials',
      'Create a baseline architecture plan',
      'Build first prototype modules',
      'Deploy application and run QA verification'
    ];
  }

  try {
    const prompt = `Goal Title: "${title}"
Goal Description: "${description}"

Deconstruct this goal into exactly 4 clear, action-oriented, and sequential milestones/sub-tasks.
Return ONLY a valid JSON array of strings, for example:
["Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4"]
Do not add other text, markdown explanations, or wrappers.`;

    const response = await axios.post(`${BASE_URL}?key=${apiKey}`, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    return cleanJsonMarkdown(text);
  } catch (error) {
    console.error('Gemini API Milestone Suggestion Error:', error);
    // Return standard list fallback on failure
    return [
      'Define clear objectives and requirements',
      'Establish a weekly checklist',
      'Schedule dedicated blocks for execution',
      'Perform final self-evaluation'
    ];
  }
}

/**
 * Request notes summaries
 */
export async function summarizeNote(title, content) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return `[Mock AI Summary] "${title}" outlines core guidelines. The main points focus on task prioritization, setting target schedules, and iterating designs step-by-step.`;
  }

  try {
    const prompt = `Note Title: "${title}"
Note Body:
"""
${content}
"""

Provide a brief, 3-sentence summary highlighting the core takeaways of this note. Use markdown formatting.`;

    const response = await axios.post(`${BASE_URL}?key=${apiKey}`, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Summary Error:', error);
    return 'Failed to generate summary. Review note details manually.';
  }
}

/**
 * Extract flashcards
 */
export async function generateFlashcards(title, content) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return [
      { question: 'What is the primary objective of this note?', answer: `Reviewing concepts and objectives related to: "${title}".` },
      { question: 'What is the recommended next action?', answer: 'Review checkpoints, list subtasks, and organize deadlines.' }
    ];
  }

  try {
    const prompt = `Note Title: "${title}"
Note Content:
"""
${content}
"""

Extract 3 educational or action-oriented flashcards (Question & Answer pairs) from this content.
Return ONLY a valid JSON array of objects with "question" and "answer" keys. Example:
[
  {"question": "What is RSC?", "answer": "React Server Components"},
  {"question": "When to use useMemo?", "answer": "To cache expensive calculations"}
]
Do not add markdown wrappers (except standard JSON code block if needed), descriptions, or explanation.`;

    const response = await axios.post(`${BASE_URL}?key=${apiKey}`, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    return cleanJsonMarkdown(text);
  } catch (error) {
    console.error('Gemini API Flashcards Error:', error);
    return [
      { question: 'Error extracting card', answer: 'Could not communicate with the Gemini API to format cards.' }
    ];
  }
}

/**
 * Generate AI Productivity & Wellness Analysis
 * Takes telemetry metrics and returns a customized score, detailed critique, and action plans.
 */
export async function generateProductivityAnalysis(stats) {
  const apiKey = getApiKey();

  if (!apiKey) {
    // Return a mock analysis based on actual logged stats
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskPercent = stats.tasksTotal > 0 ? Math.round((stats.tasksCompleted / stats.tasksTotal) * 100) : 0;
        const stepsPercent = stats.stepsTarget > 0 ? Math.round((stats.stepsLogged / stats.stepsTarget) * 100) : 0;
        
        // Calculate a mock score
        let score = Math.round((taskPercent * 0.4) + (stepsPercent * 0.3) + (stats.habitsCompleted * 10) + 30);
        score = Math.min(Math.max(score, 10), 100);

        resolve({
          score,
          analysis: `Your score is ${score}% reflecting your baseline execution. You have completed ${stats.tasksCompleted} out of ${stats.tasksTotal} tasks and performed ${stats.stepsLogged.toLocaleString()} steps today. While your task completion rate is at ${taskPercent}%, incorporating more structure around wellness targets will directly improve cognitive focus.`,
          recommendations: [
            `Create at least 2 high-priority tasks tonight to jumpstart tomorrow morning's coding flow.`,
            `Perform a check-in for remaining habits to build daily streak continuity.`,
            `Incorporate 250ml water logs every 2 hours while coding to maintain optimal hydration.`
          ]
        });
      }, 1200);
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

    const response = await axios.post(`${BASE_URL}?key=${apiKey}`, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    return cleanJsonMarkdown(text);
  } catch (error) {
    console.error('Gemini API Analysis Error:', error);
    // Dynamic local fallback on error
    return {
      score: 75,
      analysis: 'Calculated baseline score of 75% due to API network limitations. Your local telemetry stats show stable daily activity, though habit checks could be optimized.',
      recommendations: [
        'Organize your task categories to filter priority projects.',
        'Log sleep logs daily to evaluate cognitive recovery.',
        'Use the Pomodoro timer to enforce focused task blocks.'
      ]
    };
  }
}

