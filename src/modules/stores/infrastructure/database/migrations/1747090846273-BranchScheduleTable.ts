import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchScheduleTable1747090846273 implements MigrationInterface {
  name = 'BranchScheduleTable1747090846273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
             CREATE TABLE "branch_schedule" (
                "id" SERIAL NOT NULL, 
                "branch_id" INTEGER NOT NULL, 
                "day" VARCHAR(9) NOT NULL, 
                "open_time" TIME NOT NULL, 
                "close_time" TIME NOT NULL, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_d689cf4e642d5875a797ad0f0f4" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_branch_day" UNIQUE ("branch_id", "day")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "branch_schedule" 
            ADD CONSTRAINT "FK_branch_schedule_branch_id" 
            FOREIGN KEY ("branch_id") 
            REFERENCES "branches"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "attributes" ADD COLUMN "description" VARCHAR(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "attributes" DROP COLUMN "description"
        `);

    await queryRunner.query(`
            ALTER TABLE "branch_schedule" DROP CONSTRAINT "FK_branch_schedule_branch_id"
        `);

    await queryRunner.query(`
            DROP TABLE "branch_schedule"
        `);
  }
}
