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
