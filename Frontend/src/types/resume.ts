export interface iResumeDetail {
    candidateId: number;    
    title?: string;         
    summary?: string;
    skills?: {
      skillId?: number;    
      skillName: string;
      level?: string;      
    }[];    
    experience?: {         
      companyName: string;
      position: string;
      startDate: string; 
      endDate?: string;
      isCurrent: boolean;
      description?: string;
    }[];
    education?: {        
      institution: string;
      degree: string;
      major: string;
      startDate: string;
      endDate?: string;
      gpa?: string;
    }[];
    projects?: {           
      projectName: string;
      role: string;
      technologies: string[];
      link?: string;
      description?: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface FormProject {
    projectName: string;
    role: string;
    techString: string; 
    link?: string;
    description?: string;
  }
  
  export interface FormState extends Omit<iResumeDetail, 'projects'> {
    skills: NonNullable<iResumeDetail['skills']>;
    experience: NonNullable<iResumeDetail['experience']>;
    education: NonNullable<iResumeDetail['education']>;
    projects: FormProject[];
  }