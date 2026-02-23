// Domain Layer - Service Interface (Port)
// Defines the contract for file storage operations
// Infrastructure layer will implement this interface

export interface IStorageService {
    uploadImage(file: File, identifier: string): Promise<string>
    deleteImage(url: string): Promise<void>
}
