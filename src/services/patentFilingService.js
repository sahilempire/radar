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

    // Mock response for now - in production this would call an AI service
    const mockResponse = {
      overview: {
        status: "Ready for Filing",
        summary: "Patent application meets basic USPTO requirements",
        nextSteps: [
          "Review generated documents for accuracy",
          "Prepare filing fees",
          "Submit application to USPTO"
        ],
        approvalPercentage: 85
      },
      applicationReview: {
        strengths: [
          "Clear technical description",
          "Well-defined claims",
          "Comprehensive drawings"
        ],
        weaknesses: [
          "Some claims could be more specific",
          "Additional examples recommended"
        ],
        recommendations: [
          "Add more specific examples in the description",
          "Review claim dependencies"
        ]
      },
      documentAnalysis: {
        requiredDocuments: [
          "Patent Application Form",
          "Specification Document",
          "Claims",
          "Abstract",
          "Drawings",
          "Declaration"
        ],
        missingDocuments: [],
        documentStatus: {
          patentApplication: "Complete",
          specification: "Complete",
          claims: "Complete",
          abstract: "Complete",
          drawings: "Complete",
          declaration: "Complete"
        }
      },
      filingStrategy: {
        jurisdictionOrder: [
          "United States (USPTO)",
          "European Patent Office",
          "Japan Patent Office"
        ],
        timeline: {
          filingDate: new Date().toISOString().split('T')[0],
          firstOfficeAction: "6-8 months",
          estimatedRegistration: "18-24 months"
        },
        risks: [
          "Potential prior art conflicts",
          "Claim scope limitations"
        ],
        opportunities: [
          "Strong market potential",
          "Novel technical solution"
        ]
      },
      recommendations: [
        {
          title: "Enhance Claims",
          description: "Consider adding dependent claims for better protection",
          priority: "high"
        },
        {
          title: "Technical Description",
          description: "Add more examples in the specification",
          priority: "medium"
        },
        {
          title: "International Filing",
          description: "Consider PCT application for broader protection",
          priority: "low"
        }
      ]
    };

    return {
      success: true,
      ...mockResponse
    };
  } catch (error) {
    console.error('Error getting patent filing preparation analysis:', error);
    throw error;
  }
}; 