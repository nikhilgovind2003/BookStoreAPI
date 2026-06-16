import { body, param } from 'express-validator';

export const createUserValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('surName')
    .notEmpty().withMessage('Surname is required')
    .isLength({ min: 2, max: 50 }).withMessage('Surname must be between 2 and 50 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email'),

  body('issuedBook')
    .optional()
    .isMongoId().withMessage('issuedBook must be a valid MongoDB ObjectId'),

  body('issuedDate')
    .optional()
    .isISO8601().withMessage('issuedDate must be a valid date (YYYY-MM-DD)'),

  body('returnDate')
    .optional()
    .isISO8601().withMessage('returnDate must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (req.body.issuedDate && new Date(value) <= new Date(req.body.issuedDate)) {
        throw new Error('returnDate must be after issuedDate');
      }
      return true;
    }),

  body('subsrciptionType')
    .notEmpty().withMessage('Subscription type is required')
    .isIn(['basic', 'standard', 'premium']).withMessage('Subscription type must be basic, standard, or premium'),

  body('subsrciptionDate')
    .notEmpty().withMessage('Subscription date is required')
    .isISO8601().withMessage('subsrciptionDate must be a valid date (YYYY-MM-DD)'),
];

export const updateUserValidator = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),

  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('surName')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Surname must be between 2 and 50 characters'),

  body('email')
    .optional()
    .isEmail().withMessage('Enter a valid email'),

  body('issuedBook')
    .optional()
    .isMongoId().withMessage('issuedBook must be a valid MongoDB ObjectId'),

  body('issuedDate')
    .optional()
    .isISO8601().withMessage('issuedDate must be a valid date (YYYY-MM-DD)'),

  body('returnDate')
    .optional()
    .isISO8601().withMessage('returnDate must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (req.body.issuedDate && new Date(value) <= new Date(req.body.issuedDate)) {
        throw new Error('returnDate must be after issuedDate');
      }
      return true;
    }),

  body('subsrciptionType')
    .optional()
    .isIn(['basic', 'standard', 'premium']).withMessage('Subscription type must be basic, standard, or premium'),

  body('subsrciptionDate')
    .optional()
    .isISO8601().withMessage('subsrciptionDate must be a valid date (YYYY-MM-DD)'),
];

export const getUserByIdValidator = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
];