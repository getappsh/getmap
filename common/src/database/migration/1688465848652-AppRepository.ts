import { MigrationInterface, QueryRunner } from "typeorm";

export class AppRepository1688465848652 implements MigrationInterface {
    name = 'AppRepository1688465848652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_73e1828d94de0b2ddf89da0546"`);
        await queryRunner.query(`DROP INDEX "public"."project_name_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" RENAME COLUMN "physical_device" TO "deviceID"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" RENAME COLUMN "device_id" TO "deviceID"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" RENAME COLUMN "device_id" TO "deviceID"`);
        await queryRunner.query(`CREATE TABLE "platform" ("name" character varying NOT NULL, CONSTRAINT "PK_b9b57ec16b9c2ac927aa62b8b3f" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "formation" ("name" character varying NOT NULL, CONSTRAINT "PK_311c9c94be443daeaeb5fd56444" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "category" ("name" character varying NOT NULL, CONSTRAINT "PK_23c05c292c439d77b0de816b500" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "operation_system" ("name" character varying NOT NULL, CONSTRAINT "PK_616a1c9efbc76d361773ecb2f65" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "device" ("ID" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "MAC" character varying, "IP" character varying, "OS" character varying, "serial_number" character varying, "possible_bandwidth" character varying, "available_storage" character varying, CONSTRAINT "PK_9272d4998f0def0ef365de2b1a5" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "device_component" ("device_ID" character varying NOT NULL, "component_catalog_id" character varying NOT NULL, CONSTRAINT "PK_5536e424deb25c711f50fe37ff8" PRIMARY KEY ("device_ID", "component_catalog_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1f163ac3d48a67c9bf6a3d247f" ON "device_component" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a6cec72480ff6c70a65125166" ON "device_component" ("component_catalog_id") `);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "member_id"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "name" TO component_name`);
        await queryRunner.query(`ALTER TABLE "project" ADD "artifact_type" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "OS" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "platform_type" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "formation" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "category" character varying`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "default_project"`);
        await queryRunner.query(`ALTER TABLE "member" ADD "default_project" integer`);
        await queryRunner.query(`ALTER TYPE "public"."member_project_role_enum" RENAME TO "member_project_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."member_project_role_enum" AS ENUM('project-owner', 'project-admin', 'project-member')`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "role" TYPE "public"."member_project_role_enum" USING "role"::"text"::"public"."member_project_role_enum"`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "role" SET DEFAULT 'project-member'`);
        await queryRunner.query(`DROP TYPE "public"."member_project_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP COLUMN "deviceID"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD "deviceID" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "deviceID" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deviceID" DROP NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "project_component_name_unique_constraint" ON "project" ("component_name") `);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_ce6af544306f2b15cc67b98f907" FOREIGN KEY ("default_project") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_6991d43331367fb73a9b05b3af0" FOREIGN KEY ("OS") REFERENCES "operation_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_883c751dd4821d23ca68fc3ab6d" FOREIGN KEY ("platform_type") REFERENCES "platform"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_153cb871996883304a853d02e8f" FOREIGN KEY ("formation") REFERENCES "formation"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_b2d8a6998de33c634d2e4fba985" FOREIGN KEY ("category") REFERENCES "category"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD CONSTRAINT "FK_62c0a7b76a04a5ff7b82f81db70" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD CONSTRAINT "FK_2e3dcab53dd4e65ed2e0da0567a" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ADD CONSTRAINT "FK_42dacf83f566beb80b0e7b92abc" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_8a6cec72480ff6c70a651251660" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_8a6cec72480ff6c70a651251660"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" DROP CONSTRAINT "FK_42dacf83f566beb80b0e7b92abc"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP CONSTRAINT "FK_2e3dcab53dd4e65ed2e0da0567a"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP CONSTRAINT "FK_62c0a7b76a04a5ff7b82f81db70"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_b2d8a6998de33c634d2e4fba985"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_153cb871996883304a853d02e8f"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_883c751dd4821d23ca68fc3ab6d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_6991d43331367fb73a9b05b3af0"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_ce6af544306f2b15cc67b98f907"`);
        await queryRunner.query(`DROP INDEX "public"."project_component_name_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deviceID" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "deviceID" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP COLUMN "deviceID"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD "deviceID" jsonb`);
        await queryRunner.query(`CREATE TYPE "public"."member_project_role_enum_old" AS ENUM('project-admin', 'project-member')`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "role" TYPE "public"."member_project_role_enum_old" USING "role"::"text"::"public"."member_project_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "role" SET DEFAULT 'project-member'`);
        await queryRunner.query(`DROP TYPE "public"."member_project_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."member_project_role_enum_old" RENAME TO "member_project_role_enum"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "default_project"`);
        await queryRunner.query(`ALTER TABLE "member" ADD "default_project" character varying`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "formation"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "platform_type"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "OS"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "artifact_type"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "component_name" TO name`);
        await queryRunner.query(`ALTER TABLE "member" ADD "member_id" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a6cec72480ff6c70a65125166"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f163ac3d48a67c9bf6a3d247f"`);
        await queryRunner.query(`DROP TABLE "device_component"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP TABLE "operation_system"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "formation"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" RENAME COLUMN "deviceID" TO "device_id"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" RENAME COLUMN "deviceID" TO "device_id"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" RENAME COLUMN "deviceID" TO "physical_device"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "project_name_unique_constraint" ON "project" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_73e1828d94de0b2ddf89da0546" ON "member" ("member_id") `);
    }

}
