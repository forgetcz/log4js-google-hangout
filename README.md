Log4js Node Google Hangout Appender
--------------------------------

Sends [log] events to a [google] [hangout] room or group. This is an appender for use with log4js.

## Instructions:
## Install the package:
```
npm i log4js-google-hangout
```

## Example

```javascript
log4js.configure({
    appenders: {
        hangoutAlert: {
            type: 'log4js-google-hangout',
            webhookURL: 'https://chat.googleapis.com/v1/spaces/AAAF6x2HikY/messages?key=AIzaSyDdInnCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ysYMD7pVp7GsOtDTvTjC2gkozfSl5XGQHaY7Xfa9_9Y%3D***',
            layout:''           // layout formater
            threadName:'',      //thread name in google hangout 
            consoleLogging:''   // true, false to enable logging
            threadName:'****'   // hread to send message
        }
    },
    categories: {default: {appenders: ['hangoutAlert'], level: 'warn'}}
});
```

### Note: 
If you will send more content than 4096 characters in a single message, than it will be parted to array of 4096 characters. 


