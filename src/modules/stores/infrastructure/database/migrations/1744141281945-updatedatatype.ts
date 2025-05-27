import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatedatatype1744141281945 implements MigrationInterface {
    name = 'Updatedatatype1744141281945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_branches" DROP COLUMN "branch_id"`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD "branch_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_branches" DROP COLUMN "social_network_id"`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD "social_network_id" integer NOT NULL`);

        await queryRunner.query(`
            ALTER TABLE "social_branches"
            ADD CONSTRAINT "FK_social_branches_branch"
            FOREIGN KEY ("branch_id") REFERENCES "branches"("id")
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "social_branches"
            ADD CONSTRAINT "FK_social_branches_social_network"
            FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id")
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "social_branches"
            DROP CONSTRAINT "FK_social_branches_social_network"
        `);

        await queryRunner.query(`
            ALTER TABLE "social_branches"
            DROP CONSTRAINT "FK_social_branches_branch"
        `);
        
        await queryRunner.query(`ALTER TABLE "social_branches" DROP COLUMN "branch_id"`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD "branch_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_branches" DROP COLUMN "social_network_id"`);
        await queryRunner.query(`ALTER TABLE "social_branches" ADD "social_network_id" integer NOT NULL`);
    }

}
