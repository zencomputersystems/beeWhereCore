import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './api/client/client.module';
import { ProjectModule } from './api/project/project.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceProfileModule } from './admin/attendance-profile/attendance-profile.module';

@Module({
  imports: [
    AuthModule,
    AttendanceProfileModule,
    ClientModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
