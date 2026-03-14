export class AppError extends Error {
    public stautusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode:number, isOperational = true) {
        super(message);
        this.stautusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }   
}