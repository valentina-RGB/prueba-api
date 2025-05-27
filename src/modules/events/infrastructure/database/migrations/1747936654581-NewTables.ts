import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTables1747936654581 implements MigrationInterface {
  name = 'NewTables1747936654581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "page_stamps" DROP CONSTRAINT "FK_93b6f499926e5804e95ef50678e"`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_branches" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer, "branchId" integer, CONSTRAINT "PK_2ea460d5aafdc21309873e1fb27" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "location" character varying(100) NOT NULL, "is_free" boolean NOT NULL DEFAULT true, "value" numeric(12,2) NOT NULL DEFAULT '0', "organizer" character varying(50) NOT NULL, "status" character varying NOT NULL DEFAULT 'PUBLISHED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dfa3d03bef3f90f650fd138fb38" UNIQUE ("name"), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_client" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "event_id" integer, "client_id" integer, CONSTRAINT "PK_07c71f2d1cbf2a9625c8fcb516e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "albums" ADD "entity_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "UQ_9ea9b44faacc387d78b7a9e0de5" UNIQUE ("entity_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "is_verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_stamps" ADD CONSTRAINT "FK_93b6f499926e5804e95ef50678e" FOREIGN KEY ("stamp_id") REFERENCES "stamps"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "FK_9ea9b44faacc387d78b7a9e0de5" FOREIGN KEY ("entity_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" ADD CONSTRAINT "FK_fd4698b4c5a2a1304735eca5cde" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" ADD CONSTRAINT "FK_c5aa94a4db8f17e82bd96ebbc80" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" ADD CONSTRAINT "FK_c5b80b35543cbd2a5b26bd8e2dc" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" ADD CONSTRAINT "FK_4e0a5d214838d933816b7ca97a0" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_client" DROP CONSTRAINT "FK_4e0a5d214838d933816b7ca97a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" DROP CONSTRAINT "FK_c5b80b35543cbd2a5b26bd8e2dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" DROP CONSTRAINT "FK_c5aa94a4db8f17e82bd96ebbc80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" DROP CONSTRAINT "FK_fd4698b4c5a2a1304735eca5cde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_9ea9b44faacc387d78b7a9e0de5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_stamps" DROP CONSTRAINT "FK_93b6f499926e5804e95ef50678e"`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "is_verified"`);
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "UQ_9ea9b44faacc387d78b7a9e0de5"`,
    );
    await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "entity_id"`);
    await queryRunner.query(`DROP TABLE "event_client"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "event_branches"`);
    await queryRunner.query(
      `ALTER TABLE "page_stamps" ADD CONSTRAINT "FK_93b6f499926e5804e95ef50678e" FOREIGN KEY ("stamp_id") REFERENCES "stamps"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
  }
}
