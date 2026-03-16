import { Response, Request, NextFunction } from 'express'
import * as CompanyService from '../service/company'
import { ICreateCompany, IUpdateCompany } from '../interface/company';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { createEmployer } from '../service/employer';
import { Employer } from '../interface/employer';

export const CreateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyData: ICreateCompany = req.body;
        const position = req.body.Position;
        if (req.file) {
            const LogoUrl = await uploadToCloudinary('Company', req.file);
            companyData.LogoUrl = LogoUrl;
        }
        const CompanyID = await CompanyService.CreateCompany(companyData);
        const EmployerID = await createEmployer({ EmployerID: req.user?.id, CompanyID: CompanyID, Position: position } as Employer);
        console.log(EmployerID);
        return res.status(201).json({
            success: true,
            message: "Tạo Công ty thành công",
            CompanyID,
            EmployerID
        });

    } catch (error) {
        next(error);
    }
}

export const UpdateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyData: IUpdateCompany = req.body;
        const CompanyId: number = Number(req.params.CompanyID);
        if (req.file) {
            const LogoUrl = await uploadToCloudinary('Company', req.file);
            companyData.LogoUrl = LogoUrl;
        }
        await CompanyService.UpdateCompany(CompanyId, companyData);

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin công ty thành công",
        });

    } catch (error) {
        next(error);
    }
}

export const UpdateCompanyStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const CompanyId: number = Number(req.params.CompanyID);
        
        await CompanyService.UpdateCompanyStatus(CompanyId);

        return res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái công ty thành công",
        });

    } catch (error) {
        next(error);
    }
}
export const GetCompanyDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const CompanyId: number = Number(req.params.CompanyID);
        const role = req.user?.role || "Candidate";
        console.log(role);
        const company = await CompanyService.GetCompanyDetail(role, CompanyId);

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin công ty thành công",
            data: company
        });

    } catch (error) {
        next(error);
    }
}
export const GetAllCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role || "Candidate";
        const companies = await CompanyService.GetAllCompany(role);

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách công ty thành công",
            data: companies
        });

    } catch (error) {
        next(error);
    }
}

