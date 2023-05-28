export enum UploadTopics {
    UPLOAD_ARTIFACT = 'upload.artifact',
    UPLOAD_MANIFEST = 'upload.manifest',
    UPDATE_UPLOAD_STATUS = 'upload.update-upload-status',
    LAST_VERSION = 'upload.last-version'
}

export enum DiscoveryTopics {
    DISCOVERY_MESSAGE = "discovery.discovery-message"
}

export enum DeliveryTopics {
    UPDATE_DOWNLOAD_STATUS = "delivery.update-download-status",
}

export enum OfferingTopics {
    CHECK_UPDATES = "offering.check-updates",
    GET_OFFER_OF_COMP = "offering.get-offering-of-comp",
}

export enum DeployTopics {
    UPDATE_DEPLOY_STATUS = "deploy.update-deploy-status",
}

export enum ProjectManagementTopics{
    GET_USER_PROJECTS = 'project-management.get-user-projects',
    GET_PROJECT_CONFIG_OPTION = 'project-management.get-project-config-option',
    CREATE_PROJECT = 'project-management.create-project',
    CREATE_TOKEN = 'project-management.create-token',
    ADD_NEW_MEMBER = 'project-management.add-new-member',
    EDIT_MEMBER = 'project-management.edit-member',
    REMOVE_MEMBER = 'project-management.remove-member',
    GET_PROJECT_RELEASES = 'project-management.get-project-releases',

    GET_DEVICES_BY_CATALOG_ID = 'project-management.get-devices-by-catalog-id',

}

export enum GetMapTopics {
    REGISTER = 'getapp.getmap.register',
    // Discovery
    GET_RECORDS = 'getapp.getmap.discovery.catalog',
    GET_RECORDS_COUNT = 'getmap.discovery.get-records-count-for-device',
    // Delivery
    GET_STATUS = 'getapp.getmap.delivery.get-status',
    GET_DEVICE_CONTENT = 'getapp.getmap.delivery.get-device-content',
    IS_DOWNLOAD_URL_READY = 'getmap.delivery.is-download-url-ready'
}