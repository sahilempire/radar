import { supabase } from './supabaseClient';

export const getPatentFilingPrepAnalysis = async (filingId) => {
  try {
    // Get filing data from localStorage
    const storedData = localStorage.getItem('patentSubmissionData');
    const storedDocuments = localStorage.getItem('patentGeneratedDocuments');
    
    if (!storedData || !storedDocuments) {
      throw new Error('Filing data not found');
    }

    const filing = JSON.parse(storedData);
    const documents = JSON.parse(storedDocuments);

    // Construct the prompt for AI analysis
    const prompt = `Analyze the following patent filing data and provide a comprehensive preparation report:

Filing Data:
${JSON.stringify(filing, null, 2)}

Documents:
${JSON.stringify(documents, null, 2)}

Please provide a detailed analysis report in the following JSON format:
{
  "overview": {
    "status": "string",
    "summary": "string",
    "nextSteps": ["string"],
    "approvalPercentage": number // A number between 0-100 indicating the likelihood of approval
  },
  "applicationReview": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  },
  "documentAnalysis": {
    "requiredDocuments": ["string"],
    "missingDocuments": ["string"],
    "documentStatus": {
      "patentApplication": "string",
      "specification": "string",
      "claims": "string",
      "abstract": "string",
      "drawings": "string",
      "declaration": "string"
    }
  },
  "filingStrategy": {
    "jurisdictionOrder": ["string"],
    "timeline": {
      "filingDate": "string",
      "firstOfficeAction": "string",
      "estimatedRegistration": "string"
    },
    "risks": ["string"],
    "opportunities": ["string"]
  },
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "priority": "high" | "medium" | "low"
    }
  ]
}

IMPORTANT: 
1. The approvalPercentage should be based on the overall strength of the application, completeness of documents, and compliance with USPTO requirements.
2. Respond ONLY with the JSON object, no additional text or explanation.`;

    // Call the AI analysis endpoint
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI analysis');
    }

    const data = await response.json();
    // Parse the nested response structure
    const parsedResponse = JSON.parse(data.content[0].text);

    return {
      success: true,
      ...parsedResponse
    };
  } catch (error) {
    console.error('Error getting patent filing preparation analysis:', error);
    throw error;
  }
}; 