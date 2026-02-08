export interface Profile {
  basic: {
    name: string;
    gender: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    householdAddress?: string; // Add this explicitly as it was used in component
    ethnicity?: string; // Add this explicitly
    birthDate?: string; // Add this explicitly
    idType?: string; // Add this explicitly
    [key: string]: string | undefined; // Allow for other fields
  };
  experiences: Experience[]; // Unified Education and Work
  family: Family[];
  
  // Deprecated fields kept for migration/compatibility if needed, 
  // but we will try to migrate them to experiences.
  education?: Education[];
  work?: Work[];
}

export interface Experience {
  id: string;
  type: 'education' | 'work'; // Distinguish between education and work
  name: string; // Acts as the main "Content" field (School/Company + Major/Role + Title + Desc)
  role?: string; // Optional/Deprecated
  title?: string; // Optional/Deprecated
  startDate: string;
  endDate: string;
  location?: string; // Optional/Deprecated
  description?: string; // Optional/Deprecated
}

// Keep these for legacy type support if needed during migration, 
// but we will primarily use Experience
export interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Work {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Family {
  id: string;
  relation: string;
  name: string;
  company: string;
  position: string;
  phone: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'text' | 'json' | 'table';
  content: string;
  mapping: Record<string, string>;
}
