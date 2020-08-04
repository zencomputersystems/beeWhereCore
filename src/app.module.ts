import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AttendanceProfileModule } from './admin/attendance-profile/attendance-profile.module';
import { ClientModule } from './admin/client/client.module';

@Module({
  imports: [
    AuthModule,
    AttendanceProfileModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
