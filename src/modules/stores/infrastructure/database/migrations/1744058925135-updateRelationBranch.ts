import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationBranch1744058925135 implements MigrationInterface {
    name = 'UpdateRelationBranch1744058925135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "social_networks" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "UQ_c583d61759c0d1c11095b81032c" UNIQUE ("name"),
                CONSTRAINT "PK_973974c10fd4f3f1625c24178cc" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "social_branches" (
                "id" SERIAL NOT NULL,
                "description" character varying(100) NOT NULL,
                "url" character varying(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "branch_id" integer,
                "social_network_id" integer,
                CONSTRAINT "PK_d72afb188381d6b9e4640a60227" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "branches"
            ADD CONSTRAINT "UQ_8387ed27b3d4ca53ec3fc7b029c" UNIQUE ("name")
        `);

        await queryRunner.query(`
            ALTER TABLE "social_branches"
            ADD CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09"
            FOREIGN KEY ("branch_id") REFERENCES "branches"("id")
             ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "social_branches"
            ADD CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965"
            FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id")
             ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "social_branches" DROP CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965"
        `);

        await queryRunner.query(`
            ALTER TABLE "social_branches" DROP CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09"
        `);

        await queryRunner.query(`
            ALTER TABLE "branches" DROP CONSTRAINT "UQ_8387ed27b3d4ca53ec3fc7b029c"
        `);

        await queryRunner.query(`DROP TABLE "social_branches"`);
        await queryRunner.query(`DROP TABLE "social_networks"`);
    }
}
