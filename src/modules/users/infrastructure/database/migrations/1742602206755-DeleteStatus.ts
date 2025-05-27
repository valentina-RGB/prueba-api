import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteStatus1742602206755 implements MigrationInterface {
  name = 'DeleteStatus1742602206755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "status"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "status" boolean NOT NULL`,
    );
  }
}
