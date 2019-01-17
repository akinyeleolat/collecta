import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import db from '../db';


/** user controller class */

class UserController {
  /**
 * @function signup
 * @memberof UserController
 * @static
 */
  static signup(req, res) {
    const userStatus = process.env.USER_ACTIVE;
    let { branch_name, email, telephone, image, department, faculty } = req.body;
    const { password } = process.env.DEFAULT_PASSWORD;

    branch_name = branch_name ? branch_name.toString().replace(/\s+/g, '') : branch_name;
    telephone = telephone ? telephone.toString().replace(/\s+/g, '') : telephone;
    email = email ? email.toString().replace(/\s+/g, '') : email;
    image = image ? image.toString().replace(/\s+/g, '') : image;

    return db.task('signup', db => db.users.findByEmail(email)
      .then((result) => {
        if (result) {
          return res.status(409).json({
            success: 'false',
            message: 'user with this email already exist',
          });
        }
        return db.users.findByTelephone(telephone)
          .then((found) => {
            if (found) {
              return res.status(409).json({
                success: 'false',
                message: 'user with this telephone number already exist',
              });
            }
            return db.users.create({ branch_name, email, telephone, password, department, faculty, image, userStatus })
              .then((user) => {
                return res.status(201).json({
                  success: 'true',
                  message: `Account created successfully for ${user.branch_name}`
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
* @function login
* @memberof UserController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

static login(req, res) {
  let { email } = req.body;
  const { password } = req.body;
  email = email && email.toString().trim();

  return db.task('signin', data => data.users.findByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: 'false',
          message: 'You have entered an invalid email or password',
        });
      }
      const allowEntry = bcrypt.compareSync(password, user.password);
      if (!allowEntry) {
        return res.status(401).json({
          success: 'false',
          message: 'You have entered an invalid email or password',
        });
      }
      const isActive = process.env.USER_ACTIVE;
      const defaultPassword = process.env.DEFAULT_PASSWORD;
      if (user.user_status != isActive) {
        // resend activation link
        return res.status(401).json({
          success: 'false',
          message: 'Your account is pending activation, kindly contact the admin',
        });
        
      }
      else if(user.password === defaultPassword){
        return res.status(401).json({
          success: 'false',
          message: 'You cannot login with default password, kindly change your password'
        })
      }
      else if (user.user_status == isActive && user.password !== defaultPassword) {
        const token = jwt.sign({ id: user.id, branch_name:user.branch_name, email: user.email, telephone: user.telephone, user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '2hrs' });
        return res.status(200).json({
          success: 'true',
          message: 'Login was successful',
          token,
        });
      }
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
* @function changeUserPassword
* @memberof UserController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/
static changeUserPassword(req, res) {
  let { email } = req.body;
  const { password } = req.body;
  let { newPassword } = req.body;
  email = email && email.toString().trim();
  newPassword = newPassword && newPassword.toString().trim();

  return db.task('changePassword', data => data.users.findByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: 'false',
          message: 'You have entered an invalid email or password',
        });
      }
      const allowEntry = bcrypt.compareSync(password, user.password);
      if (!allowEntry) {
        return res.status(401).json({
          success: 'false',
          message: 'You have entered an invalid email or password',
        });
      }
      const isActive = process.env.USER_ACTIVE;
      if (user.user_status != isActive) {
        return res.status(401).json({
          success: 'false',
          message: 'Your account is pending activation, kindly contact the admin',
        });
        
      }
      else if (user.user_status === isActive && allowEntry) {
        const user_id = user.id;
        return db.users.modifyPassword({newPassword},user_id)
        .then((user) => {
          return res.status(200).json({
            success: 'true',
            message: `Password successfully for ${user.branch_name}`
          });
        });
      }
    }))
    .catch((err) => {
      return res.status(500).json({
        success: 'false',
        message: 'unable to change user password, try again!',
        err: err.message,
      });
    });
}
/**
 * @function getAllUsers
 * @memberof UserController
 *
 * @param {Object} req - this is a request object that contains whatever is requested for
 * @param {Object} res - this is a response object to be sent after attending to a request
 *
 * @static
 */

static getAllUsers(req, res) {
  const { adminId } = req;
  const adminStatus = process.env.ADMIN_ACTIVE;
  db.task('find admin user', db => db.admin.findById(adminId)
    .then((adminFound) => {
      if (adminFound.admin_status !== adminStatus) {
        return res.status(401).json({
          success: 'false',
          message: 'You are unauthorized to get candidates information',
        });
      }
      return db.users.allData()
        .then((user) => {
          const branches = [...user];
          return res.status(200).json({
            success: 'true',
            branches,
          });
        })
    })
    .catch((err) => {
      res.status(404).json({
        success: 'false',
        message: 'unable to retrieve branch details',
        err: err.message,
      });
    }));
}
/**
* @function getUser
* @memberof UserController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

static getUser(req, res) {
  const { userId } = req;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: 'false',
      message: 'param should be a number not an alphabet',
    });
  }
  return db.task('fetch user', data => data.users.findById(id)
    .then((user) => {
      if (user.id !== userId) {
        return res.status(401).json({
          success: 'false',
          message: 'You are unauthorized to get an information that is not yours',
        });
      }
      const { branch_name, email, telephone, image_url, user_status } = user;
      const branchProfile = {
        branch_name, email, telephone, image_url, user_status
      }

      return res.status(200).json({
        success: 'true',
        branchProfile,
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
export default UserController;
