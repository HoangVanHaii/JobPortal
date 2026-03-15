export interface ICreateCompany{
    CompanyName: string;
    CompanyDescription?: string;
    Industry: string;
    Website?: string;
    LogoUrl?: string;
    ContactEmail?: string;
    City?: string;
    Address?: string;
}
export interface IUpdateCompany{
    CompanyName?: string;
    CompanyDescription?: string;
    Industry?: string;
    Website?: string;
    LogoUrl?: string;
    ContactEmail?: string;
    Address?: string;
    City?: string;
}
export interface ICompanyResponse{
    CompanyID: number;
    CompanyName: string;
    Industry: string;
    City?: string;
    LogoUrl?: string;
}
export interface ICompanyDetailResponse {
    CompanyID: number;
    CompanyName: string;
    CompanyDescription?: string;
    Industry: string;
    Website?: string;
    LogoUrl?: string;
    ContactEmail?: string;
    Address?: string;
    City?: string;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}





