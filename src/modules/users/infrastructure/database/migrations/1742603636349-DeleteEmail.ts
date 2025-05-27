import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteEmail1742603636349 implements MigrationInterface {
    name = 'DeleteEmail1742603636349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "people" DROP COLUMN "email"`);}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "people" ADD "email" character varying NOT NULL`);
    }

}
