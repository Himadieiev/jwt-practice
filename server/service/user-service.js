const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model.js');
const mailService = require('../service/mail-service.js');
const tokenService = require('../service/token-service.js');
const UserDto = require('../dtos/user-dto.js');
const ApiError = require('../exceptions/api-error.js');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Користувач з поштою ${email} вже існує`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({ email, password: hashPassword, activationLink });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/active/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Некоректне посилання активації');
    }

    user.isActivated = true;
    await user.save();
  }
}

module.exports = new UserService();
