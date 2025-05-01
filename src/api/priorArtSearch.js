export const searchPriorArt = async (query, context) => {
  try {
    console.log('Starting prior art search with:', { query, context });
    
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Search for prior art related to the following invention:
            
            Search Query: ${query}
            
            Context:
            - Title: ${context.patentTitle}
            - Summary: ${context.briefSummary}
            - Technical Field: ${context.technicalField}
            
            Please provide a list of relevant patents and patent applications in the following JSON format:
            {
              "results": [
                {
                  "patentNumber": "string",
                  "documentType": "string",
                  "relevance": "string",
                  "summary": "string"
                }
              ]
            }`
      })
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', data);
    
    // Extract the JSON response from Claude's message
    const content = data.content[0].text;
    console.log('Claude Response Content:', content);
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude');
    }

    const results = JSON.parse(jsonMatch[0]);
    console.log('Processed Results:', results);
    
    return results;
  } catch (error) {
    console.error('Error searching for prior art:', error);
    throw error;
  }
}; 