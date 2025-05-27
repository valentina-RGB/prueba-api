import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultPendingStatus1743123637977 implements MigrationInterface {
    name = 'DefaultPendingStatus1743123637977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "type_document" SET DEFAULT 'NIT'`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "email" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
       }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE'`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "email" SET DEFAULT 'default@email.com'`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "type_document" SET DEFAULT 'CC'`);
    }

}
