/**
 * Jest Setup File for AWS S3 Mocking
 * This file mocks the AWS S3 client for testing purposes
 */

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://mock-signed-url.example.com/upload'),
}));

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({})),
  GetObjectCommand: jest.fn((params) => ({ ...params })),
  PutObjectCommand: jest.fn((params) => ({ ...params })),
}));

// Add mock AWS credentials to environment if not present
if (!process.env.AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = 'mock-access-key-id';
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  process.env.AWS_SECRET_ACCESS_KEY = 'mock-secret-access-key';
}
if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'us-east-1';
}
