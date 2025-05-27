import { MigrationInterface, QueryRunner } from "typeorm";

export class SetValueStamp1745877520007 implements MigrationInterface {
    name = 'SetValueStamp1745877520007';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "stamps" DROP COLUMN "coffecoins_value";
            
            ALTER TABLE "stamps"
            ADD "coffeecoins_value" integer NOT NULL DEFAULT 10;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "stamps" DROP COLUMN "coffeecoins_value";

            ALTER TABLE "stamps"
            ADD "coffecoins_value" integer;
        `);
    }
}