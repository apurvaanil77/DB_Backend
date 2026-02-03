const { validationResult } = require("express-validator");

const routeUtils = {
  validate: (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);

    if (errors.isEmpty()) {
      next();
    } else {
      return res
        .status(422)
        .json({ errors: routeUtils.formatValidateError(errors) });
    }
  },

  formatValidateError: (errors) => {
    const error = new Error("Unexpected input value");
    error.errorCode = "BE-0422";
    error.status = 422;
    error.meta = { errors: errors.mapped() };
    error.name = "ValidationError";
    return error;
  },
};

module.exports = routeUtils;
