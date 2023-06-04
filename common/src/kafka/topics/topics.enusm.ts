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
    ADD_PROJECT = 'project-management.add-project',
    CREATE_TOKEN = 'project-management.create-token',
    ADD_NEW_MEMBER = 'project-management.add-new-member',
    EDIT_MEMBER = 'project-management.edit-member',
    REMOVE_MEMBER = 'project-management.remove-member',
    GET_PROJECT_RELEASES = 'project-management.get-project-releases'

}

export enum GetMapTopics {
    // Discovery
    DISCOVERY_CATALOG = 'map.discovery.catalog',
    GET_RECORDS_COUNT = 'map.discovery.get-records-count-of-device',
    // Import
    GET_IMPORT_STATUS = 'map.import.status',
    CREATE_IMPORT = 'map.import.create'
}

export enum DeviceTopics {
    REGISTER = 'device.register',
    DEVICE_MAP_CONTENT = 'device.map.content.installed',
}