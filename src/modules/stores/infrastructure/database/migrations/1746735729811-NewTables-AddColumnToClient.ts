import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTablesAddColumnToClient1746735729811
  implements MigrationInterface
{
  name = 'NewTablesAddColumnToClient1746735729811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "register_visit" ("id" SERIAL NOT NULL, "visit_date" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" integer, "client_id" integer, CONSTRAINT "PK_26b18cef47e18a1f5a573fdd519" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attributes" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_89afb34fd1fdb2ceb1cea6c57df" UNIQUE ("name"), CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "branch_attributes" ("id" SERIAL NOT NULL, "value" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" integer, "attribute_id" integer, CONSTRAINT "PK_816806be80068718413c2bddb95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "coffee_coins" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "register_visit" ADD CONSTRAINT "FK_ae8be18d98d037014fc481da496" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "register_visit" ADD CONSTRAINT "FK_499f364a4ab225856af79722594" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_attributes" ADD CONSTRAINT "FK_1565f5045990725eb627f2a3734" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_attributes" ADD CONSTRAINT "FK_bd64fad3b608594f0e6fc0df542" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "branch_attributes" DROP CONSTRAINT "FK_bd64fad3b608594f0e6fc0df542"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_attributes" DROP CONSTRAINT "FK_1565f5045990725eb627f2a3734"`,
    );
    await queryRunner.query(
      `ALTER TABLE "register_visit" DROP CONSTRAINT "FK_499f364a4ab225856af79722594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "register_visit" DROP CONSTRAINT "FK_ae8be18d98d037014fc481da496"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "comment" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "coffee_coins"`);
    await queryRunner.query(`DROP TABLE "branch_attributes"`);
    await queryRunner.query(`DROP TABLE "attributes"`);
    await queryRunner.query(`DROP TABLE "register_visit"`);
  }
}
