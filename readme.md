#Modified version of Alexa Color Expert sample with persistence in DynamoDB
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function

##How to use this sample
1. Log into the AWS Console
  * https://console.aws.amazon.com
  * Make sure the 'N. Virginia' region is selected in the top right corner
2. Use CloudFormation to setup the DynamoDB
  * Click on the following link
  * https://console.aws.amazon.com/cloudformation/designer/home?region=us-east-1&templateURL=https://s3.amazonaws.com/memodoring-cloud-formation-templates/Dynamo/DynamoColorTemplate.json
  * Create stack by clicking on the 'cloud' button
    * ![Launch Stack Icon](https://s3.amazonaws.com/memodoring-images/DynamoColorPicker/Create_Stack.png)
  * A new page will appear, click 'next'
  * Name your stack in the next page
    * ![Name Stack Screen](https://s3.amazonaws.com/memodoring-images/DynamoColorPicker/name-stack.png)
  * Click 'next' on the options screen
  * Click the 'create' button in the Review screen
  * Wait for stack creation
    * The status will change from CREATE_IN_PROGRESS to CREATE_COMPLETE
3. Create Lambda function with Color Expert Recipe
  * Select 'Lambda' from the Services dropdown
  * Click on the 'Create a Lambda Function' button
    * Type 'color' into the recipe filter and choose 'Node.js 4.3' as the language
    * ![Name Stack Screen](https://s3.amazonaws.com/memodoring-images/DynamoColorPicker/color-expert-recipe.png)
  * Click on the 'alexa-skills-kit-color-expert' recipe
  * Make sure the 'Event source type' is set to 'Alexa Skills Kit' & click the 'next' button
  * Name your function
  * In the 'Role' dropdown (near the bottom) select the 'Basic execution role'
    * In the next window click the 'allow' button
  * Click the 'next' button
4. Replace Lambda code with the code from DynamoDBColorPicker.js
  * Copy the code from DynamoDBColorPicker.js in this repo
  * Go to the 'Code' tab in your Lambda function
  * Select all the code from the in-line editor and replace it with the copied code
5. Change the name of the database in the sample code
  * Select DynamoDB from the Services dropdown
  * Click on tables in the side menu
  * Copy the newly create table's name
  * Go back to your Lambda function
    * Replace database name in line 9
