import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinColumnName1744323619196 implements MigrationInterface {
    name = 'JoinColumnName1744323619196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_41d92c6000ce558e99d5243111a"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_f7e1c3dff7d7476e7c91b357c61"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_d79ec5652746a785b65938f4ab2"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_e68e545abc559c9ed168fe14583"`);
        await queryRunner.query(`ALTER TABLE "social_branches" DROP CONSTRAINT "FK_social_branches_branch"`);
        await queryRunner.query(`ALTER TABLE "social_branches" DROP CONSTRAINT "FK_social_branches_social_network"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "criteriaId"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "approvalId"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP COLUMN "branchId"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP COLUMN "approvedById"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "criteria_id" integer`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "approval_id" integer`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD "branch_id" integer`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD "approved_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "social_branches" ALTER COLUMN "branch_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_branches" ALTER COLUMN "social_network_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_4364e40940ae7a8bf91297ec76b" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_e0edfc8c49331c44cc1d11c0a1d" FOREIGN KEY ("approval_id") REFERENCES "branch_approvals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_da40fa1299b93c4563afb41b528" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_c9e0284cced3a04e65b921e13ed" FOREIGN KEY ("approved_by_id") REFERENCES "administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_branches" DROP CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965"`);
        await queryRunner.query(`ALTER TABLE "social_branches" DROP CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_c9e0284cced3a04e65b921e13ed"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_da40fa1299b93c4563afb41b528"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_e0edfc8c49331c44cc1d11c0a1d"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_4364e40940ae7a8bf91297ec76b"`);
        await queryRunner.query(`ALTER TABLE "social_branches" ALTER COLUMN "social_network_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_branches" ALTER COLUMN "branch_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP COLUMN "approved_by_id"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" DROP COLUMN "branch_id"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "approval_id"`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" DROP COLUMN "criteria_id"`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD "approvedById" integer`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD "branchId" integer`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "approvalId" integer`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD "criteriaId" integer`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD CONSTRAINT "FK_social_branches_social_network" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD CONSTRAINT "FK_social_branches_branch" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_e68e545abc559c9ed168fe14583" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_d79ec5652746a785b65938f4ab2" FOREIGN KEY ("approvedById") REFERENCES "administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_f7e1c3dff7d7476e7c91b357c61" FOREIGN KEY ("criteriaId") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_41d92c6000ce558e99d5243111a" FOREIGN KEY ("approvalId") REFERENCES "branch_approvals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
