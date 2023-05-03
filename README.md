Log4js Node Google Hangout Appender
--------------------------------

Sends [log] events to a [google] [hangout] room or group. This is an appender for use with log4js.
Optional to use with [log4js-layouts]

## Instructions:
## Install the package:
```
npm i log4js-google-hangout
```

## Example 1

```javascript
log4js.configure({
    appenders: {
        hangoutAlert: {
            type: 'log4js-google-hangout', // fix type
            webhookURL:  'https://chat.googleapis.com/v1/spaces/AAAF6x2HikY/messages?key=AIzaSyDdInnCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ysYMD7pVp7GsOtDTvTjC2gkozfSl5XGQHaY7Xfa9_9Y%3D***', // WebHook URL
            layout: ''          // layout formatter
            threadName:'',      // thread name in google hangout
            consoleLogging:'',  // true, false to enable logging
            threadName:'',      // thread to send message (empty if not use)
            multiMessageCount:1 // number of messages which will be sent in case of message is
                                // larger than 4096 characters in case this is not defined then 1 message is sent
        }
    },
    categories: {default: {appenders: ['hangoutAlert'], level: 'warn'}}
});
```

## Example 2

Use with log4js-layouts

```javascript
npm i log4js-layouts
```

```javascript
log4js.configure({
    appenders: {
        hangoutAlert: {
            type: 'log4js-google-hangout',
            layout: {
                type: messageOutputType.HANGOUT,
                appName: config.http.nginxPrefix,
                source: config.env,
                static: {
                    env: {
                        host: config.http.balancerHost,
                    },
                },
                } as IJsonLayoutConfig,
                webHookUrl: config.logging.chat.url,
                consoleLogging: true,
            } as IGoogleHangoutAppenderConfiguration,
            hangoutAlertByLevel: {
                type: 'logLevelFilter',
                appender: 'hangoutAlert',
                level: levels.INFO,
                maxLevel: levels.FATAL,
            },
    },
    categories: {default: {appenders: ['hangoutAlertByLevel'], level: 'warn'}}
});
```

### Note:
If you will send more content than 4096 characters in a single message, than it will be parted to array of 4096 characters.

