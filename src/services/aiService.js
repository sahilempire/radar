export const generateDocuments = async (filing, files) => {
  try {
    // Construct the prompt for the AI
    const prompt = `You are a legal document expert. Please generate the following documents based on this trademark filing data:

1. Trademark Application
2. Goods and Services Description
3. Declaration of Use
4. Specimen of Use

Filing Data:
- Trademark Name: ${filing.trademark_name}
- Mark Type: ${filing.mark_type}
- Owner Name: ${filing.owner_name}
- Owner Type: ${filing.owner_type}
- Owner Address: ${filing.owner_address}
- Filing Basis: ${filing.filing_basis}
- Business Description: ${filing.business_description}
- Trademark Classes: ${filing.trademark_class.join(', ')}
- Goods/Services: ${filing.goods_services}
- First Use Anywhere: ${filing.first_use_anywhere || 'N/A'}
- First Use in Commerce: ${filing.first_use_commerce || 'N/A'}
- Type of Commerce: ${filing.type_of_commerce || 'N/A'}
- Mark Usage: ${filing.mark_usage || 'N/A'}
- AI Improved Description: ${filing.ai_improved_description ? JSON.stringify(filing.ai_improved_description) : 'N/A'}
- AI Class Recommendation: ${filing.ai_class_recommendation ? JSON.stringify(filing.ai_class_recommendation) : 'N/A'}
- AI Logo Analysis: ${filing.ai_logo_analysis ? JSON.stringify(filing.ai_logo_analysis) : 'N/A'}

Please generate professional, legally accurate documents for each section. Format them clearly and include all necessary legal language. Each document should be complete and ready for filing, with no placeholders or incomplete sections.`;

    // TODO: Replace with actual AI API call
    // This is a mock response for now
    const mockResponse = {
      trademarkApplication: `TRADEMARK APPLICATION

Applicant Information:
Name: ${filing.owner_name}
Type: ${filing.owner_type}
Address: ${filing.owner_address}

Trademark Information:
Name: ${filing.trademark_name}
Type: ${filing.mark_type}
Filing Basis: ${filing.filing_basis}

Business Description:
${filing.business_description}

Trademark Classes:
${filing.trademark_class.join(', ')}

Goods and Services:
${filing.goods_services}

Declaration:
I, ${filing.owner_name}, declare that I am the owner of the trademark "${filing.trademark_name}" and that all information provided in this application is true and correct to the best of my knowledge and belief.`,

      goodsAndServices: `GOODS AND SERVICES DESCRIPTION

Trademark: ${filing.trademark_name}
Owner: ${filing.owner_name}

Selected Classes: ${filing.trademark_class.join(', ')}

Detailed Description of Goods/Services:
${filing.goods_services}

AI-Improved Description:
${filing.ai_improved_description || 'N/A'}

Class Recommendations:
${filing.ai_class_recommendation || 'N/A'}`,

      declarationOfUse: `DECLARATION OF USE

I, ${filing.owner_name}, being duly sworn, declare that:

1. I am the owner of the trademark "${filing.trademark_name}"
2. The mark is in use in commerce
3. The dates of first use are accurate:
   - First Use Anywhere: ${filing.first_use_anywhere || 'N/A'}
   - First Use in Commerce: ${filing.first_use_commerce || 'N/A'}
4. The specimen shows the mark in use
5. The type of commerce is: ${filing.type_of_commerce || 'N/A'}

I declare that all statements made of my own knowledge are true and that all statements made on information and belief are believed to be true.`,

      specimenOfUse: `SPECIMEN OF USE

Trademark: ${filing.trademark_name}
Owner: ${filing.owner_name}

Usage Details:
- First Use Date: ${filing.first_use_anywhere || 'N/A'}
- First Use in Commerce: ${filing.first_use_commerce || 'N/A'}
- Type of Commerce: ${filing.type_of_commerce || 'N/A'}

Mark Usage Description:
${filing.mark_usage || 'N/A'}

The specimen demonstrates use of the mark "${filing.trademark_name}" in commerce as described above.`
    };

    return mockResponse;
  } catch (error) {
    console.error('Error generating documents:', error);
    throw error;
  }
};

export const analyzeCompliance = async (prompt) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze compliance');
    }

    // The server now returns the content directly as a string
    return await response.text();
  } catch (error) {
    console.error('Error in compliance analysis:', error);
    throw error;
  }
};

export const analyzeApprovalChances = async (prompt) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze approval chances');
    }

    const data = await response.json();
    // The server returns the content directly as a string
    return data;
  } catch (error) {
    console.error('Error analyzing approval chances:', error);
    throw error;
  }
};

export const analyzeFilingDates = async (prompt) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze filing dates');
    }

    const data = await response.json();
    // The server returns the content directly as a string
    return data;
  } catch (error) {
    console.error('Error analyzing filing dates:', error);
    throw error;
  }
}; 