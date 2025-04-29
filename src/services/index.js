import { supabase, createFilingsTable, createSupportingFilesTable, createSupportingFilesBucket, initializeStorage } from './supabaseClient';
import { createFiling, getFiling, updateFilingStatus, uploadSupportingFile, getSupportingFiles, deleteSupportingFile } from './filingService';
import { getFilingDocuments } from './documentService';
import { generateDocuments } from './aiService';
import { submitTrademarkForm, getAIDescription, getAIClassRecommendation, getAITrademarkName, getAIMarkDescription } from './trademarkService';
import { validateTrademarkForm } from './validationService';

export {
  // Supabase Client
  supabase,
  createFilingsTable,
  createSupportingFilesTable,
  createSupportingFilesBucket,
  initializeStorage,

  // Filing Services
  createFiling,
  getFiling,
  updateFilingStatus,
  uploadSupportingFile,
  getSupportingFiles,
  deleteSupportingFile,

  // Document Services
  getFilingDocuments,

  // AI Services
  generateDocuments,

  // Trademark Services
  submitTrademarkForm,
  getAIDescription,
  getAIClassRecommendation,
  getAITrademarkName,
  getAIMarkDescription,

  // Validation Services
  validateTrademarkForm
}; 