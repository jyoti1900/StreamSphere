export enum UploadStatus {
    INITIATED = 'INITIATED', // presigned generated
    UPLOADED = 'UPLOADED', // confirmed by client
    USED = 'USED', // mapped to banner
    DELETED = "DELETED"
}
