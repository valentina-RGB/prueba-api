import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelations1743125497647 implements MigrationInterface {
    name = 'UpdateRelations1743125497647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "FK_person_administrators"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_e389069d209025c68d87775abaf" UNIQUE ("person_id")`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "UQ_e2bceeacac0dd5be3d8c37b068c" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "UQ_3c7539cbee447538ad5ca2fc74c" UNIQUE ("number_document")`);
        await queryRunner.query(`ALTER TABLE "people" ALTER COLUMN "phone_number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP COLUMN "admin_type"`);
        await queryRunner.query(`DROP TYPE "public"."administrators_admin_type_enum"`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD "admin_type" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "UQ_385b361b35deec07a13653ef580" UNIQUE ("person_id")`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "FK_385b361b35deec07a13653ef580" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "fk_admin_store" FOREIGN KEY ("entity_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "fk_admin_branch" FOREIGN KEY ("entity_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "fk_admin_branch"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "fk_admin_store"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "FK_385b361b35deec07a13653ef580"`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "UQ_385b361b35deec07a13653ef580"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP COLUMN "admin_type"`);
        await queryRunner.query(`CREATE TYPE "public"."administrators_admin_type_enum" AS ENUM('SYSTEM', 'STORE', 'BRANCH')`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD "admin_type" "public"."administrators_admin_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" ALTER COLUMN "phone_number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "UQ_3c7539cbee447538ad5ca2fc74c"`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "UQ_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "FK_person_administrators" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
