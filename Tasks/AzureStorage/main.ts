import path = require("path");
import * as os from 'os';
import util = require("util");
import tl = require("vsts-task-lib/task");
import msRestAzure = require("azure-arm-rest/azure-arm-common");
import armStorage = require("azure-arm-rest/azure-arm-storage");
import blobUtils = require("./operations/AzureBlobUtils");
var azureStackUtility = require('azurestack-common/azurestackrestutility.js');
var azureStackEnvironment = "AzureStack";

async function run() {
    var connectedServiceName = tl.getInput('ConnectedServiceName', true);
    var storageAccountName = tl.getInput('StorageAccountName', true);
    var containerName = tl.getInput('ContainerName', true).toLowerCase();
    var commonVirtualPath = tl.getInput('CommonVirtualPath', false) || "";
    var destinationDirectory = tl.getInput('DestinationDirectory', true);
    var subscriptionId = tl.getEndpointDataParameter(connectedServiceName, 'subscriptionid', true);
    var credentials = await msRestAzure.getARMCredentials(connectedServiceName);
    
    var blobUtilsClient: blobUtils.AzureBlobUtils = new blobUtils.AzureBlobUtils(credentials, subscriptionId);

    return blobUtilsClient.downloadBlobs(storageAccountName, containerName, commonVirtualPath, destinationDirectory);
}

run().then((result) =>
    tl.setResult(tl.TaskResult.Succeeded, "")
).catch((error) =>
    tl.setResult(tl.TaskResult.Failed, error)
    );
