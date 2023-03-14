export enum UploadTopics {
    NEW_VERSION = 'upload.new-version',
    LAST_VERSION = 'upload.last-version',
}

export enum DiscoveryTopics {
    DISCOVERY_MESSAGE = "discovery.discovery-message"
}

export enum DeliveryTopics {
    PREPARE_PACKAGE = "delivery.prepare-package",
    GET_PREPARED_PACKAGE = "delivery.get-prepared-package"
}

export enum OfferingTopics {
    CHECK_UPDATES = "offering.check-updates",
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