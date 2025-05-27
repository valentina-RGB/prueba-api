import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTables1745349666933 implements MigrationInterface {
    name = 'NewTables1745349666933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coffecoins" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "client_id" integer, CONSTRAINT "REL_f8aaccedead965a6c240d3966c" UNIQUE ("client_id"), CONSTRAINT "PK_a090eb4d56068d16c15900c124b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stamp_clients" ("id" SERIAL NOT NULL, "obtained_at" TIMESTAMP NOT NULL, "coffecoins_earned" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "stamp_id" integer NOT NULL, CONSTRAINT "PK_3af962685f50f0422bd919dd5d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "logo" character varying(255), "introduction" text NOT NULL, "type" character varying(20) NOT NULL DEFAULT 'ANNUAL', "start_date" date NOT NULL, "end_date" date NOT NULL, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pages" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "albumId" integer, CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page_stamps" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "page_id" integer NOT NULL, "stamp_id" integer NOT NULL, CONSTRAINT "PK_35b56d7f51e7282b33401e027e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stamps" ("id" SERIAL NOT NULL, "logo" character varying NOT NULL, "name" character varying(50) NOT NULL, "description" character varying NOT NULL, "coffecoins_value" integer NOT NULL, "status" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" integer NOT NULL, CONSTRAINT "UQ_8b607e4de84fc9eb90dcaaf4296" UNIQUE ("name"), CONSTRAINT "PK_62bcccebe6a60fc4cfbddedd147" PRIMARY KEY ("id"))`);
        
        await queryRunner.query(`ALTER TABLE "coffecoins" ADD CONSTRAINT "FK_f8aaccedead965a6c240d3966cc" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stamp_clients" ADD CONSTRAINT "FK_71201648b87c8d71533f1032856" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stamp_clients" ADD CONSTRAINT "FK_51c22ee78fe2d22a813a1047c40" FOREIGN KEY ("stamp_id") REFERENCES "stamps"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "FK_fcca9fac2e42eb04f561633a7f9" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_stamps" ADD CONSTRAINT "FK_2b5037ea1d7eab34141451c6819" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "page_stamps" ADD CONSTRAINT "FK_93b6f499926e5804e95ef50678e" FOREIGN KEY ("stamp_id") REFERENCES "stamps"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stamps" ADD CONSTRAINT "FK_1719ff4b7ebdff8dd2b152ed2b2" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamps" DROP CONSTRAINT "FK_1719ff4b7ebdff8dd2b152ed2b2"`);
        await queryRunner.query(`ALTER TABLE "page_stamps" DROP CONSTRAINT "FK_93b6f499926e5804e95ef50678e"`);
        await queryRunner.query(`ALTER TABLE "page_stamps" DROP CONSTRAINT "FK_2b5037ea1d7eab34141451c6819"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "FK_fcca9fac2e42eb04f561633a7f9"`);
        await queryRunner.query(`ALTER TABLE "stamp_clients" DROP CONSTRAINT "FK_51c22ee78fe2d22a813a1047c40"`);
        await queryRunner.query(`ALTER TABLE "stamp_clients" DROP CONSTRAINT "FK_71201648b87c8d71533f1032856"`);
        await queryRunner.query(`ALTER TABLE "coffecoins" DROP CONSTRAINT "FK_f8aaccedead965a6c240d3966cc"`);
       
        await queryRunner.query(`DROP TABLE "stamps"`);
        await queryRunner.query(`DROP TABLE "page_stamps"`);
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "stamp_clients"`);
        await queryRunner.query(`DROP TABLE "coffecoins"`);
    }

}
