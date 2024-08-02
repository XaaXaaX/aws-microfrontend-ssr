#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BookmarksStack } from '../lib/bookmarks-stack';

const app = new cdk.App();
new BookmarksStack(app, BookmarksStack.name, {});