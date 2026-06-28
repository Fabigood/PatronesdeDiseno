class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    const token = await this.authService.login(req.body);
    res.json({ token });
  };
}

module.exports = AuthController;
