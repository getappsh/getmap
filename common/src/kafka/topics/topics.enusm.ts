export enum UploadTopics {
    UPLOAD_ARTIFACT = 'getapp-upload.artifact',
    UPLOAD_MANIFEST = 'getapp-upload.manifest',
    UPDATE_UPLOAD_STATUS = 'getapp-upload.update-upload-status',
    LAST_VERSION = 'getapp-upload.last-version'
}

export enum DiscoveryTopics {
    DISCOVERY_MESSAGE = "getapp-discovery.discovery-message"
}

export enum DeliveryTopics {
    UPDATE_DOWNLOAD_STATUS = "getapp-delivery.update-download-status",
}

export enum OfferingTopics {
    CHECK_UPDATES = "getapp-offering.check-updates",
    GET_OFFER_OF_COMP = "getapp-offering.get-offering-of-comp",
}

export enum DeployTopics {
    UPDATE_DEPLOY_STATUS = "getapp-deploy.update-deploy-status",
}

export enum ProjectManagementTopics{
    GET_USER_PROJECTS = 'getapp-project-management.get-user-projects',
    GET_PROJECT_CONFIG_OPTION = 'getapp-project-management.get-project-config-option',
    CREATE_PROJECT = 'getapp-project-management.create-project',
    CREATE_TOKEN = 'getapp-project-management.create-token',
    ADD_NEW_MEMBER = 'getapp-project-management.add-new-member',
    EDIT_MEMBER = 'getapp-project-management.edit-member',
    REMOVE_MEMBER = 'getapp-project-management.remove-member',
    GET_PROJECT_RELEASES = 'getapp-project-management.get-project-releases',

    GET_DEVICES_BY_CATALOG_ID = 'getapp-project-management.get-devices-by-catalog-id',
    GET_DEVICES_BY_PROJECT = 'getapp-project-management.get-devices-by-project',
    GET_DEVICES_BY_PLATFORM = 'getapp-project-management.get-devices-by-platform',

}

export enum GetMapTopics {
    // Discovery
    GET_RECORDS_COUNT = 'getapp-map.discovery.get-records-count-of-device',
    // Import
    GET_IMPORT_STATUS = 'getapp-map.get.import.status',
    POST_IMPORT_STATUS = 'getapp-map.post.import.status',
    CREATE_IMPORT = 'getapp-map.import.create',
    CANCEL_IMPORT_CREATE='getapp-map.import.create.cancel',
}

export enum DeviceTopics {
    REGISTER = 'getapp-device.map.register',
    DEVICE_MAP_CONTENT = 'getapp-device.content.map.installed',
    DISCOVERY_MAP = 'getapp-device.discover.map',
    DISCOVERY_SOFTWARE = 'getapp-device.discover.software.catalog',
}