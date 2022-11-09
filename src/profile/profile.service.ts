import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { ProfileType } from '@app/profile/types/profile.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>
    ) {}

    async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: {
                username: profileUsername
            }
        })

        if(!user) {
            throw new HttpException("Profile does not exist", HttpStatus.NOT_FOUND)
        }

        return { ...user, following: false };
    }

    async followProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: {
                username: profileUsername
            }
        })

        if(!user) {
            throw new HttpException("Profile does not exist", HttpStatus.NOT_FOUND)
        }

        if(currentUserId === user.id) {
            throw new HttpException("Follower and following cant be equal", HttpStatus.BAD_REQUEST)
        }

        const follow = await this.followRepository.findOne({
            where: {
                followerId: currentUserId,
                followingId: user.id
            }
        })

        if(!follow) {
            const followToCreate = new FollowEntity();
            followToCreate.followerId = currentUserId;
            followToCreate.followingId = user.id;
            await this.followRepository.save(followToCreate);
        }

        return { ...user, following: true };
    }

    buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
        delete profile.email;
        return {
            profile
        }
    }
}
