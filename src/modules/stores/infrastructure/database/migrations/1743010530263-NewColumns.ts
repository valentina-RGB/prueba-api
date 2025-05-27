import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumns1743010530263 implements MigrationInterface {
    name = 'NewColumns1743010530263';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" ADD "latitude" double precision NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "longitude" double precision NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "address" character varying NOT NULL DEFAULT ''`);

        const hasLocationId = await queryRunner.hasColumn("branches", "location_id");
        if (hasLocationId) {
            await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "location_id"`);
        }

        const hasConstraint = await queryRunner.query(`
            SELECT conname
            FROM pg_constraint
            WHERE conname = 'REL_12c0000a82438ce72693d7fdb8'
        `);
        if (hasConstraint.length > 0) {
            await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "REL_12c0000a82438ce72693d7fdb8"`);
        }

        await queryRunner.query(`DROP TABLE "locations"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" ADD "location_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "REL_12c0000a82438ce72693d7fdb8" UNIQUE ("location_id")`);

        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "latitude"`);
    }
}
