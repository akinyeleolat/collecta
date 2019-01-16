/**
 * This is a validation for user sign up
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */

const signupError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  
  /**
   * This is a validation for user signup
   * @constant
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   *
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validateUserCreation
   */
  
  
  const validateUserCreation = (req, res, next) => {
    let {
      email, password, branch_name, telephone, image,
    } = req.body;
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
    email = email && email.toString().trim();
    branch_name = lastname && lastname.toString().trim();
    password = password && password.toString();
    telephone = telephone && telephone.toString().replace(/\s+/g, '');

  
    if (!email && !password) return next(signupError('Email and Password are required'));
  
    if (!email) return next(signupError('Email is required'));
    if (!emailRegex.test(email)) return next(signupError('Email is not valid'));
    if (!image) return next(signupError('Passport photograph is required'));
    if (!urlRegex.test(image)) return next(signupError('URL is not valid'));
    if (!password) return next(signupError('Password is required'));
    if (password.trim() === '') return next(signupError('Password cannot be empty'));
    if (password.length < 6) return next(signupError('Password must be minimum of 6 characters'));
  
    if (!branch_name) return next(signupError('branch name is required'));
    if (branch_name && branch_name.length < 10) return next(signupError('branch name must be minimum of 10 characters'));
    if (branch_name && branch_name.length > 20) return next(signupError('branch name must be maximum of 20 characters'));
  
    
    if (!telephone) return next(signupError('telephone number should be provided'));
    if (telephone && isNaN(telephone)) return next(signupError('telephone number should not contain an alphabet'));
    if (telephone && telephone.length > 11) return next(signupError('telephone number should not be greater than 11 characters'));
    if (telephone && telephone.length < 11) return next(signupError('telephone number should not be less than 11 characters'));
  
    return next();
  };
  
  export default validateUserCreation;
  