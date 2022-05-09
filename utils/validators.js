const validateRegister = (username, email, password, confirmPassword) => {
  const errors = {};

  if (!username || username.trim() === '') {
    errors['username'] = 'Username is required';
  }
  if (!email || email.trim() === '') {
    errors['email'] = 'Email is required';
  }
  if (username?.length < 6) {
    errors['username'] = 'Username must have atleast 6 characters';
  }
  if (!password || password.trim() === '') {
    errors['password'] = 'Password is required';
  }

  if (
    !confirmPassword ||
    confirmPassword.trim() === '' ||
    password !== confirmPassword
  ) {
    errors['password'] = 'Passwords donot match';
  }
  return {
    errors,
    valid: !Object.keys(errors).length > 0,
  };
};

const validateLogin = (email, password) => {
  const errors = {};

  if (!email || email.trim() === '') {
    errors['email'] = 'Email is required';
  }
  if (email?.length < 6) {
    errors['email'] = 'Email must have atleast 6 characters';
  }
  if (!password || password.trim() === '') {
    errors['password'] = 'Password is required';
  }

  return {
    errors,
    valid: !Object.keys(errors).length > 0,
  };
};

module.exports = {
  validateRegister,
  validateLogin,
};
