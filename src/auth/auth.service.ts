import { Injectable, UnauthorizedException } from "@nestjs/common";
import { sign } from 'jsonwebtoken';
import { UserMainModel } from '../common/model/user-main.model';
import { UserService } from "./user.service";

/**
 * Auth Service : use to create jwt token and verify login
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   *Creates an instance of AuthService.
   * @param {UserService} userService
   * @memberof AuthService
   */
  constructor(private readonly userService: UserService) { }

  /**
   * Create JWT token and set expiry period
   *
   * @param {UserMainModel} signedUser
   * @returns
   * @memberof AuthService
   */
  public async createToken(signedUser: UserMainModel) {
    // 3300(55m) 28800(8h) 600(10m)
    const expiresIn = 28800, secretOrKey = 'this_is_secret';
    const user = {
      loginId: signedUser.LOGIN_ID,
      email: signedUser.EMAIL,
      userId: signedUser.USER_GUID,
      fullname: signedUser.FULLNAME,
      role: signedUser.ROLE
    };
    return {
      status: signedUser.ACTIVATION_FLAG,
      role: signedUser.ROLE,
      expires_in: expiresIn,
      access_token: await sign(user, secretOrKey, { expiresIn })
    }
  }

  /**
   * Verify the JWT token data by payload and get data from db
   *
   * @param {*} payload
   * @returns
   * @memberof AuthService
   */
  public async verify(payload) {
    return await this.userService.findOneByPayload(payload)
      .then(async user => {
        return (user.data.resource.length > 0)
          ? Promise.resolve(user.data.resource[0])
          : Promise.reject(new UnauthorizedException('Invalid Authorization'))
      })
  }

}