import { LoginUserDto } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { JWT_SECRET } from '@app/config';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {

        const userByEmail = await this.userRepository.findOne({
            where: {
                email: createUserDto.email
            }
        })

        const userByUsername = await this.userRepository.findOne({
            where: {
                username: createUserDto.username
            }
        })

        if(userByEmail || userByUsername) {
            throw new HttpException("Email or username are taken", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return await this.userRepository.save(newUser);
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email,
            },
            select: ["id", "username", "password", "bio", "image", "email"],
        })

        if(!user) {
            throw new HttpException("Credentials are not valid", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const isPasswordCorrect = await compare(loginUserDto.password, user.password)

        if(!isPasswordCorrect) {
            throw new HttpException("Credentials are not valid", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        delete user.password

        return user;
    }

    async findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({where: {id}});
    }

    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email,
        }, JWT_SECRET);
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }

 }