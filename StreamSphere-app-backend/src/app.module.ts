import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieCatagoryModule } from './movie-catagory/movie-catagory.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { FileUploadModule } from './common/file-upload/file-upload.module';
import { EmailModule } from './common/email/email.module';
import { WatchtimeModule } from './watchtime/watchtime.module';
import { ContactModule } from './contact-us/contact-us.module';
import { PaymentsModule } from './common/payments/payments.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('mongoUri'),
            }),
        }),
        AuthModule,
        UsersModule,
        MovieCatagoryModule,
        MoviesModule,
        FileUploadModule,
        EmailModule,
        WatchtimeModule,
        ContactModule,
        PaymentsModule,
        AdminModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
