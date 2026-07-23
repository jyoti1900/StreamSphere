import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import * as crypto from 'crypto';

@Injectable()
export class CloudFrontService {
    private readonly domain: string;
    private readonly keyPairId: string;
    private readonly privateKey: string;

    constructor(private readonly configService: ConfigService) {
        const cf = this.configService.get<{
            domain: string;
            keyPairId: string;
            privateKey: string;
        }>('aws.cloudfront');

        if (!cf?.domain || !cf?.keyPairId || !cf?.privateKey) {
            throw new InternalServerErrorException(
                'CloudFront configuration is missing. Ensure CLOUDFRONT_DOMAIN, CLOUDFRONT_KEY_PAIR_ID, and CLOUDFRONT_PRIVATE_KEY are set.',
            );
        }

        this.domain = cf.domain;
        this.keyPairId = cf.keyPairId;
        // Support PEM keys stored in env vars with literal \n escapes
        this.privateKey = this.formatPrivateKey(cf.privateKey);
    }

    /**
     * Formats the private key to ensure it's in the correct PEM format
     */
    private formatPrivateKey(key: string): string {
        // Replace escaped newlines with actual newlines
        let formattedKey = key.replace(/\\n/g, '\n');

        // Ensure the key has proper PEM format
        if (!formattedKey.includes('-----BEGIN')) {
            throw new InternalServerErrorException(
                'CloudFront private key is not in PEM format. Must start with "-----BEGIN RSA PRIVATE KEY-----" or "-----BEGIN PRIVATE KEY-----"',
            );
        }

        // Check if this is a public key instead of private key
        if (formattedKey.includes('-----BEGIN PUBLIC KEY-----') || 
            formattedKey.includes('-----BEGIN RSA PUBLIC KEY-----')) {
            throw new InternalServerErrorException(
                'ERROR: You are using a PUBLIC key instead of a PRIVATE key for CloudFront signing. Download the correct private key (.pem file) from AWS CloudFront Key Pairs console.',
            );
        }

        // Remove all leading/trailing whitespace and normalize line endings
        formattedKey = formattedKey.trim();
        
        // Log key diagnostics (without showing the actual key content)
        const lines = formattedKey.split('\n');
        const keyType = lines[0];
        console.log('CloudFront Private Key Format Diagnostics:');
        console.log('- Key Type:', keyType);
        console.log('- Lines count:', lines.length);

        // Attempt to validate the key format by checking if it can be loaded
        try {
            crypto.createPrivateKey({
                key: formattedKey,
                format: 'pem',
            });
            console.log('✓ Private key format is valid and compatible with Node.js crypto');
        } catch (error) {
            console.warn('⚠ Private key validation warning:', error instanceof Error ? error.message : 'Unknown error');
            console.log('Note: Ensure you are using the PRIVATE key, not the public key');
        }

        return formattedKey;
    }

    /**
     * Generates a CloudFront signed URL for streaming a private S3 object.
     * @param videoKey  S3 object key (e.g. "movies/uuid-movie.mp4")
     * @param expiresInSeconds  How long the URL remains valid (default 1 hour)
     */
    getSignedStreamingUrl(videoKey: string, expiresInSeconds = 3600): string {
        try {
            const url = `https://${this.domain}/${videoKey}`;
            const dateLessThan = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

            console.log('CloudFront Signed URL Details:');
            console.log('- Domain:', this.domain);
            console.log('- Video Key:', videoKey);
            console.log('- Full URL:', url);
            console.log('- Expires at:', dateLessThan);

            return getSignedUrl({
                url,
                keyPairId: this.keyPairId,
                dateLessThan,
                privateKey: this.privateKey,
            });
        } catch (error) {
            console.error('Error generating CloudFront signed URL:', error);
            throw new InternalServerErrorException(
                `Failed to generate CloudFront signed URL: ${error instanceof Error ? error.message : 'Unknown error'}. Ensure the CloudFront private key is in valid RSA PEM format.`,
            );
        }
    }
}
