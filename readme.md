#Modified version of Alexa Color Expert sample with persistence in DynamoDB
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function

##How to use this sample
1. Log into the AWS Console
  * console.aws.amazon.com
2. Use CloudFormation to setup the DynamoDB
  * Click on the following link
  * https://console.aws.amazon.com/cloudformation/designer/home?region=us-east-1&templateURL=https://s3.amazonaws.com/memodoring-cloud-formation-templates/Dynamo/DynamoColorTemplate.json
* Create stack
  * ![Launch Stack Icon](https://s3.amazonaws.com/memodoring-images/DynamoColorPicker/Create_Stack.png)
* Name stack
  * screenshot
* Click Next on --- screen
* Wait for stack creation
* Go to the DynamoDB Section
* Copy the newly create table's name
screenshot
* Create Lambda function with Color Expert Recipe
* Replace code with the code from DynamoDBColorPicker.js
* Replace database name in line 9
* Enjoy!
