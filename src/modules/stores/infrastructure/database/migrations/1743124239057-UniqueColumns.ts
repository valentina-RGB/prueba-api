import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueColumns1743124239057 implements MigrationInterface {
  name = 'UniqueColumns1743124239057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "UQ_87d3975a5d6cb149a971e87920e" UNIQUE ("number_document")`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT "UQ_87d3975a5d6cb149a971e87920e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrators" ADD CONSTRAINT "FK_person_administrators" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
