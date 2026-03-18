import { Router } from "express";
import * as companyController from '../controller/company'
import * as companyMiddleware from '../middleware/company'
import { validateRequest } from "../middleware/validateRequest";
import { uploadCompany } from "../utils/uploadCompany";
import { authMiddleware, isAdmin, isEmployer } from "../middleware/auth";
import { optionalAuth } from "../middleware/optionalAuth";
const router = Router();

router.post('/', authMiddleware, isEmployer, uploadCompany.any(), companyMiddleware.CreateCompanyValidation, validateRequest, companyController.CreateCompany);
router.put('/:CompanyID', authMiddleware, isEmployer, uploadCompany.any(), companyMiddleware.UpdateCompanyValidation, validateRequest, companyController.UpdateCompany);
router.put('/status/:CompanyID', authMiddleware, isAdmin, companyMiddleware.UpdateCompanyStatusValidation, validateRequest, companyController.UpdateCompanyStatus);
router.get('/:CompanyID', optionalAuth, companyMiddleware.CompanyIdValidation, validateRequest, companyController.GetCompanyDetail);
router.get('/', optionalAuth, companyController.GetAllCompany);

export default router;