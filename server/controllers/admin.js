import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import db from '../db';


/** user controller class */

class AdminController {
  /**
* @function adminSignup
* @memberof AdminController
* @static
*/
  static adminSignup(req, res) {
    const adminStatus = process.env.ADMIN_ACTIVE;
    let { firstname, lastname, email, telephone, image, } = req.body;
    const { password } = req.body;
    firstname = firstname ? firstname.toString().replace(/\s+/g, '') : firstname;
    lastname = lastname ? lastname.toString().replace(/\s+/g, '') : lastname;
    telephone = telephone ? telephone.toString().replace(/\s+/g, '') : telephone;
    email = email ? email.toString().replace(/\s+/g, '') : email;
    image = image ? image.toString().replace(/\s+/g, '') : image;

    return db.task('signup', db => db.admin.findByEmail(email)
      .then((result) => {
        if (result) {
          return res.status(409).json({
            success: 'false',
            message: 'user with this email already exist',
          });
        }
        return db.admin.findByTelephone(telephone)
          .then((found) => {
            if (found) {
              return res.status(409).json({
                success: 'false',
                message: 'user with this telephone number already exist',
              });
            }
            return db.admin.create({ firstname, lastname, email, telephone, password, image, adminStatus })
              .then((user) => {
                const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, telephone: user.telephone,  user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '2hrs' });
                // console.log(token)
                // send activation link
                return res.status(201).json({
                  success: 'true',
                  message: 'Account created successfully',
                });
              });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: 'false',
          message: 'unable to create user account',
          err: err.message,
        });
      }));
  }

  /**
  * @function adminlogin
  * @memberof AdminController
  *
  * @param {Object} req - this is a request object that contains whatever is requested for
  * @param {Object} res - this is a response object to be sent after attending to a request
  *
  * @static
  */

 static adminLogin(req, res) {
  let { email } = req.body;
  const { password } = req.body;
  email = email && email.toString().trim();

  db.task('signin', data => data.admin.findByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: 'false',
          message: 'You have entered an invalid email or password',
        });
      }
      const allowEntry = bcrypt.compareSync(password, user.admin_password);
      if (!allowEntry) {
        return res.status(401).json({
          success: 'false',
          message: 'You have entered an invalid email or password',
        });
      }
      const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, telephone: user.telephone,  user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '2hrs' });
      return res.status(200).json({
        success: 'true',
        message: 'Login was successful',
        token,
      });
    }))
    .catch((err) => {
      return res.status(500).json({
        success: 'false',
        message: 'unable to login, try again!',
        err: err.message,
      });
    });
}
/**
* @function getAllAdminUsers
* @memberof AdminController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

static getAllAdminUsers(req, res) {
  const { adminId } = req;
  const superAdminStatus = process.env.ADMIN_SUPER;
  db.task('find admin user', db => db.admin.findById(adminId)
    .then((adminFound) => {
      if (adminFound.admin_status != superAdminStatus) {
        return res.status(401).json({
          success: 'false',
          message: 'You are unauthorized to get administrator information',
        });
      }
      return db.admin.allData()
        .then((user) => {
          const administrators = [...user];
          return res.status(200).json({
            success: 'true',
            administrators,
          });
        })
    })
    .catch((err) => {
      res.status(404).json({
        success: 'false',
        message: 'unable to get administrator information',
        err: err.message,
      });
    }));
}
/**
* @function getAdminUser
* @memberof AdminController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

static getAdmin(req, res) {
  const { adminId } = req;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: 'false',
      message: 'param should be a number not an alphabet',
    });
  }
  return db.task('fetch user', data => data.admin.findById(id)
    .then((admin) => {
      if (admin.id !== adminId) {
        return res.status(401).json({
          success: 'false',
          message: 'You are unauthorized to get an information that is not yours',
        });
      }
      const { firstname, lastname, email, telephone, image_url, adminStatus, } = admin;
      const adminProfile = {
        firstname, lastname, email, telephone, image_url, adminStatus,
      }

      return res.status(200).json({
        success: 'true',
        adminProfile,
      })
    })
    .catch((err) => {
      res.status(500).json({
        success: 'false',
        message: err.message,
      })
    }));
}  
}

export default AdminController;
