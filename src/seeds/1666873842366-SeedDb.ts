import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1666873842366 implements MigrationInterface {
    name = 'SeedDb1666873842366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`
        );

        await queryRunner.query(
            // password 123
            `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$Jina2WIjLNL1z4ZKfAjJdu0x9g2GTVAFg2Ajjt1odaldZiUoks3r2')`
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'first article', 'first article desc', 'first article body', 'coffee, dragons', 1)`
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'second article', 'second article desc', 'second article body', 'coffee, dragons', 1)`
        );
    }

    public async down(): Promise<void> {}

}
