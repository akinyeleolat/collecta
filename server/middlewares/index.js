import validateSignup from './validateSignup';
import validateUserCreation from './validateUserCreation';
import validateLogin from './validateLogin';
import verifyUserToken from './verifyUserToken';
import verifyAdminToken from './verifyAdminToken';
import validatePersonalData from './validatePersonalData';
import validateChurchData from './validateChurchData';
import validateEnrollmentData from './validateEnrollmentData';
import validateAcademicData from './validateAcademicData';
import validateReferenceData from './validateReferenceData';



const middlewares = {
  validateSignup,
  validateUserCreation,
  validateLogin,
  verifyUserToken,
  verifyAdminToken,
  validatePersonalData,
  validateChurchData,
  validateAcademicData,
  validateEnrollmentData,
  validateReferenceData
};

export default middlewares;
