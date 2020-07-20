import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./passport/jwt.strategy";
import { QueryParserService } from "../common/helper/query-parser.service";
import { getModuleHttp } from "../common/helper/basic-function.service";
import { UserService } from './user.service';
import { UsereLeaveDbService } from '../common/db/table.db.service';

@Module({
  providers: [
    QueryParserService,
    AuthService,
    JwtStrategy,
    UserService,
    UsereLeaveDbService
  ],
  controllers: [
  ],
  imports: [
    PassportModule.register({ session: false }),
    getModuleHttp()
  ]
})
export class AuthModule { }