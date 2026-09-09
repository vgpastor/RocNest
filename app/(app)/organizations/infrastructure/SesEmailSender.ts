// Infrastructure Layer - AWS SES adapter for IEmailSender

import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'

import type { EmailMessage, IEmailSender } from '../domain/services/IEmailSender'

/**
 * Configuration (all required to actually send):
 *   SES_FROM_EMAIL          e.g. "RocNest <noreply@rocnest.app>" — a verified SES identity
 *   AWS_REGION              SES region, e.g. "eu-west-1"
 *   AWS_ACCESS_KEY_ID       credentials with ses:SendEmail
 *   AWS_SECRET_ACCESS_KEY
 * Optional:
 *   SES_REPLY_TO_EMAIL      Reply-To header
 *   SES_CONFIGURATION_SET   SES configuration set for open/bounce tracking
 */
export class SesEmailSender implements IEmailSender {
    private readonly from = process.env.SES_FROM_EMAIL
    private readonly replyTo = process.env.SES_REPLY_TO_EMAIL
    private readonly configurationSet = process.env.SES_CONFIGURATION_SET
    private readonly region = process.env.AWS_REGION
    private readonly accessKeyId = process.env.AWS_ACCESS_KEY_ID
    private readonly secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    get isConfigured(): boolean {
        return Boolean(this.from && this.region && this.accessKeyId && this.secretAccessKey)
    }

    async send(message: EmailMessage): Promise<void> {
        if (!this.isConfigured) {
            throw new Error(
                'Email no configurado: faltan SES_FROM_EMAIL, AWS_REGION, AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY'
            )
        }

        const client = new SESv2Client({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId!,
                secretAccessKey: this.secretAccessKey!,
            },
        })

        await client.send(
            new SendEmailCommand({
                FromEmailAddress: this.from,
                Destination: { ToAddresses: [message.to] },
                ReplyToAddresses: this.replyTo ? [this.replyTo] : undefined,
                ConfigurationSetName: this.configurationSet,
                Content: {
                    Simple: {
                        Subject: { Data: message.subject, Charset: 'UTF-8' },
                        Body: {
                            Html: { Data: message.html, Charset: 'UTF-8' },
                            Text: { Data: message.text, Charset: 'UTF-8' },
                        },
                    },
                },
            })
        )
    }
}
