import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || 'dummy-key',
});

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to get DPIA data for context
async function getDpiaContext(dpiaId: string) {
  try {
    // Get DPIA details
    const { data: dpia, error: dpiaError } = await supabase
      .from('dpias')
      .select('*')
      .eq('id', dpiaId)
      .single();
    
    if (dpiaError) {
      console.error('Error fetching DPIA:', dpiaError);
      return null;
    }
    
    // Get DPIA sections
    const { data: sections, error: sectionsError } = await supabase
      .from('dpia_sections')
      .select('*')
      .eq('dpia_id', dpiaId);
    
    if (sectionsError) {
      console.error('Error fetching DPIA sections:', sectionsError);
      return null;
    }
    
    return {
      dpia,
      sections
    };
  } catch (error) {
    console.error('Error fetching DPIA context:', error);
    return null;
  }
}

// Helper to create system prompt
function createSystemPrompt(dpiaContext: any, currentSection: string) {
  // Base system prompt
  let systemPrompt = `You are an AI assistant specialized in helping users complete Data Protection Impact Assessments (DPIAs).
Your goal is to provide helpful, accurate guidance on GDPR compliance and data protection best practices.

When responding:
- Be concise and practical
- Provide specific examples when helpful
- Cite relevant GDPR articles when appropriate
- Suggest content that could be used to fill in form fields

When you have a good suggestion for a field, include a line starting with "SUGGESTION:" followed by your suggested text.
For example: "SUGGESTION: The purpose of this processing is to analyze customer behavior for marketing optimization."

Current DPIA information:`;

  // Add DPIA context if available
  if (dpiaContext && dpiaContext.dpia) {
    systemPrompt += `\nTitle: ${dpiaContext.dpia.title || 'Untitled DPIA'}
Status: ${dpiaContext.dpia.status || 'draft'}`;

    // Add section data
    if (dpiaContext.sections && dpiaContext.sections.length > 0) {
      systemPrompt += '\n\nCompleted sections:';
      dpiaContext.sections.forEach((section: any) => {
        systemPrompt += `\n- ${section.section_name}: ${JSON.stringify(section.content)}`;
      });
    }
  }

  // Add information about the current section
  if (currentSection) {
    systemPrompt += `\n\nUser is currently working on the "${currentSection}" section.`;
  }

  return systemPrompt;
}

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, dpiaId, section, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`Processing chat request for DPIA: ${dpiaId}, Section: ${section}`);
    
    // Get DPIA context if dpiaId is provided
    let dpiaContext = null;
    if (dpiaId) {
      dpiaContext = await getDpiaContext(dpiaId);
      if (!dpiaContext) {
        console.log(`No context found for DPIA: ${dpiaId}`);
      }
    }
    
    // Create system prompt
    const systemPrompt = createSystemPrompt(dpiaContext, section);
    
    // Format message history for Claude
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message at the beginning
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...formattedHistory.slice(-10), // Only use last 10 messages to stay within context limits
      { role: 'user' as const, content: message }
    ];
    
    console.log('Sending request to Claude API...');
    
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      messages,
      temperature: 0.7,
    });
    
    // Check if there's a suggestion in the response
    let suggestion = null;
    const responseText = response.content[0].text;
    
    // Simple pattern matching for suggestions
    const suggestionMatch = responseText.match(/SUGGESTION: (.*?)(?:\n|$)/);
    if (suggestionMatch) {
      suggestion = {
        content: suggestionMatch[1].trim()
      };
      console.log('Found suggestion in response');
    }
    
    // Clean up the response to remove the suggestion marker
    const cleanResponse = responseText.replace(/SUGGESTION: (.*?)(?:\n|$)/, '').trim();
    
    console.log('Successfully processed AI response');
    
    res.json({
      message: cleanResponse,
      suggestion
    });
  } catch (error: any) {
    console.error('Error calling AI service:', error);
    res.status(500).json({ 
      error: 'Error processing request',
      details: error.message 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
