// Script language: Java Script
// Developer: Hippo Games
// Contact: hippogamesunity@gmail.com
// Guides: https://developers.google.com/apps-script/guides/properties
// Quotas: https://developers.google.com/apps-script/guides/services/quotas

var maxValueLength = 1024; // Max user data size. Note that total size limit is 500kB (sometimes more) and single value size limit is 9kB.
var keyLength = 4; // Lenght of a key that will be returned to user.
var alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // '0' and 'O' symbols are removed to avoid mistakes when typing.
var adminPassword = 'password'; // Used for admin commands like clearing storage.
var supportEmail = 'hippogamesunity@gmail.com';
var storageCleanupBytes = 32 * 1024; // Remove first 32kB storage data if storage is full. Be carefull, it can take a few seconds to clean 100kB, for example.

function doGet(e) // GET request.
{
  return ContentService.createTextOutput(doWork(e));
}

function doPost(e) // POST request.
{
  return ContentService.createTextOutput(doWork(e));
}

function doWork(e)
{
  try
  {
    if (e == null) throw 'Empty arguments.';    
   
    if (e.parameter['set'] != null)
    {           
      return Set(e.parameter['set']);
    }
    else if (e.parameter['get'] != null)
    {     
      return Get(e.parameter['get']);
    }
    else if (e.parameter['count'] != null && e.parameter['password'] == adminPassword)
    {
      return PropertiesService.getScriptProperties().getKeys().length + ' key-value paires';
    }
    else if (e.parameter['size'] != null && e.parameter['password'] == adminPassword)
    {     
      return GetStorageSizeInBytes() + ' bytes';
    }
    else if (e.parameter['output'] != null && e.parameter['password'] == adminPassword)
    {
      return Output();
    }
    else if (e.parameter['clear'] != null && e.parameter['password'] == adminPassword)
    {
      PropertiesService.getScriptProperties().deleteAllProperties();
      
      return 'Storage cleared.';
    }
    else if (e.parameter['testfill'] != null && e.parameter['password'] == adminPassword)
    {
      return TestFillStorage();
    }
    else
    {
      throw 'Unexpected arguments.';
    }
  }
  catch (exception)
  {
    return JSON.stringify({ 'ErrorCode': 1, 'Result': exception });
  }
}

function Set(value)
{
  if (value.length > 9 * 1024) throw 'Exceeded max value length (' + 9 * 1024 + ').';
  if (value.length > maxValueLength) throw 'Exceeded max value length (' + maxValueLength + ').';
        
  var service = PropertiesService.getScriptProperties();
  var key = '';
  
  do
  {
    key = "";
    
    for (var i = 0; i < keyLength; i++)
    {
      key += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
  while (service.getProperty(key) != null)    
   
  for (var i = 0; i < 2; i++) // 2 attempts to set value
  {
    try
    {
      service.setProperty(key, value);
      
      return JSON.stringify({ 'ErrorCode': 0, 'Result': key });
    }
    catch (exception)
    {
      if (GetStorageSizeInBytes() >= 500 * 1024) // Storage may be full.
      {
        CleanupStorage(storageCleanupBytes);
      }
      else
      {
        throw exception;
      }
    }
  }  
   
  throw 'Unable to set value. Please contact us: ' + supportEmail;
}

function Get(key)
{
  var value = PropertiesService.getScriptProperties().getProperty(key);
  
  if (value == null)
  {
    return JSON.stringify({ 'ErrorCode': 1, 'Result': 'Value not found.' });
  }
  else
  {
    return JSON.stringify({ 'ErrorCode': 0, 'Result': value });
  }  
}

function Output(scriptProperties)
{
  var properties = PropertiesService.getScriptProperties().getProperties();
  var output = [];
  
  for (var key in properties)
  {
    output.push(key + ':' + properties[key]);
  }
  
  return output.join('\r\n');
}

function GetStorageSizeInBytes()
{
  var properties = PropertiesService.getScriptProperties().getProperties();
  var size = 0;
  
  for (var key in properties)
  {
    size += key.length + (properties[key] == null ? 0 : properties[key].length);
  }
  
  return size;
}

function CleanupStorage(bytesToClean) // Warning! Heavy operation! It may take a few seconds.
{
  var service = PropertiesService.getScriptProperties();
  var properties = service.getProperties();
  var size = 0;
  
  for (var key in properties)
  {
    size += key.length + (properties[key] == null ? 0 : properties[key].length);
    service.deleteProperty(key);
    
    if (size >= bytesToClean) break;
  }
}

function TestFillStorage() // Fill storage to test cleanup.
{   
  var service = PropertiesService.getScriptProperties();
  
  for (var i = 0; i < 512; i++)
  {
    value = "";
    
    for (var j = 0; j < 1024; j++)
    {
      value += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    var key = value.substring(0, keyLength);
    
    service.setProperty(key, value);
  }
    
  return 'Done!';
}