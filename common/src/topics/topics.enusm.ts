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

export enum DashboardTopics{
    GET_USER_PROJECTS = 'dashboard.get-user-projects',
    ADD_PROJECT = 'dashboard.add-project',
    // CREATE_TOKEN = 'dashboard.create-token',
    ADD_NEW_MEMBER = 'dashboard.add-new-member',
    // DELETE_MEMBER = 'dashboard.delete-member',
    // EDIT_MEMBER = 'dashboard.edit-member'

}