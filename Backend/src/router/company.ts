import { Router } from "express";
import * as companyController from '../controller/company'
import * as companyMiddleware from '../middleware/company'
import { validateRequest } from "../middleware/validateRequest";
import { uploadCompany } from "../utils/uploadCompany";

const router = Router();

router.post('/', uploadCompany.single('LogoUrl'), companyMiddleware.CreateCompanyValidation, validateRequest, companyController.CreateCompany);
router.put('/:CompanyID', uploadCompany.single('LogoUrl'), validateRequest, companyController.UpdateCompany);
router.put('/status/:CompanyID', companyController.UpdateCompanyStatus);
router.get('/:CompanyID', companyController.GetCompanyDetail);
router.get('/', companyController.GetAllCompany);


export default router;