import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumAttribute1747772809859 implements MigrationInterface {
    name = 'AddColumAttribute1747772809859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "attributes" ADD COLUMN "requires_response" BOOLEAN NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "branch_attributes" ALTER COLUMN "value" DROP NOT NULL
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "attributes" DROP COLUMN "requires_response"
        `);
        await queryRunner.query(`
            ALTER TABLE "branch_attributes" ALTER COLUMN "value" SET NOT NULL
        `);
    }

}
