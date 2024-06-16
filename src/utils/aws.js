import AWS from 'aws-sdk';

AWS.config.region = process.env.REACT_APP_S3_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_S3_IDENTITY_POOL_ID,
});

const s3 = new AWS.S3({
    apiVersion: process.env.REACT_APP_API_VERSION,
    params: { Bucket: process.env.REACT_APP_S3_BUCKET },
});

export const uploadToS3 = async (key, file) => {
    const upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: s3.config.params.Bucket,
            Key: key,
            Body: file,
            ContentDisposition: 'attachment; filename="' + file.name + '"',
            ContentType: file.type,
        },
    });

    try {
        const promise = upload.promise();
        const data = await promise;
        const { Location, key } = data;
        return { Location, key };
    } catch (err) {
        console.error('error in aws upload:', err);
        throw new Error(err);
    }
};
