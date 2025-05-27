import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAverageRaiting1742600319434 implements MigrationInterface {
    name = 'UpdateAverageRaiting1742600319434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "average_rating" numeric(2,1) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "average_rating" integer NOT NULL`);
    }

}
