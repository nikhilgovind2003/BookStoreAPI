import { body } from 'express-validator';

export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('surName').notEmpty().withMessage('Surname is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('subsrciptionType').optional().isIn(['basic','standard','premium']).withMessage('Subscription type must be basic, standard or premium'),
  body('subsrciptionDate').optional().isISO8601().withMessage('subsrciptionDate must be a valid date (YYYY-MM-DD)'),
];

export const loginValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
