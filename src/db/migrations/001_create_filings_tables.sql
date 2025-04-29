-- Create filings table
CREATE TABLE IF NOT EXISTS filings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filing_type TEXT NOT NULL CHECK (filing_type IN ('Trademark', 'Patent', 'Copyright')),
    applicant_name TEXT NOT NULL,
    filing_class TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create supporting_files table
CREATE TABLE IF NOT EXISTS supporting_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filing_id UUID REFERENCES filings(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS filings_user_id_idx ON filings(user_id);
CREATE INDEX IF NOT EXISTS filings_status_idx ON filings(status);
CREATE INDEX IF NOT EXISTS supporting_files_filing_id_idx ON supporting_files(filing_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_filings_updated_at
    BEFORE UPDATE ON filings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 