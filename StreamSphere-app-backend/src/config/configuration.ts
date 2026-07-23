export default () => ({
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000' || 'http://localhost:3001',
    HOST: process.env.HOST || 'http://localhost',
    PORT: '3000',
    aws: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        s3BucketFolder: process.env.S3_BUCKET_FOLDER,
        cloudfront: {
            domain: process.env.CLOUDFRONT_DOMAIN,
            keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
            // Store the PEM private key in the env var with literal \n for newlines
            privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        },
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    },
});
