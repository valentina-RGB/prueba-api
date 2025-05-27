import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeElimination1743126676085 implements MigrationInterface {
    name = 'CascadeElimination1743126676085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "fk_admin_store"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "fk_admin_branch"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_84c9ced19362dcb45e274accf8f"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "fk_admin_store" FOREIGN KEY ("entity_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "fk_admin_branch" FOREIGN KEY ("entity_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_84c9ced19362dcb45e274accf8f" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_84c9ced19362dcb45e274accf8f"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "fk_admin_branch"`);
        await queryRunner.query(`ALTER TABLE "administrators" DROP CONSTRAINT "fk_admin_store"`);
        await queryRunner.query(`ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_84c9ced19362dcb45e274accf8f" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "fk_admin_branch" FOREIGN KEY ("entity_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "administrators" ADD CONSTRAINT "fk_admin_store" FOREIGN KEY ("entity_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
