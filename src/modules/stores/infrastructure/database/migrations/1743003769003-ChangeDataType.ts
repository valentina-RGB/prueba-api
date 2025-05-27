import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDataType1743003769003 implements MigrationInterface {
    name = 'ChangeDataType1743003769003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "type_document_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "type_document" character varying NOT NULL DEFAULT 'CC'`);
        await queryRunner.query(`DROP TABLE "doc_types"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "type_document"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "type_document_id" integer NOT NULL`);
    }

}


