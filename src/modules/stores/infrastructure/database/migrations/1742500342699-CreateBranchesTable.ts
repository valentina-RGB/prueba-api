import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBranchesTable1742500342699 implements MigrationInterface {
  name = 'CreateBranchesTable1742500342699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "branches" ("id" SERIAL NOT NULL, "store_id" integer NOT NULL, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "location_id" integer NOT NULL, "average_rating" integer NOT NULL, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_12c0000a82438ce72693d7fdb8" UNIQUE ("location_id"), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "branches"`);
  }
}
