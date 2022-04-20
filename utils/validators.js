const validateRegister = (username, password, confirmPassword) => {
  const errors = {};

  if (!username || username.trim() === '') {
    errors['username'] = 'Username is required';
  }
  if (username?.length < 6) {
    errors['username'] = 'Username must have 6 characters';
  }
  if (!password || password.trim() === '') {
    errors['password'] = 'Password is required';
  }

  if (
    !confirmPassword ||
    confirmPassword.trim() === '' ||
    password !== confirmPassword
  ) {
    errors['password'] = "Password doesn't match";
  }
  return {
    errors,
    valid: !Object.keys(errors).length > 0,
  };
};

const validateLogin = (username, password) => {
  const errors = {};

  if (!username || username.trim() === '') {
    errors['username'] = 'Username is required';
  }
  if (username?.length < 6) {
    errors['username'] = 'Username must have 6 characters';
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
