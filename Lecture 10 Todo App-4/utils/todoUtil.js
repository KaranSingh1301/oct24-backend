const todoDataValidation = ({ todo }) => {
  return new Promise((resolve, reject) => {
    if (!todo) return reject("Todo is missing");
    if (typeof todo !== "string") return reject("Todo is not text.");

    if (todo.length < 3 || todo.length > 100)
      return reject("Todo length should be 3-100");

    resolve();
  });
};

module.exports = todoDataValidation;
