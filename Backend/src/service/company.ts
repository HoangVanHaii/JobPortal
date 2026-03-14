import { ResultSetHeader } from "mysql2/promise";
import pool from "../config/database";
import { ICompanyDetailResponse, ICompanyResponse, ICreateCompany, IUpdateCompany } from "../interface/company";

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
        company.City ?? null,
        company.Address ?? null
    ];
    try {
        const [result]: any = await pool.query(query, values);
        return result.insertId;

    } catch (error: any) {
        throw error;
    }
};

export const UpdateCompany = async (CompanyID: number, CompanyData: IUpdateCompany) => {
    try {
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(CompanyData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        })
        if (fields.length === 0) throw new Error("Không có gì để cập nhật");

        const query = `UPDATE Companies SET ${fields.join(", ")} WHERE CompanyID = ?`
        values.push(CompanyID);

        const [result]: any = await pool.query(query, values);
        if (result.affectedRows === 0) {
            throw new Error("Công ty không tồn tại");
        }

        return result;
    } catch (error) {
        throw error;
    }
}
export const UpdateCompanyStatus = async (CompanyID: number) => {
    try {
        const query = `UPDATE companies SET IsActive = ? WHERE CompanyID = ?`
        const values = [false, CompanyID];

        const [result]: any = await pool.query(query, values);

        if (result.affectedRows === 0) {
            throw new Error("Công ty không tồn tại hoăc đã bị xóa");
        }
        return true;
        
    } catch (error) {
        throw error;
    }
}
export const GetCompanyDetail = async (Role: string, CompanyID: number) => {
    try {
        let query = `SELECT * FROM companies WHERE CompanyID = ?`;
        const values: any = [CompanyID];

        if (Role !== "Admin") {
            query += ' AND IsActive = ?';
            values.push(true);
        }

        const [result]: any = await pool.query(query, values);

        if (!result || result.length === 0) {
            throw new Error("Công ty không tồn tại hoặc bạn không có quyền xem");
        }

        return result[0] as ICompanyDetailResponse;
        
    } catch (error) {
        throw error;
    }

}
export const GetAllCompany = async (Role: string) => {
    try {
        const fields = Role === "Admin" ? '*' : 'CompanyID, CompanyName, Industry, City, LogoUrl';
        let query = `SELECT ${fields} FROM Companies`

        const values = [];    
        if (Role !== "Admin") {
            query += ' WHERE IsActive = true';
            values.push(1);
        }
        const [result]: any = await pool.query(query, values);
        
        return Role === "Admin" ? result as ICompanyDetailResponse[] : result as ICompanyResponse[];
        
    } catch (error) {
        throw error;
    }
}
export const CheckCompanyId = async (CompanyID: number): Promise<Boolean> => {
    try {
        const query = `SELECT CompanyID FROM Companies WHERE CompanyID = ?`;

        const values = [ CompanyID ];
        const [result]: any = await pool.query(query, values);
        return result.length > 0;        

    } catch (error) {
        throw error;
    }
}