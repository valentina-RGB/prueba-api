import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewAdministratorsTable1743024908779 implements MigrationInterface {
  name = 'NewAdministratorsTable1743024908779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."administrators_admin_type_enum" AS ENUM('SYSTEM', 'STORE', 'BRANCH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administrators" (
        "id" SERIAL NOT NULL, 
        "admin_type" "public"."administrators_admin_type_enum" NOT NULL, 
        "entity_id" integer, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "person_id" integer, 
        CONSTRAINT "PK_aaa48522d99c3b6b33fdea7dc2f" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
     `ALTER TABLE "administrators" ADD CONSTRAINT "FK_person_administrators" 
     FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "administrators"`);
    await queryRunner.query(
      `DROP TYPE "public"."administrators_admin_type_enum"`,
    );
  }
}