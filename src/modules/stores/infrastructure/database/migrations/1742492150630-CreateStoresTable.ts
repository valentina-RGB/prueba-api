import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoresTable1742492150630 implements MigrationInterface {
    name = 'CreateStoresTable1742492150630';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "name" character varying(50) NOT NULL, "type_document_id" integer NOT NULL, "number_document" character varying(20) NOT NULL, "logo" character varying(255), "email" character varying(100) NOT NULL, "phone_number" character varying(20) NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDIENTE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d" UNIQUE ("email"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stores"`);
    }
}
