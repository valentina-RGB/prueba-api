import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserIdToUserObject1743138516621 implements MigrationInterface {
    name = 'ChangeStoreIdToStoreObject1743138516621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4"`);
        await queryRunner.query(`ALTER TABLE "branches" ALTER COLUMN "store_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4"`);
        await queryRunner.query(`ALTER TABLE "branches" ALTER COLUMN "store_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_76cee8021bd4fc08d1f0fc34ed4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
