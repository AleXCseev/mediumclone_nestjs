import { TagEntity } from '@app/tag/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from '@app/tag/tag.service';
import { TagController } from '@app/tag/tag.controller';
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    controllers: [TagController],
    providers: [TagService],

})
export class TagModule {

}