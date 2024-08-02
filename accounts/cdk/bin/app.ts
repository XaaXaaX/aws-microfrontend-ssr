#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AccountStack } from '../lib/accounts-stack';

const app = new cdk.App();
new AccountStack(app, AccountStack.name, {});