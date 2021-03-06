module.exports = (key, code, errors = {}) => {
  const messages = {
      ERRNOUSER: "Unable to find user.",
      ERRNOAUTH: "Invalid access token.",
      ERRNOTODO: "Unable to find todo item.",
      ERRNOCREATE: "Unable to create todo item.",
      ERREMAILEXISTS: "The email you used already exists.",
      ERREMAILREQUIRED: "You must supply an email address",
      ERRNOEMAIL: "The email you used does not exist",
      ERRPASSREQUIRED: "You must supply a password",
      ERRNOPASSWORD: "The password you used is incorrect.",
  };

  return {
      errors: {
          ...errors,
          [key]: {
              message: messages[code],
              code,
          }
      }
  }
};
