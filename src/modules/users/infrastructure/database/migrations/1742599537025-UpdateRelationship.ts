import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelationship1742599537025 implements MigrationInterface {
  name = 'UpdateRelationship1742599537025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "FK_e389069d209025c68d87775abaf" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "people" ADD CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "people" ADD CONSTRAINT "FK_2d50e68f69d4a336cefb9bb85c1" FOREIGN KEY ("type_document_id") REFERENCES "doc_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ADD CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ADD CONSTRAINT "FK_12c0000a82438ce72693d7fdb83" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "FK_29f39971656b4bf7832b7476d10" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "FK_f2e82246e5cb455054ba303af93" FOREIGN KEY ("type_document_id") REFERENCES "doc_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT "FK_f2e82246e5cb455054ba303af93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT "FK_29f39971656b4bf7832b7476d10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" DROP CONSTRAINT "FK_12c0000a82438ce72693d7fdb83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" DROP CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "people" DROP CONSTRAINT "FK_2d50e68f69d4a336cefb9bb85c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "people" DROP CONSTRAINT "FK_e2bceeacac0dd5be3d8c37b068c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "FK_e389069d209025c68d87775abaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
  }
}
