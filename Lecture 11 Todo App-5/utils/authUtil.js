const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );
  return isEmail;
};

const userDataValidation = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email) return reject("email is missing");
    if (!username) return reject("username is missing");
    if (!password) return reject("password is missing");

    if (typeof name !== "string") return reject("name is not a text");
    if (typeof email !== "string") return reject("email is not a text");
    if (typeof username !== "string") return reject("username is not a text");
    if (typeof password !== "string") return reject("password is not a text");

    if (username.length < 3 || username.length > 50)
      return reject("Username length should be 3-50");

    if (!isEmailValidate({ key: email }))
      return reject("Email format is incorrect");

    resolve();
  });
};

module.exports = { userDataValidation, isEmailValidate };
