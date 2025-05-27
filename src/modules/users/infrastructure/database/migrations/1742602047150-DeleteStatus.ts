import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteStatus1742602047150 implements MigrationInterface {
    name = 'DeleteStatus1742602047150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "people" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "people" ADD "status" boolean NOT NULL`);
    }

}
