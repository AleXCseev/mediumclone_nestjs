import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserService } from '@app/user/user.service';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { LoginUserDto } from '@app/user/dto/loginUser.dto';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post("users")
    @UsePipes(new ValidationPipe())
    async createUser(@Body("user") createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post("users/login")
    @UsePipes(new ValidationPipe())
    async login(@Body("user") loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
        const user =  await this.userService.login(loginUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get("user")
    async currentUser(@Req() request: ExpressRequestInterface) {
        console.log(request.user)
        return this.userService.buildUserResponse(request.user);
    }
}