import { supabase } from '../config/supabaseClient';

// AI Service Integration
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL;

// Claude API URL is fixed
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

// Claude API helper
const callClaude = async (prompt) => {
  const response = await fetch('http://localhost:3001/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error('Claude API error');
  const data = await response.json();
  // Claude API returns { content: [{text: ...}] }
  return data.content?.[0]?.text?.trim() || '';
};

// Upload file to Supabase Storage
const uploadFile = async (file, path) => {
  try {
    const { data, error } = await supabase.storage
      .from('trademark-files')
      .upload(`${path}/${file.name}`, file);

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// AI Service Calls
export const getAIDescription = async (text) => {
  try {
    const prompt = `Improve the following trademark description for clarity and professionalism.\n\nDescription: ${text}`;
    return await callClaude(prompt);
  } catch (error) {
    console.error('Error getting AI description from Claude:', error);
    throw error;
  }
};

export const getAIClassRecommendation = async (description) => {
  try {
    const prompt = `Given the following goods/services description, suggest the most appropriate trademark class(es) and a professional wording for the description.\n\nGoods/Services: ${description}`;
    return await callClaude(prompt);
  } catch (error) {
    console.error('Error getting AI class recommendation from Claude:', error);
    throw error;
  }
};

const analyzeLogo = async (logoPath) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze-logo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoPath }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error analyzing logo:', error);
    throw error;
  }
};

// Main submission function
export const submitTrademarkForm = async (formData) => {
  try {
    // 1. Upload files if they exist
    let logoPath = null;
    let specimenPath = null;

    if (formData.logo) {
      logoPath = await uploadFile(formData.logo, 'logos');
    }

    if (formData.specimen) {
      specimenPath = await uploadFile(formData.specimen, 'specimens');
    }

    // 2. Trigger AI services
    const [improvedDescription, classRecommendation, logoAnalysis] = await Promise.all([
      getAIDescription(formData.businessDescription),
      getAIClassRecommendation(formData.goodsServices),
      logoPath ? analyzeLogo(logoPath) : null,
    ]);

    // 3. Prepare data for database
    const submissionData = {
      ...formData,
      logoPath,
      specimenPath,
      ai_improved_description: improvedDescription,
      ai_class_recommendation: classRecommendation,
      ai_logo_analysis: logoAnalysis,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    // 4. Store in database
    const { data, error } = await supabase
      .from('trademark_submissions')
      .insert([submissionData])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0],
      ai_suggestions: {
        improvedDescription,
        classRecommendation,
        logoAnalysis,
      },
    };
  } catch (error) {
    console.error('Error submitting trademark form:', error);
    throw error;
  }
}; 