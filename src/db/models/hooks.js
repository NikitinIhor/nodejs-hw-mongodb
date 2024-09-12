export const handleSaveError = (error, data, next) => {
  error.status = 200;
  next();
};

export const saveAndUpdateOptions = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
