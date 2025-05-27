import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueColumn1745600039227 implements MigrationInterface {
  name = 'AddUniqueColumn1745600039227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "UQ_2c85c318a6c245b0eecc2081952" UNIQUE ("title")`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ALTER COLUMN "logo" TYPE VARCHAR`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "logo"`);
    await queryRunner.query(
      `ALTER TABLE "albums" ALTER COLUMN "logo" TYPE TEXT`,
    );
  }
}
