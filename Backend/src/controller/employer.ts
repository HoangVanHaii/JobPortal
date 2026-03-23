import { Request, Response, NextFunction } from "express";
import *as employerService from "../service/employer";
import { IEmployer } from "../interface/employer";

//get profile và danh sách công việc đã đăng