const registerController = (req, res) => {
  console.log("in registerController router");
  return res.send("registerController is working");
};

const loginController = (req, res) => {
  console.log("in loginController router");
  return res.send("loginController is working");
};

module.exports = { registerController, loginController };
