import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableAndCascadeDelete1747945184915
  implements MigrationInterface
{
  name = 'NewTableAndCascadeDelete1747945184915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_branches" DROP CONSTRAINT "FK_c5aa94a4db8f17e82bd96ebbc80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" DROP CONSTRAINT "FK_fd4698b4c5a2a1304735eca5cde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" DROP CONSTRAINT "FK_4e0a5d214838d933816b7ca97a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" DROP CONSTRAINT "FK_c5b80b35543cbd2a5b26bd8e2dc"`,
    );
    await queryRunner.query(
      `CREATE TABLE "recommendations" ("id" SERIAL NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "branch_id" integer NOT NULL, CONSTRAINT "PK_23a8d2db26db8cabb6ae9d6cd87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" ADD CONSTRAINT "FK_fd4698b4c5a2a1304735eca5cde" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" ADD CONSTRAINT "FK_c5aa94a4db8f17e82bd96ebbc80" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" ADD CONSTRAINT "FK_c5b80b35543cbd2a5b26bd8e2dc" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" ADD CONSTRAINT "FK_4e0a5d214838d933816b7ca97a0" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendations" ADD CONSTRAINT "FK_35393de58b4f4292d60ebcf4611" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendations" ADD CONSTRAINT "FK_5dfda3b1c9d7b7e90a46eb16dcb" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recommendations" DROP CONSTRAINT "FK_5dfda3b1c9d7b7e90a46eb16dcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendations" DROP CONSTRAINT "FK_35393de58b4f4292d60ebcf4611"`,
    );
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
    await queryRunner.query(`DROP TABLE "recommendations"`);
    await queryRunner.query(
      `ALTER TABLE "event_client" ADD CONSTRAINT "FK_c5b80b35543cbd2a5b26bd8e2dc" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_client" ADD CONSTRAINT "FK_4e0a5d214838d933816b7ca97a0" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" ADD CONSTRAINT "FK_fd4698b4c5a2a1304735eca5cde" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_branches" ADD CONSTRAINT "FK_c5aa94a4db8f17e82bd96ebbc80" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
