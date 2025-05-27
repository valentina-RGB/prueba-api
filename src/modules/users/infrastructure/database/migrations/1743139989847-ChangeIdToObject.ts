import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdToObject1743139989847 implements MigrationInterface {
    name = 'ChangeIdToObject1743139989847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "person_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "people" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "people" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "person_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
