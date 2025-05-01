import { analyzeCompliance } from './aiService';
import { getPatentFiling } from './patentDocumentService';

export const checkPatentCompliance = async (filingId) => {
  try {
    const filing = await getPatentFiling(filingId);
    if (!filing) {
      throw new Error('Patent filing data not found');
    }

    const prompt = `Analyze the following patent application data for compliance with USPTO requirements:

Patent Application Data:
${JSON.stringify(filing, null, 2)}

Please provide a detailed compliance analysis in the following JSON format:
{
  "overallCompliance": number,
  "requirements": [
    {
      "id": number,
      "name": string,
      "status": "met" | "missing" | "partial",
      "details": string,
      "recommendation": string
    }
  ]
}

IMPORTANT: Respond ONLY with the JSON object, no additional text or explanation.`;

    const response = await analyzeCompliance(prompt);
    console.log('Response:', response); // Debug log
    
    // Parse the nested response structure
    const parsedResponse = JSON.parse(response);
    const complianceData = JSON.parse(parsedResponse.content[0].text);
    
    // Validate the required structure
    if (!complianceData.overallCompliance || !complianceData.requirements) {
      throw new Error('Invalid compliance analysis format');
    }
    
    return complianceData;
  } catch (error) {
    console.error('Error checking patent compliance:', error);
    throw error;
  }
}; 