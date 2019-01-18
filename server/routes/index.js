import express from 'express';
import UserController from '../controllers/users';
import AdminController from '../controllers/admin';
import middlewares from '../middlewares';

const router = express.Router();


router.post('/auth/login', middlewares.validateLogin, UserController.login);
router.post('/auth/changepassword',middlewares.validateLogin, UserController.changeUserPassword);
router.post('/auth/admin/signup', middlewares.validateSignup, AdminController.adminSignup);
router.post('/auth/admin/login', middlewares.validateLogin, AdminController.adminLogin);
router.get('/users/:id', middlewares.verifyUserToken, UserController.getUser);



router.use('*', middlewares.verifyAdminToken);
router.post('/auth/signup', middlewares.validateUserCreation, UserController.signup);
router.get('/users', UserController.getAllUsers);
router.get('/admin',AdminController.getAllAdminUsers);
router.get('/admin/:id',AdminController.getAdmin);



export default router;
