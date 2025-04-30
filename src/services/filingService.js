import { supabase } from './supabaseClient';

// Create a new filing
export const createFiling = async (filingData) => {
  try {
    const { data, error } = await supabase
      .from('filings')
      .insert([
        {
          user_id: filingData.userId,
          filing_type: filingData.filingType,
          applicant_name: filingData.applicantName,
          filing_class: filingData.filingClass,
          description: filingData.description,
          status: 'draft'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating filing:', error);
    return { success: false, error: error.message };
  }
};

// Get filing by ID
export const getFiling = async (filingId) => {
  try {
    const { data, error } = await supabase
      .from('trademark_submissions')
      .select('*')
      .eq('id', filingId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting filing:', error);
    return { success: false, error: error.message };
  }
};

// Update filing status
export const updateFilingStatus = async (filingId, status) => {
  try {
    const { data, error } = await supabase
      .from('filings')
      .update({ status })
      .eq('id', filingId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating filing status:', error);
    return { success: false, error: error.message };
  }
};

// Upload supporting file
export const uploadSupportingFile = async (filingId, file, category) => {
  try {
    console.log('1. Starting file upload process...');
    
    // 1. Check if filing exists in filings table
    console.log('2. Checking if filing exists...');
    const { data: filing, error: filingError } = await supabase
      .from('filings')
      .select('*')
      .eq('id', filingId)
      .single();

    if (filingError && filingError.code !== 'PGRST116') {
      console.error('Error checking filing:', filingError);
      throw filingError;
    }

    // 2. If filing doesn't exist, create it
    if (!filing) {
      console.log('3. Filing not found, creating new filing...');
      const { data: trademarkSubmission, error: trademarkError } = await supabase
        .from('trademark_submissions')
        .select('*')
        .eq('id', filingId)
        .single();

      if (trademarkError) {
        console.error('Error fetching trademark submission:', trademarkError);
        throw trademarkError;
      }

      console.log('4. Creating new filing record...');
      const { data: newFiling, error: createError } = await supabase
        .from('filings')
        .insert([
          {
            id: filingId,
            user_id: trademarkSubmission.user_id,
            filing_type: 'Trademark',
            applicant_name: trademarkSubmission.owner_name,
            filing_class: trademarkSubmission.trademark_class?.join(', '),
            description: trademarkSubmission.business_description,
            status: 'draft'
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating filing:', createError);
        throw createError;
      }
      console.log('5. Filing created successfully');
    }

    // 3. Upload file to storage
    console.log('6. Preparing to upload file to storage...');
    const fileExt = file.name.split('.').pop();
    const fileName = `${filingId}/${category}/${Date.now()}.${fileExt}`;
    
    console.log('7. Uploading file to storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('supporting-files')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError);
      throw uploadError;
    }
    console.log('8. File uploaded to storage successfully');

    // 4. Create record in supporting_files table
    console.log('9. Creating supporting file record...');
    const { data, error } = await supabase
      .from('supporting_files')
      .insert([
        {
          filing_id: filingId,
          file_name: file.name,
          file_path: uploadData.path,
          file_type: file.type,
          file_size: file.size,
          category: category
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating supporting file record:', error);
      throw error;
    }
    console.log('10. Supporting file record created successfully');

    return { success: true, data };
  } catch (error) {
    console.error('Error in uploadSupportingFile:', error);
    return { success: false, error: error.message };
  }
};

// Get supporting files for a filing
export const getSupportingFiles = async (filingId) => {
  try {
    const { data, error } = await supabase
      .from('supporting_files')
      .select('*')
      .eq('filing_id', filingId);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting supporting files:', error);
    return { success: false, error: error.message };
  }
};

// Delete supporting file
export const deleteSupportingFile = async (fileId) => {
  try {
    // 1. Get file path
    const { data: fileData, error: fileError } = await supabase
      .from('supporting_files')
      .select('file_path')
      .eq('id', fileId)
      .single();

    if (fileError) throw fileError;

    // 2. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('supporting-files')
      .remove([fileData.file_path]);

    if (storageError) throw storageError;

    // 3. Delete from database
    const { error: deleteError } = await supabase
      .from('supporting_files')
      .delete()
      .eq('id', fileId);

    if (deleteError) throw deleteError;
    return { success: true };
  } catch (error) {
    console.error('Error deleting supporting file:', error);
    return { success: false, error: error.message };
  }
};

export const getFilingPrepAnalysis = async (filingId) => {
  try {
    // Get filing data
    const filing = await getFiling(filingId);
    if (!filing) {
      throw new Error('Filing data not found');
    }

    // Construct the prompt for AI analysis
    const prompt = `Analyze the following trademark filing data and provide a comprehensive preparation report:

Filing Data:
${JSON.stringify(filing, null, 2)}

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
      "logo": "string",
      "specimen": "string",
      "declaration": "string",
      "consent": "string",
      "foreign": "string"
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
1. The approvalPercentage should be based on the overall strength of the application, completeness of documents, and compliance with requirements.
2. Respond ONLY with the JSON object, no additional text or explanation.`;

    // Call the AI analysis endpoint
    const response = await fetch('http://localhost:3001/api/analyze', {
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
    console.error('Error getting filing preparation analysis:', error);
    throw error;
  }
}; 