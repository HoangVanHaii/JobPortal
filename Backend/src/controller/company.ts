import { Response, Request, NextFunction } from 'express'
import * as CompanyService from '../service/company'
import { ICreateCompany, IUpdateCompany } from '../interface/company';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
export const CreateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyData: ICreateCompany = req.body;
        if (req.file) {
            const LogoUrl = await uploadToCloudinary('Company', req.file);
            companyData.LogoUrl = LogoUrl;
        }
        const CompanyID = await CompanyService.CreateCompany(companyData);
        return res.status(201).json({
            success: true,
            message: "Tạo Công ty thành công",
            CompanyID
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
        
        const company = await CompanyService.GetCompanyDetail("Admins", CompanyId);

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
        const companies = await CompanyService.GetAllCompany("Admin");

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách công ty thành công",
            data: companies
        });

    } catch (error) {
        next(error);
    }
}

