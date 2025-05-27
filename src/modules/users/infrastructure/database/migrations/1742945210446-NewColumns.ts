import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumns1742945210446 implements MigrationInterface {
    name = 'NewColumns1742945210446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_2d50e68f69d4a336cefb9bb85c1"`);
        await queryRunner.query(`ALTER TABLE "people" RENAME COLUMN "type_document_id" TO "type_document"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id_google" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" DROP COLUMN "type_document"`);
        await queryRunner.query(`ALTER TABLE "people" ADD "type_document" character varying NOT NULL DEFAULT 'CC'`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`ALTER TABLE "people" DROP COLUMN "type_document"`);
        await queryRunner.query(`ALTER TABLE "people" ADD "type_document" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id_google"`);
        await queryRunner.query(`ALTER TABLE "people" RENAME COLUMN "type_document" TO "type_document_id"`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_2d50e68f69d4a336cefb9bb85c1" FOREIGN KEY ("type_document_id") REFERENCES "doc_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
