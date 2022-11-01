import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, AuthGuard],
    exports: [UserService],

})
export class UserModule {

}