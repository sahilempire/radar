import { supabase } from './supabaseClient';
import { generateDocuments } from './aiService';

export const getFilingDocuments = async (filingId) => {
  try {
    // 1. Get the filing data from Supabase
    const { data: filing, error: filingError } = await supabase
      .from('trademark_submissions')
      .select('*')
      .eq('id', filingId)
      .single();

    if (filingError) throw filingError;
    if (!filing) throw new Error('Filing not found');

    // 2. Get any supporting files - Temporarily commented out
    // const { data: files, error: filesError } = await supabase
    //   .from('supporting_files')
    //   .select('*')
    //   .eq('filing_id', filingId);

    // if (filesError) throw filesError;

    // 3. Generate documents using AI
    const documents = await generateDocuments(filing, []); // Pass empty array instead of files

    return {
      success: true,
      data: documents
    };
  } catch (error) {
    console.error('Error getting filing documents:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 