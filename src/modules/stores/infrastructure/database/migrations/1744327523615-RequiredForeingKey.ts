import { MigrationInterface, QueryRunner } from "typeorm";

export class RequiredForeingKey1744327523615 implements MigrationInterface {
    name = 'RequiredForeingKey1744327523615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_branches" RENAME COLUMN "url" TO "value"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_4364e40940ae7a8bf91297ec76b"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_e0edfc8c49331c44cc1d11c0a1d"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ALTER COLUMN "criteria_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ALTER COLUMN "approval_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_da40fa1299b93c4563afb41b528"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ALTER COLUMN "branch_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_4364e40940ae7a8bf91297ec76b" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_e0edfc8c49331c44cc1d11c0a1d" FOREIGN KEY ("approval_id") REFERENCES "branch_approvals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_da40fa1299b93c4563afb41b528" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_da40fa1299b93c4563afb41b528"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_e0edfc8c49331c44cc1d11c0a1d"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_4364e40940ae7a8bf91297ec76b"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ALTER COLUMN "branch_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_da40fa1299b93c4563afb41b528" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ALTER COLUMN "approval_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ALTER COLUMN "criteria_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_e0edfc8c49331c44cc1d11c0a1d" FOREIGN KEY ("approval_id") REFERENCES "branch_approvals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_4364e40940ae7a8bf91297ec76b" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_branches" RENAME COLUMN "value" TO "url"`);
    }

}
