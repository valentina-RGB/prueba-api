import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDefaultValue1744331601065 implements MigrationInterface {
    name = 'ChangeDefaultValue1744331601065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "status" SET DEFAULT 'APPROVED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
    }

}
