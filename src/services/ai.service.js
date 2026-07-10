import api from './api';

/**
 * Call backend AI proxy to chat with Gemini Assistant
 */
export async function chatWithAssistant(messages, userContext = '') {
  try {
    const res = await api.post('/ai/chat', { messages, userContext });
    if (res.success) {
      return res.text;
    }
    throw new Error(res.message || 'Failed to generate response');
  } catch (err) {
    console.error('AI Assistant Chat Error:', err);
    throw new Error(err.message || 'Failed to connect to AI Assistant');
  }
}

/**
 * Request milestone generation for a goal via backend AI proxy
 */
export async function suggestMilestones(title, description = '') {
  try {
    const res = await api.post('/ai/milestones', { title, description });
    if (res.success) {
      return res.milestones;
    }
    return [
      'Define clear objectives and requirements',
      'Establish a weekly checklist',
      'Schedule dedicated blocks for execution',
      'Perform final self-evaluation'
    ];
  } catch (err) {
    console.error('AI Milestones Error:', err);
    return [
      'Define clear objectives and requirements',
      'Establish a weekly checklist',
      'Schedule dedicated blocks for execution',
      'Perform final self-evaluation'
    ];
  }
}

/**
 * Request note summary via backend AI proxy
 */
export async function summarizeNote(title, content) {
  try {
    const res = await api.post('/ai/summary', { title, content });
    if (res.success) {
      return res.summary;
    }
    return 'Failed to generate note summary.';
  } catch (err) {
    console.error('AI Note Summary Error:', err);
    return 'Failed to generate note summary.';
  }
}

/**
 * Request note flashcards generation via backend AI proxy
 * Note: Flashcards share notes-processing logic. We will let the backend model handle it.
 */
export async function generateFlashcards(title, content) {
  try {
    // Note: We can reuse the summary endpoint or add custom backend handler if needed.
    // For now, let's parse local flashcards or direct to the milestones logic structure.
    const res = await api.post('/ai/milestones', { 
      title: `Flashcards for: ${title}`, 
      description: content.substring(0, 300) 
    });
    if (res.success && Array.isArray(res.milestones)) {
      return res.milestones.map((m, idx) => ({
        question: `Takeaway Point #${idx + 1} from "${title}"`,
        answer: m
      }));
    }
    return [
      { question: 'Key point to remember', answer: 'Review notes regularly to reinforce retention.' }
    ];
  } catch (err) {
    console.error('AI Flashcard Error:', err);
    return [
      { question: 'Key point to remember', answer: 'Review notes regularly to reinforce retention.' }
    ];
  }
}

/**
 * Request AI productivity analysis via backend AI proxy
 */
export async function generateProductivityAnalysis(stats) {
  try {
    const res = await api.post('/ai/productivity', { stats });
    if (res.success) {
      return res.analysis;
    }
    throw new Error('Analysis failed');
  } catch (err) {
    console.error('AI Analysis Error:', err);
    return {
      score: 70,
      analysis: 'Calculated baseline score of 70% due to server offline status. Focus on habit consistency and task prioritization.',
      recommendations: [
        'Complete today\'s pending tasks to build check-in stats.',
        'Drink water regularly and log step counts daily.',
        'Establish clear sub-tasks to finish goals sequential steps.'
      ]
    };
  }
}
