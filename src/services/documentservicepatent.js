const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const generateDocumentPrompt = (formData, documentType) => {
  console.log(`Generating prompt for ${documentType}...`);
  
  const basePrompt = `Generate a ${documentType} for a patent application with the following details:
    Invention Title: ${formData.inventionTitle}
    Inventors: ${formData.inventorNames}
    Patent Type: ${formData.patentType}
    Brief Summary: ${formData.briefSummary}
    Technical Field: ${formData.technicalField}
    Background Art: ${formData.backgroundArt}
    Detailed Description: ${formData.detailedDescription}
    Advantageous Effects: ${formData.advantageousEffects}
    Claims: ${formData.claims.map(c => c.text).join('\n')}
    Prior Art: ${formData.knownPriorArt}
  `;

  const documentSpecificPrompts = {
    'Provisional Patent Application': `${basePrompt}
      Please generate a complete provisional patent application following USPTO guidelines.
      Include all required sections and formatting.`,
    
    'Patent Specification': `${basePrompt}
      Please generate a detailed patent specification document.
      Include all technical details, drawings references, and embodiments.`,
    
    'Patent Claims': `${basePrompt}
      Please generate formal patent claims based on the provided information.
      Include both independent and dependent claims.`,
    
    'Inventor Declaration': `${basePrompt}
      Please generate an inventor declaration form.
      Include all required statements and signatures.`,
    
    'Information Disclosure Statement': `${basePrompt}
      Please generate an information disclosure statement.
      Include all known prior art and references.`
  };

  return documentSpecificPrompts[documentType] || basePrompt;
};

export const generateDocuments = async (formData) => {
  console.log('Starting document generation process...');
  console.log('Form data received:', {
    inventionTitle: formData.inventionTitle,
    inventorNames: formData.inventorNames,
    patentType: formData.patentType,
    claimsCount: formData.claims.length
  });

  try {
    const documents = [
      'Provisional Patent Application',
      'Patent Specification',
      'Patent Claims',
      'Inventor Declaration',
      'Information Disclosure Statement'
    ];

    console.log('Documents to generate:', documents);

    const generatedDocs = await Promise.all(
      documents.map(async (docType) => {
        console.log(`\nGenerating ${docType}...`);
        const prompt = generateDocumentPrompt(formData, docType);
        
        console.log(`Sending request to Anthropic API for ${docType}...`);
        const response = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 4000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        if (!response.ok) {
          console.error(`Failed to generate ${docType}:`, response.statusText);
          throw new Error(`Failed to generate ${docType}`);
        }

        const data = await response.json();
        console.log(`${docType} generated successfully!`);
        
        return {
          type: docType,
          content: data.content[0].text,
          status: 'Generated'
        };
      })
    );

    console.log('\nDocument generation completed!');
    console.log('Generated documents:', generatedDocs.map(doc => ({
      type: doc.type,
      status: doc.status,
      contentLength: doc.content.length
    })));

    return generatedDocs;
  } catch (error) {
    console.error('Error in document generation process:', error);
    throw error;
  }
}; 