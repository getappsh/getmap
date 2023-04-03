export enum OS {
    ANDROID ='android',
    WINDOWS = 'windows',
    LINUX = 'linux',
}

export enum Components {
    ANDROID ='android',
    WINDOWS = 'windows',
    LINUX = 'linux',
}

export enum Formation {
    YAAT = 'yaat',
    YATUSH = 'yatush',
    HQTACTIC = 'hqtactic'
}

export enum PackageStatus {
    IN_PROGRESS = "inProgress",
    READY = "ready"
}

export enum RoleInProject {
    PROJECT_ADMIN = 'project-admin',
    PROJECT_MEMBER = 'project-member'
}

export enum DiscoveryType {
    GET_APP = 'get-app',
    GET_MAP = 'get-map'
}

export enum UploadStatus {
    STARTED = 'started',
    DOWNLOADING_FROM_URL = 'downloading-from-url',
    FAIL_TO_DOWNLOAD = 'fail-to-download',
    UPLOADING_TO_S3 ='uploading-to-s3',
    FAIL_TO_UPLOAD = 'fail-to-upload',
    IN_PROGRESS = 'in-progress',
    READY = 'ready',
    ERROR = 'error'

}