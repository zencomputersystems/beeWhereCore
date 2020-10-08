import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AttendanceProfileModule } from './admin/attendance-profile/attendance-profile.module';
import { ClientModule } from './admin/client/client.module';
import { ProjectModule } from './admin/project/project.module';
import { LocationModule } from './admin/location/location.module';
import { ContractModule } from './admin/contract/contract.module';
import { ClockModule } from './api/clock/clock.module';
import { UserInfoModule } from './api/user-info/user-info.module';
import { SupportModule } from './admin/support/support.module';
import { LoginLogModule } from './api/login-log/login-log.module';
import { ReportModule } from './admin/report/report.module';

@Module({
  imports: [
    AuthModule,
    AttendanceProfileModule,
    ClientModule,
    ProjectModule,
    LocationModule,
    ContractModule,
    ClockModule,
    UserInfoModule,
    SupportModule,
    LoginLogModule,
    ReportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
