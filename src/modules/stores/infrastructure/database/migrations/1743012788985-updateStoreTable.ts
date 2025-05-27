import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStoreTable1743012788985 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "stores" ADD "email" character varying(70) NOT NULL DEFAULT 'default@email.com'
        `);
        
        const hasUserIdColumn = await queryRunner.hasColumn("stores", "user_id");
        if (hasUserIdColumn) {
            await queryRunner.query(`
                ALTER TABLE "stores" DROP COLUMN "user_id"
            `);
        }

        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = 'fk_constraint_name_user_id'
                ) THEN
                    ALTER TABLE "stores" DROP CONSTRAINT "fk_constraint_name_user_id";
                END IF;
            END$$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "stores" DROP COLUMN "email"
        `);

        await queryRunner.query(`
            ALTER TABLE "stores" ADD "user_id" integer NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "stores" ADD CONSTRAINT "fk_constraint_name_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id")
        `);
    }
}
