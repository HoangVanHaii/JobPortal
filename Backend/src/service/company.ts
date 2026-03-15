import pool from "../config/database";
import { ICompanyDetailResponse, ICompanyResponse, ICreateCompany, IUpdateCompany } from "../interface/company";
import { AppError } from "../utils/appError";

export const CreateCompany = async (company: ICreateCompany): Promise<number> => {
    const query = `
        INSERT INTO companies 
        (CompanyName, CompanyDescription, Industry, Website, LogoUrl, ContactEmail, City, Address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        company.CompanyName,
        company.CompanyDescription ?? null,
        company.Industry,
        company.Website ?? null,
        company.LogoUrl ?? null,
        company.ContactEmail ?? null,
        company.City,
        company.Address
    ];
    const [result]: any = await pool.query(query, values);
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
    const query = `UPDATE companies SET IsActive = ? WHERE CompanyID = ?`
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
        query += ' AND IsActive = ?';
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
        query += ' WHERE IsActive = true';
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