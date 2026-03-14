export interface IUser {
    UserID: number;
    Email: string;
    PasswordHash: string;
    Role: 'Candidate' | 'Employer' | 'Admin';
    Status: string;
    CreatedAt: Date;
}