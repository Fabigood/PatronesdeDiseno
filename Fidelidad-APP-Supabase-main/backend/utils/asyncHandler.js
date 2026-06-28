module.exports = function asyncHandler(controllerAction) {
  return (req, res, next) => {
    Promise.resolve(controllerAction(req, res, next)).catch(next);
  };
};
