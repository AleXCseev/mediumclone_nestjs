import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto/createArtile.dto';
import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from "slugify";

@Injectable()
export class ArticleService {

    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) {}

    async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = new ArticleEntity()
        Object.assign(article, createArticleDto);

        if(!article.tagList) {
            article.tagList = [];
        }

        article.author = currentUser;
        article.slug = this.getSlug(createArticleDto.title);

        return await this.articleRepository.save(article);
    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.findBySlug(slug)

        if(!article) {
            throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
        }

        if(article.author.id !== currentUserId) {
            throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({slug});
    }

    async updateArticle(slug: string, updateArticleDto: CreateArticleDto, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug)

        if(!article) {
            throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
        }

        if(article.author.id !== currentUserId) {
            throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
        }

        Object.assign(article, updateArticleDto);

        return await this.articleRepository.save(article);
    }

    async findBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOne({
            where: {
                slug
            }
        })
    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article };
    }

    private getSlug(title: string): string {
        return slugify(title, {lower: true}) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}
