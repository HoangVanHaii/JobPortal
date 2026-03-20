import { Response, Request, NextFunction } from 'express'
import * as CompanyService from '../service/company'
import { ICreateCompany, IUpdateCompany } from '../interface/company';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { createEmployer } from '../service/employer';
import { Employer } from '../interface/employer';
import pool from "../config/database";
import { AppError } from '../utils/appError';
import { pid } from 'process';
import { body } from 'express-validator';


export const CreateCompany = async (req: Request, res: Response, next: NextFunction) => {
    const connection = await pool.getConnection();
    const uploadedAssets: string[] = [];

    try {
        await connection.beginTransaction();

        const companyData: ICreateCompany = req.body;
        const position = req.body.Position;
        if (req.files) {
            const uploaded = await CompanyService.handleCompanyUploads(req.files as Express.Multer.File[]);
            uploadedAssets.push(...uploaded.publicIds);
            Object.assign(companyData, uploaded.data);
        }
    
        companyData.CreatedBy = req.user!.id;
        const CompanyID = await CompanyService.CreateCompany(connection, companyData);
        const EmployerID = await createEmployer(connection, { EmployerID: req.user!.id, CompanyID: CompanyID, Position: position, ApprovalStatus: "Approved" } as Employer);

        await connection.commit();
        return res.status(201).json({
            success: true,
            message: "Tạo Công ty thành công",
            CompanyID,
            EmployerID
        });

    } catch (error) {
        await connection.rollback();
        await CompanyService.cleanupCloudinary(uploadedAssets);
        next(error);
    }
    finally {
        connection.release();
    }
}

export const UpdateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyData: IUpdateCompany = req.body;
        const CompanyId: number = Number(req.params.CompanyID);
        if (req.files) {
            const uploaded = await CompanyService.handleCompanyUploads(req.files as Express.Multer.File[]);
            Object.assign(companyData, uploaded.data)
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
        const { status } = req.query;

        if (!status) {
            throw new AppError("Thiếu trạng thái", 400);
        }
        await CompanyService.UpdateCompanyStatus(CompanyId, status.toString());

        return res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái công ty thành công",
        });

    } catch (error) {
        next(error);
    }
}
export const RequestCompany = async (req: Request, res: Response, next: NextFunction) => {
    const connection = await pool.getConnection();
    try {
        const CompanyID: number = Number(req.params.CompanyID);
        const Position: string = req.body.Position;
        const employer: Employer = { EmployerID: req.user!.id, CompanyID, Position, ApprovalStatus: "Pending" };
        const companyExist = await CompanyService.CheckCompanyId(employer.CompanyID);
        if (!companyExist) {
            throw new AppError("Công ty không tồn tại", 404);
        }
        const EmployerID = await createEmployer(connection, employer)
        return res.status(201).json({
            success: true,
            message: "Gửi yêu cầu vào công ty thành công",
            EmployerID
        })
    } catch (error) {
        next(error);
    }
    finally {
        connection.release();
    }
}
export const GetCompanyDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const CompanyId: number = Number(req.params.CompanyID);
        const role = req.user?.role || "Candidate";
        const company = await CompanyService.GetCompanyDetail(role, CompanyId);

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin công ty thành công",
            company
        });

    } catch (error) {
        next(error);
    }
}
export const GetCompanyDetailOfMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const CompanyId = await CompanyService.getCompanyIdOfMe(req.user!.id);
        if (CompanyId === null) {
            throw new AppError("Bạn không thuộc công ty nào", 401);
        }
        const role = req.user?.role || "Candidate";
        const company = await CompanyService.GetCompanyDetail(role, CompanyId);

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin công ty của bạn thành công",
            company
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

