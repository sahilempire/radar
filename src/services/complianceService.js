import { analyzeCompliance } from './aiService';
import { getFiling } from './filingService';
import { getFilingDocuments } from './documentService';

export const checkCompliance = async (filingId) => {
  try {
    const filing = await getFiling(filingId);
    if (!filing) {
      throw new Error('Filing data not found');
    }

    const files = await getFilingDocuments(filingId);
    if (!files) {
      throw new Error('Supporting files not found');
    }

    const prompt = `Analyze the following trademark filing data and supporting documents for compliance with USPTO, EUIPO, and India IPO requirements:

Filing Data:
${JSON.stringify(filing, null, 2)}

Supporting Documents:
${JSON.stringify(files, null, 2)}

Please provide a detailed compliance analysis in the following JSON format:
{
  "overallCompliance": number,
  "jurisdictions": {
    "USPTO": {
      "compliance": number,
      "requirements": [
        {
          "status": "met" | "missing" | "partial",
          "requirement": string,
          "details": string
        }
      ]
    },
    "EUIPO": {
      "compliance": number,
      "requirements": [
        {
          "status": "met" | "missing" | "partial",
          "requirement": string,
          "details": string
        }
      ]
    },
    "IndiaIPO": {
      "compliance": number,
      "requirements": [
        {
          "status": "met" | "missing" | "partial",
          "requirement": string,
          "details": string
        }
      ]
    }
  }
}

IMPORTANT: Respond ONLY with the JSON object, no additional text or explanation.`;

    const response = await analyzeCompliance(prompt);
    console.log('Response:', response); // Debug log
    
    // Parse the nested response structure
    const parsedResponse = JSON.parse(response);
    const complianceData = JSON.parse(parsedResponse.content[0].text);
    
    // Validate the required structure
    if (!complianceData.overallCompliance || !complianceData.jurisdictions) {
      throw new Error('Invalid compliance analysis format');
    }
    
    return complianceData;
  } catch (error) {
    console.error('Error checking compliance:', error);
    throw error;
  }
}; 