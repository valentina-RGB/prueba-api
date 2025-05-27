import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableDocTypes1742342573443 implements MigrationInterface {
    name = 'CreateTableDocTypes1742342573443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doc_types" ("id" SERIAL NOT NULL, "abbreviation" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_672c64b3bf9797cce057ffdc5e4" UNIQUE ("abbreviation"), CONSTRAINT "UQ_a45de9fa90b99d358e7f3189353" UNIQUE ("name"), CONSTRAINT "PK_d7076ae618c114cd7a46720a00e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "doc_types"`);
    }

}
