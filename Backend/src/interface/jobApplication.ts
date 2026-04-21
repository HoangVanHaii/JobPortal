import { iResumeDetail } from "./resume";

export interface IJobApplication {
    ApplicationID: number;
    FullName: string;
    Phone: string;
    Email: string;
    ExperienceYears: number;
  
    Status: string;
    CreatedAt: string;
    MatchScore: number;
    AI_Summary_Review: string;
    
    ResumeID: number;
    ResumeDetail: iResumeDetail;
  }
  
export interface IJobApplicationList {
    ApplicationID: number;
    FullName: string;
    ExperienceYears: number;
    Status: string;
    AppliedAt: string;
    MatchScore: number;
}