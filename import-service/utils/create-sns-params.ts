export const createSNSParams = (
  Subject: string,
  Message: string,
  Status: 'OK' | 'ERROR' = 'OK',
) => ({
  Subject,
  Message,
  MessageStructure: 'string',
  TopicArn: process.env.SNS_ARN,
  MessageAttributes: {
    status: {
      DataType: 'String',
      StringValue: Status,
    },
  },
});
