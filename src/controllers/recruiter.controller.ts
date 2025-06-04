import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../errors/catchAsync";
import AppResponse from "../helpers/AppResponse";
import { Student, Mentor, Recruiter, User } from "../models/user.model"
import AppError from "../errors/AppError";
import { IUser } from "../interfaces/IUser";
import sendMail from "../config/nodemailer.config";
import { GenerateAccessToken, GenerateRefreshToken } from "../helpers/GenerateToken";
import { NODE_ENV, RefreshToken_Secret_Key } from "../serviceUrl";
import GenerateRandomId, { generateRandomAlphanumeric } from "../helpers/GenerateRandomId";
import { logger } from "handlebars";