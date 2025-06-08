## 📖 Context
* Explain the goal of the repository:
    - The repository aims to deploy a website using AWS CDK (Cloud Development Kit) to create and manage cloud resources.
* Identify used services or notable code libraries:
    - AWS CDK, AWS S3, AWS CloudFront, AWS IAM, AWS SSM, AWS S3 Deployment, AWS CodePipeline Actions.

## 📖 Overview
* The architecture involves deploying a website using AWS CDK with AWS S3 for storage, AWS CloudFront for content delivery, and AWS IAM for access management.
* The FrontStack component creates an S3 bucket for the website and sets up permissions for CloudFront to access the bucket.
* The CloudFrontStack component configures a CloudFront distribution for the website, including cache policies and origin request policies.
* The components interact by deploying the website content to the S3 bucket and setting up redirection rules for specific paths.
* The LocalLambdaDebugger component handles local invocation of Lambda functions for testing and debugging purposes.
* The MicroFrontEndFunctionsStack manages Lambda functions for the micro frontend, including the BookmarksHandler for request processing and error handling, the BookmarksRepository for data retrieval, the CatalogHandler for request processing and error handling, and the ProductDetailsHandler for data retrieval.
* TypeScript and tsyringe are used for type-safe programming and dependency injection in the micro frontend.

## 🔹 Components  
| Component           | Description                                                                                                      | Interacts With                                      | Purpose                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| FrontStack          | Creates an S3 bucket for the website and sets up permissions for CloudFront to access the bucket.              | AWS S3, AWS IAM                                     | Storage and access management for the website content.                  |
| CloudFrontStack     | Configures a CloudFront distribution for the website, including cache policies and origin request policies.   | AWS CloudFront, AWS S3, AWS IAM                     | Content delivery and caching for the website.                           |
| WebsiteStack        | Orchestrates the deployment of the website components, including FrontStack and CloudFrontStack.              | FrontStack, CloudFrontStack, AWS S3 Deployment      | Deployment and configuration of the website resources.                  |
| LocalLambdaDebugger | Handles local invocation of Lambda functions for API endpoints defined in the configuration.                   | Express, AWS Lambda, dotenv                         | Local testing and debugging of Lambda functions for API endpoints.       |
| MicroFrontEndFunctionsStack | Sets up Lambda functions for the micro frontend, including the BookmarksHandler, BookmarksRepository, CatalogHandler, and ProductDetailsHandler. | TypescriptFunction, IFunctionUrl                    | Creation and management of Lambda functions for the micro frontend.      |
| BookmarksHandler    | Handles the invocation of Lambda functions for the Bookmarks micro frontend, including error handling.         | RequestHelper, BookmarksMicroFrontEnd               | Processing of requests and responses for the Bookmarks micro frontend.    |
| BookmarksRepository | Manages the retrieval of bookmark data based on specified filters.                                               | Bookmark model, filters                             | Accessing and filtering bookmark data.                                   |
| CatalogHandler      | Handles the invocation of Lambda functions for the Catalog micro frontend, including error handling.           | RequestHelper, CatalogMicroFrontEnd                 | Processing of requests and responses for the Catalog micro frontend.      |
| ProductDetailsHandler | Handles the invocation of Lambda functions for the Product Details micro frontend, including error handling and data retrieval.  | RequestHelper, ProductDetailsMicroFrontEnd          | Processing of requests and responses for the Product Details micro frontend. |

## 🧱 Technologies
| Category       | Technology         | Purpose                                      |
| -------------- | ------------------ | -------------------------------------------- |
| Programming    | Node.js            | Backend scripting language                   |
| Framework      | AWS CDK            | Infrastructure as Code framework             |
| Cloud          | AWS                | Cloud services provider                      |
| Storage        | AWS S3             | Object storage service                       |
| Content Delivery | AWS CloudFront    | Content delivery network service             |
| IAM            | AWS IAM            | Identity and Access Management service       |
| Parameter Store | AWS SSM            | Secure storage for configuration parameters   |
| Deployment     | AWS S3 Deployment  | Deployment of website content to S3 bucket   |
| CodePipeline   | AWS CodePipeline   | Continuous integration and deployment service |
| Express        | Express.js         | Web application framework for Node.js        |
| dotenv         | dotenv             | Loads environment variables from a .env file  |
| TypeScript     | TypeScript         | Programming language for the micro frontend   |
| tsyringe       | tsyringe           | Dependency injection library for TypeScript   |
| source-map-support | source-map-support | Library for handling source maps in Node.js  |

### New Code Analysis:

#### ProductDetailsHandler Component
* The `ProductDetailsHandler` component handles the invocation of Lambda functions for the Product Details micro frontend, including error handling and data retrieval.
* It defines interfaces for `Product` and `Catalog` to represent product details and a collection of products.
* The `ProductsRepository` class manages the retrieval of product data based on specified filters.
* It uses a fake list of products for demonstration purposes.
* TypeScript and tsyringe are utilized for type-safe programming and dependency injection in the `ProductDetailsHandler` component.

#### S3CloudFrontWebBucket Component
* The `S3CloudFrontWebBucket` class extends the `Bucket` class to create an S3 bucket with specific properties for web content.
* It includes logic for setting up permissions to allow CloudFront access to the bucket.
* The bucket deployment is handled using `BucketDeployment` to upload content from a specified source path.

#### TypescriptFunction Component
* The `TypescriptFunction` class extends the `NodejsFunction` class to define Lambda functions written in TypeScript.
* It configures the Lambda function with specific properties like runtime, memory size, timeout, and bundling options.
* The function URL is created for invoking the Lambda function with AWS IAM authentication.
* Logging and permissions for CloudFront access are also set up within the `TypescriptFunction` class.

#### ActionResults Class
* The `ActionResults` class provides static methods for generating response objects with different status codes.
* Methods like `Response`, `Success`, `BadRequest`, `UnAuthorized`, and `InternalServerError` are defined for consistent response handling.

#### RequestHelper Class
* The `RequestHelper` class contains a static method `DecodeQueryStringParams` to decode query string parameters from various Lambda event types.
* It ensures proper decoding of query parameters for further processing in Lambda functions.

This analysis provides insights into the new components introduced for managing Lambda functions, S3 buckets, and request handling in the micro frontend architecture. The use of TypeScript and tsyringe continues to enforce type safety and dependency injection practices.