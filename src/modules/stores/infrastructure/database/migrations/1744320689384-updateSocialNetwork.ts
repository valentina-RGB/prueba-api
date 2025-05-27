import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSocialNetwork1744320689384 implements MigrationInterface {
    name = 'UpdateSocialNetwork1744320689384'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "social_networks" 
            ALTER COLUMN "name" TYPE VARCHAR(50),
            ALTER COLUMN "name" SET NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "social_networks" 
            ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "social_networks" 
            ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "social_networks" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "social_networks" DROP COLUMN "createdAt"
        `);

        await queryRunner.query(`
            ALTER TABLE "social_networks" 
            ALTER COLUMN "name" DROP NOT NULL,
            ALTER COLUMN "name" TYPE TEXT
        `);
    }

}
