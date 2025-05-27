import { MigrationInterface, QueryRunner } from "typeorm";

export class NewEmployeeTable1743102941762 implements MigrationInterface {
    name = 'NewEmployeeTable1743102941762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "employee_type" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "person_id" integer, "branch_id" integer, CONSTRAINT "REL_84c9ced19362dcb45e274accf8" UNIQUE ("person_id"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_84c9ced19362dcb45e274accf8f" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_380241ef3c0ea0a87b9411f37ff" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_380241ef3c0ea0a87b9411f37ff"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_84c9ced19362dcb45e274accf8f"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
    }

}
