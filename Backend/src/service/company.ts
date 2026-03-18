import { PoolConnection } from "mysql2/promise";
import pool from "../config/database";
import { ICompanyDetailResponse, ICompanyResponse, ICreateCompany, IUpdateCompany } from "../interface/company";
import { AppError } from "../utils/appError";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import cloudinary from "../config/cloudinary";

export const CreateCompany = async (connection: PoolConnection, company: ICreateCompany): Promise<number> => {
    const isExistTaxCode = await checkTaxCodeCompany(company.TaxCode);
    if (isExistTaxCode) {
        throw new AppError("Mã số thuế đã tồn tại", 409);
    }
    const query = `
        INSERT INTO companies 
        (CompanyName, CompanyDescription, Industry, Website, LogoUrl, ContactEmail, City, TaxCode, CreatedBy, BusinessLicenseUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        company.CompanyName,
        company.CompanyDescription ?? null,
        company.Industry,
        company.Website ?? null,
        company.LogoUrl ?? null,
        company.ContactEmail ?? null,
        company.City,
        company.TaxCode,
        company.CreatedBy,
        company.BusinessLicenseUrl
        
    ];
    const [result]: any = await connection.query(query, values);
    return result.insertId;
    
};

export const UpdateCompany = async (CompanyID: number, CompanyData: IUpdateCompany) => {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(CompanyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    })
    if (fields.length === 0) throw new AppError("Không có gì để cập nhật", 400);

    const query = `UPDATE Companies SET ${fields.join(", ")} WHERE CompanyID = ?`
    values.push(CompanyID);

    const [result]: any = await pool.query(query, values);
    if (result.affectedRows === 0) {
        throw new AppError("Công ty không tồn tại", 404);
    }
    return result;
}
export const UpdateCompanyStatus = async (CompanyID: number) => {
    const query = `UPDATE companies SET Status = ? WHERE CompanyID = ?`
    const values = [false, CompanyID];

    const [result]: any = await pool.query(query, values);

    if (result.affectedRows === 0) {
        throw new AppError("Công ty không tồn tại hoăc đã bị xóa", 404);
    }
    return true;
}
export const GetCompanyDetail = async (Role: string, CompanyID: number) => {
    let query = `SELECT * FROM companies WHERE CompanyID = ?`;
    const values: any = [CompanyID];

    if (Role !== "Admin") {
        query += ' AND Status = ?';
        values.push(true);
    }

    const [result]: any = await pool.query(query, values);

    if (!result || result.length === 0) {
        throw new AppError("Công ty không tồn tại hoặc bạn không có quyền xem", 404);
    }
    return result[0] as ICompanyDetailResponse;

}
export const GetAllCompany = async (Role: string) => {
    const fields = Role === "Admin" ? '*' : 'CompanyID, CompanyName, Industry, City, LogoUrl';
    let query = `SELECT ${fields} FROM Companies`

    const values = [];    
    if (Role !== "Admin") {
        query += ' WHERE Status = true';
        values.push(1);
    }
    const [result]: any = await pool.query(query, values);
    
    return Role === "Admin" ? result as ICompanyDetailResponse[] : result as ICompanyResponse[];
}
export const CheckCompanyId = async (CompanyID: number): Promise<Boolean> => {
    const query = `SELECT CompanyID FROM Companies WHERE CompanyID = ?`;

    const values = [ CompanyID ];
    const [result]: any = await pool.query(query, values);
    return result.length > 0;        
}
export const checkTaxCodeCompany = async (TaxCode: string): Promise<Boolean> => {
    const query = `SELECT TaxCode FROM Companies WHERE TaxCode = ?`;

    const [result]: any = await pool.query(query, [TaxCode]);
    return result.length > 0;  
}
export const handleCompanyUploads = async (files: Express.Multer.File[]) => {
    const data: {
        LogoUrl?: string;
        BusinessLicenseUrl?: string;
    } = {};

    const publicIds: string[] = [];

    const logoFile = files.find(f => f.fieldname === "LogoUrl");
    const licenseFile = files.find(f => f.fieldname === "BusinessLicenseUrl");

    const uploadPromises: Promise<void>[] = [];

    if (logoFile) {
        uploadPromises.push(
            uploadToCloudinary("Company", logoFile).then(result => {
                data.LogoUrl = result.url;
                publicIds.push(result.publicId);
            })
        );
    }
    if (licenseFile) {
        uploadPromises.push(
            uploadToCloudinary("Company", licenseFile).then(result => {
                data.BusinessLicenseUrl = result.url;
                publicIds.push(result.publicId);
            })
        );
    }
    await Promise.all(uploadPromises);

    return {
        data,
        publicIds
    };
};
export const cleanupCloudinary = async (publicIds: string[]) => {
    await Promise.all(
        publicIds.map(id =>
            cloudinary.uploader.destroy(id)
        )
    );
};