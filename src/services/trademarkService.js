import { supabase } from '../config/supabaseClient';

// AI Service Integration
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:3001';

// Claude API helper
const callClaude = async (prompt) => {
  console.log('Calling Claude API with prompt:', prompt);
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error response:', errorData);
      throw new Error(`Claude API error: ${response.status} ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('API Success response:', data);
    
    // Handle the response format from Claude API
    if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
      return data.content[0].text.trim();
    } else if (data.content) {
      return data.content.trim();
    } else {
      throw new Error('Invalid response format from Claude API');
    }
  } catch (error) {
    console.error('Error in callClaude:', error);
    throw error;
  }
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
export const getAITrademarkName = async (name) => {
  console.log('Getting AI trademark name suggestion:', name);
  try {
    const prompt = `Suggest a better, more distinctive trademark name based on the following name. 
    Focus on making it unique, memorable, and legally protectable.
    Return only the suggested name, nothing else.
    
    Current name: ${name}`;
    const result = await callClaude(prompt);
    console.log('AI Trademark Name suggestion:', result);
    return result;
  } catch (error) {
    console.error('Error getting AI trademark name suggestion:', error);
    throw error;
  }
};

export const getAIDescription = async (text) => {
  console.log('Getting AI description for text:', text);
  try {
    const prompt = `Improve the following business description for clarity and professionalism.
    Focus on making it clear, concise, and legally appropriate for trademark purposes.
    
    Description: ${text}`;
    const result = await callClaude(prompt);
    console.log('AI Description result:', result);
    return result;
  } catch (error) {
    console.error('Error getting AI description from Claude:', error);
    throw error;
  }
};

export const getAIClassRecommendation = async (description) => {
  console.log('Getting AI class recommendation for description:', description);
  try {
    const prompt = `You are a trademark classification expert. Based on the following description of goods/services, suggest the most appropriate trademark class(es) from the Nice Classification.

Description: ${description}

For each suggested class, provide:
1. The class number
2. A brief explanation of why this class is appropriate
3. The exact wording that should be used for the goods/services description in that class

Return your response in the following JSON format:
{
  "classes": [
    {
      "number": "class number",
      "explanation": "brief explanation",
      "description": "exact wording for the class"
    }
  ],
  "summary": "brief explanation of the overall classification"
}

Important:
- Select only the most relevant classes
- Provide clear and precise descriptions
- Use proper trademark classification terminology
- Ensure descriptions are legally appropriate
- Keep the summary concise (max 2 sentences)
- Make sure the JSON is complete and properly formatted
- Do not include any additional text outside the JSON structure`;
    
    const result = await callClaude(prompt);
    console.log('AI Class Recommendation result:', result);
    
    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const cleanedResult = jsonMatch[0].replace(/\n/g, ' ').trim();
      const parsedResult = JSON.parse(cleanedResult);
      
      // Validate the response structure
      if (!parsedResult.classes || !Array.isArray(parsedResult.classes)) {
        throw new Error('Invalid response structure: missing or invalid classes array');
      }
      
      // Filter out any invalid classes
      parsedResult.classes = parsedResult.classes.filter(c => 
        c.number && c.explanation && c.description && 
        c.description !== 'Not applicable'
      );
      
      // Ensure summary exists and is not truncated
      if (!parsedResult.summary) {
        parsedResult.summary = 'Based on the provided description, the following classes are recommended for trademark registration.';
      }
      
      return parsedResult;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid AI response format. Please try again.');
    }
  } catch (error) {
    console.error('Error getting AI class recommendation from Claude:', error);
    throw error;
  }
};

export const getAIMarkDescription = async (description, markFile, markType) => {
  console.log('Getting AI mark description suggestion:', { description, markType });
  try {
    let markAnalysis = '';
    
    if (markFile instanceof File) {
      try {
        // Upload the mark file
        const filePath = await uploadFile(markFile, 'marks');
        
        // Analyze based on mark type
        if (markType === 'Design Mark (logo or stylized text)' || markType === 'Color Mark') {
          markAnalysis = await analyzeLogo(filePath);
        } else if (markType === 'Sound Mark') {
          // For sound marks, we would analyze the audio file
          markAnalysis = { type: 'sound', description: 'Audio file analysis' };
        } else if (markType === 'Scent Mark') {
          // For scent marks, we would analyze the scent description
          markAnalysis = { type: 'scent', description: 'Scent description analysis' };
        }
      } catch (error) {
        console.error('Error analyzing mark:', error);
      }
    }

    const prompt = `Create a clear, detailed, and legally appropriate description of the mark for trademark registration.
    
    Mark Type: ${markType}
    ${markAnalysis ? `Mark Analysis: ${JSON.stringify(markAnalysis)}\n` : ''}
    ${description ? `Current Description: ${description}\n` : ''}
    
    Based on the mark type, focus on describing:
    ${markType === 'Standard Character Mark (text only)' ? `
    - The exact text of the mark
    - Any stylization or font characteristics
    - The commercial impression of the text` : ''}
    
    ${markType === 'Design Mark (logo or stylized text)' ? `
    - The visual elements and their arrangement
    - Colors and their specific locations
    - Any text elements and their styling
    - Distinctive features that make the mark unique
    - The overall impression and commercial impression` : ''}
    
    ${markType === 'Sound Mark' ? `
    - The specific sound or musical notes
    - The duration and sequence of the sound
    - Any distinctive audio characteristics
    - The commercial impression of the sound` : ''}
    
    ${markType === 'Color Mark' ? `
    - The specific color(s) used
    - The exact shade or Pantone number if available
    - Where and how the color is applied
    - The commercial impression of the color` : ''}
    
    ${markType === 'Scent Mark' ? `
    - The specific scent or fragrance
    - The characteristics of the scent
    - How the scent is applied or used
    - The commercial impression of the scent` : ''}
    
    Make the description:
    1. Clear and specific
    2. Legally appropriate for trademark registration
    3. Focused on the distinctive features
    4. Suitable for the specific mark type
    
    Return only the description, nothing else.`;
    
    const result = await callClaude(prompt);
    console.log('AI Mark Description suggestion:', result);
    return result;
  } catch (error) {
    console.error('Error getting AI mark description suggestion:', error);
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

    if (formData.logo instanceof File) {
      try {
        logoPath = await uploadFile(formData.logo, 'logos');
      } catch (error) {
        console.error('Error uploading logo:', error);
        // Continue without logo if upload fails
      }
    }

    if (formData.specimen instanceof File) {
      try {
        specimenPath = await uploadFile(formData.specimen, 'specimens');
      } catch (error) {
        console.error('Error uploading specimen:', error);
        // Continue without specimen if upload fails
      }
    }

    // 2. Trigger AI services
    const [improvedDescription, classRecommendation, logoAnalysis] = await Promise.all([
      getAIDescription(formData.businessDescription),
      getAIClassRecommendation(formData.goodsServices),
      logoPath ? analyzeLogo(logoPath) : null,
    ]);

    // 3. Prepare data for database
    const submissionData = {
      trademark_name: formData.trademarkName,
      mark_type: formData.markType,
      logo_path: logoPath,
      logo_description: formData.logoDescription,
      owner_name: formData.ownerName,
      owner_type: formData.ownerType,
      owner_address: formData.ownerAddress,
      filing_basis: formData.filingBasis,
      business_description: formData.businessDescription,
      trademark_class: formData.trademarkClass,
      goods_services: formData.goodsServices,
      first_use_anywhere: formData.firstUseAnywhere || null,
      first_use_commerce: formData.firstUseCommerce || null,
      type_of_commerce: formData.typeOfCommerce,
      mark_usage: formData.markUsage,
      specimen_path: specimenPath,
      priority_claim: formData.priorityClaim,
      priority_country: formData.priorityCountry || null,
      priority_app_number: formData.priorityAppNumber || null,
      priority_filing_date: formData.priorityFilingDate || null,
      additional_notes: formData.additionalNotes,
      declaration: formData.declaration,
      signature: formData.signature,
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