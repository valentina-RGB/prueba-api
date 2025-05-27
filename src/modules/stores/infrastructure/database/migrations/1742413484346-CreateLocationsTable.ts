import { MigrationInterface, QueryRunner } from "typeorm";
 
 export class CreateLocationsTable1742413484346 implements MigrationInterface {
     name = 'CreateLocationsTable1742413484346'
 
     public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
     }
 
     public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`DROP TABLE "locations"`);
     }
 }
