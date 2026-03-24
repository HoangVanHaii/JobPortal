export interface IJobApplication {
    ApplicationID: number;
  
    FullName: string;
    Phone: string;
    Email: string;
    ExperienceYears: number;
  
    Status: string;
    CreatedAt: string;
    MatchScore: number;
    AI_Summary_Review: string | null;
  
    Title: string;
    ResumeFileUrl: string;
  
    Skills: Skill[];
  }
  
  export interface Skill {
    SkillID: number;
    SkillName: string;
}
export interface IJobApplicationList {
    ApplicationID: number;
  
    FullName: string;
    ExperienceYears: number;
  
    Status: string;
    AppliedAt: string;
    MatchScore: number;
  }