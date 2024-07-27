#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductStack } from '../lib/product-stack';
import { OrderStack } from '../lib/order-stack';

const app = new cdk.App();
new OrderStack(app, OrderStack.name, {});
new ProductStack(app, ProductStack.name, {});


