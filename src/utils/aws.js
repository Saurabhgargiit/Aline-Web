import AWS from 'aws-sdk';

AWS.config.region = process.env.REACT_APP_S3_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.REACT_APP_S3_IDENTITY_POOL_ID,
});

const encodeRFC5987ValueChars = (str) => {
  return encodeURIComponent(str)
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%(?:7C|60|5E)/g, unescape);
};

const s3 = new AWS.S3({
  apiVersion: process.env.REACT_APP_API_VERSION,
  params: { Bucket: process.env.REACT_APP_S3_BUCKET },
});

export const uploadToS3 = async (key, file) => {
  // Ensure credentials are ready
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get((err) => {
      if (err) {
        console.error('Error retrieving credentials:', err);
        return reject(err);
      }
      const fileName = file.name;
      const encodedFileName = encodeRFC5987ValueChars(fileName);

      // Credentials are ready, proceed with upload
      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: s3.config.params.Bucket,
          Key: key,
          Body: file,
          ContentDisposition: `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`,
          ContentType: file.type,
        },
      });

      upload
        .promise()
        .then((data) => {
          const { Location, Key } = data;
          resolve({ Location, Key });
        })
        .catch((uploadErr) => {
          console.error('Error in AWS upload:', uploadErr);
          reject(uploadErr);
        });
    });
  });
};
