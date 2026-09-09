// Domain Layer - Service port (Dependency Inversion)
// The domain declares what it needs; infrastructure decides how to deliver it.

export interface EmailMessage {
    to: string
    subject: string
    html: string
    text: string
}

export interface IEmailSender {
    send(message: EmailMessage): Promise<void>
}
