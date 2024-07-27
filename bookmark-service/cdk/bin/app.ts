#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BookMarksStack } from '../lib/bookmarks-stack';

const app = new cdk.App();
new BookMarksStack(app, BookMarksStack.name, {});