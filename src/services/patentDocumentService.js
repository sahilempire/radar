import { supabase } from './supabaseClient';
import { generateDocuments } from './aiService';
import html2pdf from 'html2pdf.js';

export const getPatentFiling = async (filingId) => {
  try {
    // Get the submission data from localStorage
    const submissionData = JSON.parse(localStorage.getItem('patentSubmissionData'));
    
    if (!submissionData) {
      throw new Error('No patent submission data found in localStorage');
    }

    // If filingId is provided, verify it matches the stored data
    if (filingId && submissionData.id !== filingId) {
      throw new Error('Patent filing ID mismatch');
    }

    return submissionData;
  } catch (error) {
    console.error('Error fetching patent filing:', error);
    throw error;
  }
};

export const getPatentFilingDocuments = async (filingId) => {
  try {
    // 1. Get the patent filing data from Supabase
    const { data: filing, error: filingError } = await supabase
      .from('patent_submissions')
      .select('*')
      .eq('id', filingId)
      .single();

    if (filingError) throw filingError;
    if (!filing) throw new Error('Patent filing not found');

    // 2. Get any supporting files
    const { data: files, error: filesError } = await supabase
      .from('patent_supporting_files')
      .select('*')
      .eq('filing_id', filingId);

    if (filesError) throw filesError;

    // 3. Generate patent documents using AI
    const documents = await generateDocuments(filing, files || []);

    return {
      success: true,
      data: documents
    };
  } catch (error) {
    console.error('Error getting patent filing documents:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const downloadPatentDocument = async (documentType, content) => {
  try {
    // Create a temporary div to hold the formatted content
    const element = document.createElement('div');
    let formattedContent = '';

    // Format the content based on document type
    switch(documentType) {
      case 'Patent Application Form':
        formattedContent = formatPatentApplication(content);
        break;
      case 'Specification Document':
        formattedContent = formatSpecification(content);
        break;
      case 'Claims Document':
        formattedContent = formatClaims(content);
        break;
      case 'Abstract':
        formattedContent = formatAbstract(content);
        break;
      case 'Drawings':
        formattedContent = formatDrawings(content);
        break;
      case 'Declaration':
        formattedContent = formatDeclaration(content);
        break;
    }

    // Add the formatted content to the div
    element.innerHTML = formattedContent;

    // Configure PDF options
    const opt = {
      margin: 1,
      filename: `patent-${documentType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate and download PDF
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error downloading patent document:', error);
    throw error;
  }
};

// Helper functions for formatting different document types
const formatPatentApplication = (content) => {
  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">PATENT APPLICATION FORM</h1>
        <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content}
      </div>
      <div style="margin-top: 40px; text-align: right;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Signature:</strong> _______________________</p>
      </div>
    </div>
  `;
};

const formatSpecification = (content) => {
  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">SPECIFICATION</h1>
        <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content}
      </div>
    </div>
  `;
};

const formatClaims = (content) => {
  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">CLAIMS</h1>
        <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content}
      </div>
    </div>
  `;
};

const formatAbstract = (content) => {
  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">ABSTRACT</h1>
        <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content}
      </div>
    </div>
  `;
};

const formatDrawings = (content) => {
  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">DRAWINGS</h1>
        <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content}
      </div>
    </div>
  `;
};

const formatDeclaration = (content) => {
  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">DECLARATION</h1>
        <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content}
      </div>
      <div style="margin-top: 40px; text-align: right;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Signature:</strong> _______________________</p>
      </div>
    </div>
  `;
}; 