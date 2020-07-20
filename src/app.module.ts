import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './api/client/client.module';
import { ProjectModule } from './api/project/project.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
