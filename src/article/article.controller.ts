import { ArticleResponseInterface } from './types/articleResponse.interface';
import { CreateArticleDto } from '@app/article/dto/createArtile.dto';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ArticleService } from '@app/article/article.service';
import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { User } from '@app/user/decorators/user.decorator';


@Controller('articles')
export class ArticleController {

    constructor(private readonly articleService: ArticleService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@User() currentUser: UserEntity, @Body("article") createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createArticle(currentUser, createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Get(":slug")
    async getSingleArticle(@Param("slug") slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.findBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }
}
