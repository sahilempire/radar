-- Create patent_submissions table
CREATE TABLE IF NOT EXISTS public.patent_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patent_title TEXT NOT NULL,
    patent_type TEXT NOT NULL,
    inventors JSONB NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_type TEXT NOT NULL,
    applicant_address TEXT NOT NULL,
    technical_field TEXT,
    background_art TEXT,
    detailed_description TEXT,
    advantageous_effects TEXT,
    drawing_references TEXT,
    claims TEXT,
    abstract TEXT,
    drawings TEXT,
    declaration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create patent_supporting_files table
CREATE TABLE IF NOT EXISTS public.patent_supporting_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filing_id UUID REFERENCES public.patent_submissions(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.patent_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patent_supporting_files ENABLE ROW LEVEL SECURITY;

-- Policy for patent_submissions
CREATE POLICY "Users can view their own patent submissions"
    ON public.patent_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patent submissions"
    ON public.patent_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patent submissions"
    ON public.patent_submissions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for patent_supporting_files
CREATE POLICY "Users can view their own patent supporting files"
    ON public.patent_supporting_files
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patent supporting files"
    ON public.patent_supporting_files
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patent supporting files"
    ON public.patent_supporting_files
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Add user_id column to both tables
ALTER TABLE public.patent_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.patent_supporting_files ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id); 