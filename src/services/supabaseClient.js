import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 1. Create filings table ---
export const createFilingsTable = async () => {
  console.log('Creating filings table...');
  try {
    const { data, error } = await supabase.rpc('create_filings_table');
    if (error) {
      console.error('Error creating filings table:', error.message);
      return false;
    }
    console.log('Filings table created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating filings table:', error);
    return false;
  }
};

// --- 2. Create supporting_files table ---
export const createSupportingFilesTable = async () => {
  console.log('Creating supporting_files table...');
  try {
    const { data, error } = await supabase.rpc('create_supporting_files_table');
    if (error) {
      console.error('Error creating supporting_files table:', error.message);
      return false;
    }
    console.log('Supporting files table created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating supporting_files table:', error);
    return false;
  }
};

// --- 3. Create Storage Bucket ---
export const createSupportingFilesBucket = async () => {
  console.log('Creating supporting-files bucket...');
  try {
    const { data, error } = await supabase.storage.createBucket('supporting-files', {
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/tiff',
      ],
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Bucket already exists, proceeding...');
        return true;
      }
      throw error;
    }

    console.log('Bucket created successfully:', data);
    return true;
  } catch (error) {
    console.error('Error creating bucket:', error);
    return false;
  }
};

// --- 4. Initialize Storage ---
export const initializeStorage = async () => {
  try {
    // Check if storage is already initialized
    const storageInitialized = localStorage.getItem('storageInitialized');
    if (!storageInitialized) {
      // Initialize storage structure
      const storageStructure = {
        files: {},
        categories: {
          specimen: [],
          declaration: [],
          drawing: [],
          specimenOfUse: [],
          powerOfAttorney: [],
          foreignRegistration: [],
          other: []
        }
      };
      localStorage.setItem('fileStorage', JSON.stringify(storageStructure));
      localStorage.setItem('storageInitialized', 'true');
      console.log('Local storage initialized successfully');
    }
    return true;
  } catch (error) {
    console.error('Error initializing local storage:', error);
    return false;
  }
};

// --- 5. Upload File to Storage ---
export const uploadFile = async (file, category, filingId) => {
  try {
    // Read file as base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);

    const base64Data = await base64Promise;
    
    // Get existing storage
    const storage = JSON.parse(localStorage.getItem('fileStorage') || '{"files":{},"categories":{}}');
    
    // Create file entry
    const fileId = `file_${Date.now()}`;
    const fileEntry = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      category,
      filingId,
      data: base64Data,
      uploadedAt: new Date().toISOString()
    };

    // Store file data
    storage.files[fileId] = fileEntry;
    
    // Add to category
    if (!storage.categories[category]) {
      storage.categories[category] = [];
    }
    storage.categories[category].push(fileId);

    // Save back to local storage
    localStorage.setItem('fileStorage', JSON.stringify(storage));

    return {
      success: true,
      fileId,
      path: fileId
    };
  } catch (error) {
    console.error('Error uploading file to local storage:', error);
    throw error;
  }
};

// --- 6. Get File URL ---
export const getFileUrl = async (path) => {
  console.log(`Getting URL for file: ${path}`);
  try {
    const { data, error } = await supabase.storage
      .from('supporting-files')
      .createSignedUrl(path, 3600); // URL expires in 1 hour

    if (error) {
      console.error('Error getting file URL:', error.message);
      return { success: false, error };
    }

    console.log('File URL generated successfully');
    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error('Failed to get file URL:', error);
    return { success: false, error };
  }
};

// --- 7. Delete File ---
export const deleteFile = async (fileId) => {
  try {
    const storage = JSON.parse(localStorage.getItem('fileStorage') || '{"files":{},"categories":{}}');
    const file = storage.files[fileId];
    if (!file) {
      throw new Error('File not found');
    }

    // Remove from category
    const category = file.category;
    if (storage.categories[category]) {
      storage.categories[category] = storage.categories[category].filter(id => id !== fileId);
    }

    // Remove file data
    delete storage.files[fileId];

    // Save back to local storage
    localStorage.setItem('fileStorage', JSON.stringify(storage));

    return { success: true };
  } catch (error) {
    console.error('Error deleting file from local storage:', error);
    throw error;
  }
};

const getFile = async (fileId) => {
  try {
    const storage = JSON.parse(localStorage.getItem('fileStorage') || '{"files":{}}');
    const file = storage.files[fileId];
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  } catch (error) {
    console.error('Error getting file from local storage:', error);
    throw error;
  }
};

const listFiles = async (category) => {
  try {
    const storage = JSON.parse(localStorage.getItem('fileStorage') || '{"files":{},"categories":{}}');
    if (category) {
      const fileIds = storage.categories[category] || [];
      return fileIds.map(id => storage.files[id]);
    }
    return Object.values(storage.files);
  } catch (error) {
    console.error('Error listing files from local storage:', error);
    throw error;
  }
};

export {
  getFile,
  listFiles
};
