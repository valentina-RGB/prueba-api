import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraint1747175605880 implements MigrationInterface {
  name = 'AddUniqueConstraint1747175605880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" DROP CONSTRAINT "FK_branch_schedule_branch_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" DROP CONSTRAINT "UQ_branch_day"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" ALTER COLUMN "branch_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_attributes" ADD CONSTRAINT "UQ_b89e4ce22e6ed22c40ea4952430" UNIQUE ("branch_id", "attribute_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" ADD CONSTRAINT "FK_86f8147b1d1e0b9c56e2af24d21" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" DROP CONSTRAINT "FK_86f8147b1d1e0b9c56e2af24d21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_attributes" DROP CONSTRAINT "UQ_b89e4ce22e6ed22c40ea4952430"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" ALTER COLUMN "branch_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" ADD CONSTRAINT "UQ_branch_day" UNIQUE ("branch_id", "day")`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_schedule" ADD CONSTRAINT "FK_branch_schedule_branch_id" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
