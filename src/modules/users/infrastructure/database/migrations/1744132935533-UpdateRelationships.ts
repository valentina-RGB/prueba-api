import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationships1744132935533 implements MigrationInterface {
    name = 'UpdateRelationships1744132935533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "FK_385b361b35deec07a13653ef580"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_84c9ced19362dcb45e274accf8f"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_380241ef3c0ea0a87b9411f37ff"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "person_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "branch_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "administrators" ALTER COLUMN "person_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "people" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "person_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_84c9ced19362dcb45e274accf8f" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_380241ef3c0ea0a87b9411f37ff" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "FK_385b361b35deec07a13653ef580" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "FK_385b361b35deec07a13653ef580"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_380241ef3c0ea0a87b9411f37ff"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_84c9ced19362dcb45e274accf8f"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "person_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "people" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ALTER COLUMN "person_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "branch_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "person_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_380241ef3c0ea0a87b9411f37ff" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_84c9ced19362dcb45e274accf8f" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "FK_385b361b35deec07a13653ef580" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
