import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteEmail1742605605920 implements MigrationInterface {
    name = 'DeleteEmail1742605605920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d" UNIQUE ("email")`);
    }

}
