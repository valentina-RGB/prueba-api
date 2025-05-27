import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTableAndNewConstraints1746565203931
  implements MigrationInterface
{
  name = 'NewTableAndNewConstraints1746565203931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL DEFAULT '0', "comment" text NOT NULL, "image_urls" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" integer NOT NULL, "client_id" integer NOT NULL, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "images" ("id" SERIAL NOT NULL, "image_type" character varying(50) NOT NULL, "image_url" text NOT NULL, "related_type" character varying(20) NOT NULL, "related_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "stamp_clients" ADD "quantity" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ADD "is_open" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_stamps" ADD CONSTRAINT "UQ_fce0f5c4bd52ee6c362260f9eb4" UNIQUE ("page_id", "stamp_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_f75b369d2d9c423c8118f62fdd3" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "fk_image_branch" FOREIGN KEY ("related_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "fk_image_branch"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_f75b369d2d9c423c8118f62fdd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_stamps" DROP CONSTRAINT "UQ_fce0f5c4bd52ee6c362260f9eb4"`,
    );
    await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "is_open"`);
    await queryRunner.query(
      `ALTER TABLE "stamp_clients" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(`DROP TABLE "images"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
  }
}
