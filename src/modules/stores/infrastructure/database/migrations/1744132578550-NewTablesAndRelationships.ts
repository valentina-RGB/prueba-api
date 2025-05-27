import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTablesAndRelationships1744132578550
  implements MigrationInterface
{
  name = 'NewTablesAndRelationships1744132578550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_branches" DROP CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_branches" DROP CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09"`,
    );

    await queryRunner.query(
      `CREATE TABLE "criteria" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "active" boolean NOT NULL DEFAULT true, "requires_image" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91cd5f7ff7be5ade9bca5b98cfb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "criteria_responses" ("id" SERIAL NOT NULL, "response_text" text, "image_url" character varying(255), "status" character varying NOT NULL DEFAULT 'PENDING', "admin_comments" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "criteriaId" integer, "approvalId" integer, CONSTRAINT "PK_2809b9912e9c351e8ae90483649" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "branch_approvals" ("id" SERIAL NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "comments" text, "approval_date" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branchId" integer, "approvedById" integer, CONSTRAINT "PK_f5ddcd75e4d1828dc38c7703230" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "branches" DROP CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ALTER COLUMN "average_rating" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "branches" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ALTER COLUMN "store_id" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_f7e1c3dff7d7476e7c91b357c61" FOREIGN KEY ("criteriaId") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria_responses" ADD CONSTRAINT "FK_41d92c6000ce558e99d5243111a" FOREIGN KEY ("approvalId") REFERENCES "branch_approvals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_e68e545abc559c9ed168fe14583" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_approvals" ADD CONSTRAINT "FK_d79ec5652746a785b65938f4ab2" FOREIGN KEY ("approvedById") REFERENCES "administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_branches" ADD CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_branches" ADD CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ADD CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "branches" DROP CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_branches" DROP CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_branches" DROP CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_d79ec5652746a785b65938f4ab2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branch_approvals" DROP CONSTRAINT "FK_e68e545abc559c9ed168fe14583"`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_41d92c6000ce558e99d5243111a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "criteria_responses" DROP CONSTRAINT "FK_f7e1c3dff7d7476e7c91b357c61"`,
    );

    await queryRunner.query(
      `ALTER TABLE "branches" ALTER COLUMN "store_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "branches" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ALTER COLUMN "average_rating" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ADD CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "branch_approvals"`);
    await queryRunner.query(`DROP TABLE "criteria_responses"`);
    await queryRunner.query(`DROP TABLE "criteria"`);

    await queryRunner.query(
      `ALTER TABLE "social_branches" ADD CONSTRAINT "FK_be318dab11f9ce6d17d828ffe09" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_branches" ADD CONSTRAINT "FK_30d7d0bbf0cdeab92690fc81965" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
