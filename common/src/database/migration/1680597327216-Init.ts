import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1680597327216 implements MigrationInterface {
    name = 'Init1680597327216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."version_packages_os_enum" AS ENUM('android', 'windows', 'linux')`);
        await queryRunner.query(`CREATE TYPE "public"."version_packages_formation_enum" AS ENUM('yaat', 'yatush', 'hqtactic')`);
        await queryRunner.query(`CREATE TYPE "public"."version_packages_status_enum" AS ENUM('inProgress', 'ready')`);
        await queryRunner.query(`CREATE TABLE "version_packages" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "OS" "public"."version_packages_os_enum" NOT NULL, "formation" "public"."version_packages_formation_enum" NOT NULL, "from_version" character varying NOT NULL, "to_version" character varying NOT NULL, "status" "public"."version_packages_status_enum" NOT NULL DEFAULT 'inProgress', "utl" character varying, CONSTRAINT "PK_eaedcfcdf341f839e321c2e376c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_33d8d8c8c7d26b9bee28d78332" ON "version_packages" ("OS", "formation", "from_version", "to_version") `);
        await queryRunner.query(`CREATE TABLE "member" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "member_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "default_project" character varying, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_73e1828d94de0b2ddf89da0546" ON "member" ("member_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "member_email_unique_constraint" ON "member" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."member_project_role_enum" AS ENUM('project-admin', 'project-member')`);
        await queryRunner.query(`CREATE TABLE "member_project" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."member_project_role_enum" NOT NULL DEFAULT 'project-member', "projectId" integer, "memberId" integer, CONSTRAINT "member_project_unique_constraint" UNIQUE ("projectId", "memberId"), CONSTRAINT "PK_87913eee42a32bebe9af67d7526" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "tokens" text, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "project_name_unique_constraint" ON "project" ("name") `);
        await queryRunner.query(`CREATE TYPE "public"."upload_version_upload_status_enum" AS ENUM('started', 'downloading-from-url', 'fail-to-download', 'uploading-to-s3', 'fail-to-upload', 'in-progress', 'ready', 'error')`);
        await queryRunner.query(`CREATE TABLE "upload_version" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "platform" character varying NOT NULL, "component" character varying NOT NULL, "formation" character varying NOT NULL, "OS" character varying, "version" character varying NOT NULL, "metadata" jsonb NOT NULL DEFAULT '{}', "s3_url" character varying, "upload_status" "public"."upload_version_upload_status_enum" NOT NULL DEFAULT 'started', "deployment_status" character varying, "security_status" character varying, "policy_status" character varying, "projectId" integer, CONSTRAINT "platform_component_formation_version_unique_constraint" UNIQUE ("platform", "component", "formation", "version"), CONSTRAINT "PK_d3f5258d93bb4e09d2eeaffb1d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."discovery_message_discoverytype_enum" AS ENUM('get-app', 'get-map')`);
        await queryRunner.query(`CREATE TYPE "public"."discovery_message_formation_enum" AS ENUM('yaat', 'yatush', 'hqtactic')`);
        await queryRunner.query(`CREATE TABLE "discovery_message" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "personal_device" jsonb, "situational_device" jsonb, "physical_device" jsonb, "discoveryType" "public"."discovery_message_discoverytype_enum" NOT NULL, "formation" "public"."discovery_message_formation_enum" NOT NULL, "base_version" jsonb, "previous_version" jsonb, "map" jsonb, CONSTRAINT "PK_e198476b47dcb7ce72c3672004e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD CONSTRAINT "FK_3590a58e0e74ba70d64acc7b0f2" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "upload_version" ADD CONSTRAINT "FK_2375d667f3072cf531b17ff8720" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload_version" DROP CONSTRAINT "FK_2375d667f3072cf531b17ff8720"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT "FK_3590a58e0e74ba70d64acc7b0f2"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46"`);
        await queryRunner.query(`DROP TABLE "discovery_message"`);
        await queryRunner.query(`DROP TYPE "public"."discovery_message_formation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discovery_message_discoverytype_enum"`);
        await queryRunner.query(`DROP TABLE "upload_version"`);
        await queryRunner.query(`DROP TYPE "public"."upload_version_upload_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."project_name_unique_constraint"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "member_project"`);
        await queryRunner.query(`DROP TYPE "public"."member_project_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."member_email_unique_constraint"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73e1828d94de0b2ddf89da0546"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33d8d8c8c7d26b9bee28d78332"`);
        await queryRunner.query(`DROP TABLE "version_packages"`);
        await queryRunner.query(`DROP TYPE "public"."version_packages_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."version_packages_formation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."version_packages_os_enum"`);
    }

}
