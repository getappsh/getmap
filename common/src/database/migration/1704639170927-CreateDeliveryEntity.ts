import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeliveryEntity1704639170927 implements MigrationInterface {
    name = 'CreateDeliveryEntity1704639170927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "delivery" ("catalog_id" character varying NOT NULL, "status" "public"."delivery_status_enum" NOT NULL DEFAULT 'start', "device_id" character varying NOT NULL, "path" character varying, "progress" integer NOT NULL DEFAULT '0', "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f466b0d171be17b87993904ef2" PRIMARY KEY ("catalog_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "delivery"`);
    }

}
