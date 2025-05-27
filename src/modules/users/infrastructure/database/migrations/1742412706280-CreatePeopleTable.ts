import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeopleTable1742412706280 implements MigrationInterface {
  name = 'CreatePeopleTable1742412706280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "people" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "type_document_id" integer NOT NULL, "number_document" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "status" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aa866e71353ee94c6cc51059c5b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "people"`);
  }
}
