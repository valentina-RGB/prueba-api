import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUnusedColumn1744400639760 implements MigrationInterface {
    name = 'RemoveUnusedColumn1744400639760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "admin_comments"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "status" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "admin_comments" text`);
    }

}
