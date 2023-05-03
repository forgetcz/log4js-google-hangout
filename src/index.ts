import got, { OptionsOfJSONResponseBody, RequestError } from 'got';
import * as log4js from 'log4js';
import {
    IGoogleHangoutAppenderConfiguration,
    IHangoutResult,
    maxGoogleHangoutMessageLength,
} from './types/types';

/**
 * @description Get log level result undefined is some as true
 *
 * @param {(boolean | undefined)} consoleLogging
 * @return {*}  {boolean}
 */
function getConsoleLogResult(consoleLogging: boolean | undefined): boolean {
    if (consoleLogging === undefined || consoleLogging === true) {
        return true;
    } else {
        return false;
    }
}

/**
 * Exported configuration function to init appender
 *
 * @param {IGoogleHangoutAppenderConfiguration} config Configuration for mongo
 * @param {log4js.LayoutsParam} layouts log4js layouts collection
 */
export const configure = (
    config: IGoogleHangoutAppenderConfiguration,
    layouts: log4js.LayoutsParam | undefined,
    findAppender?: () => log4js.AppenderFunction,
    levels?: log4js.Levels
) => {
    return Log(config, layouts, findAppender, levels);
};

/**
 * @description Exported AppenderModule function to init
 *
 * @export
 * @param {RestAppenderConfig} config Configuration for mongo
 * @returns
 */
export const MongoDbAppender: log4js.AppenderModule = {
    configure: configure,
};

/**
 * https://stackoverflow.com/questions/7033639/split-large-string-in-n-size-chunks-in-javascript
 *
 * @param {string} str
 * @param {number} size
 * @return {string[]}  {string[]}
 */
function chunkSubstr(str: string, size: number): string[] {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substring(o, size);
    }

    return chunks;
}

/**
 * @description Send message tp google hangout
 *
 * @export
 * @param {IGoogleHangoutAppenderConfiguration} config
 * @param {*} message
 * @return {*}  {Promise<IHangoutResult>}
 */
export async function sendMessage(
    config: IGoogleHangoutAppenderConfiguration,
    message: any
): Promise<IHangoutResult> {
    try {
        let finalMessage =
            typeof message === 'object'
                ? JSON.stringify(message, undefined, 4)
                : message;

        if (finalMessage.length > maxGoogleHangoutMessageLength) {
            if (config.consoleLogging) {
                console.warn(
                    `log4js-hangout warning: Length of error message exceeded ${maxGoogleHangoutMessageLength} characters. Hangout allows only ${maxGoogleHangoutMessageLength} characters, so error message trimmed to ${maxGoogleHangoutMessageLength} characters.`
                );
            }

            finalMessage = finalMessage.substr(
                0,
                maxGoogleHangoutMessageLength
            );
        }

        const options: OptionsOfJSONResponseBody = {
            url: config.webHookUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            json: {
                text: finalMessage,
                thread: {
                    name: config.threadName || '',
                },
            },
            responseType: 'json',
        };

        const result = await got.post<IHangoutResult>(options);

        return result.body;
    } catch (err) {
        throw err;
    }
}

/**
 * @description Base appender function
 *
 * @param {IGoogleHangoutAppenderConfiguration} config Configuration for mongo
 * @param {log4js.LayoutsParam} layouts log4js layouts collection
 * @return {*}
 */
function Log(
    config: IGoogleHangoutAppenderConfiguration,
    layouts: log4js.LayoutsParam | undefined,
    findAppender?: () => log4js.AppenderFunction,
    levels?: log4js.Levels
) {
    findAppender = findAppender;
    levels = levels;

    let layout: log4js.LayoutFunction | undefined = undefined;

    if (config.layout) {
        if (layouts) {
            layout = layouts.layout(config.layout.type, config.layout as any);
        }
    }

    return (loggingEvent: any) => {
        let logData = loggingEvent;

        (async () => {
            try {
                // Apply layout (formation) in case layout is defined
                if (layout) {
                    logData = layout(logData);
                }

                // Part messages
                if (logData.data?.length > maxGoogleHangoutMessageLength) {
                    logData = chunkSubstr(
                        logData.data[0],
                        maxGoogleHangoutMessageLength
                    );
                }

                if (Array.isArray(logData)) {
                    let count = logData.length;

                    if (Number.isInteger(config.multiMessageCount)) {
                        count = Number(config.multiMessageCount);
                    }

                    logData.forEach(async (logItem) => {
                        if (count-- > 0) {
                            sendMessage(config, logItem)
                                .then((sendMessageResponse) => {
                                    if (
                                        getConsoleLogResult(
                                            config.consoleLogging
                                        )
                                    ) {
                                        console.debug(sendMessageResponse);
                                    }
                                })
                                .catch((err) => {
                                    throw err;
                                });
                        }
                    });
                } else {
                    sendMessage(config, logData)
                        .then((sendMessageResponse) => {
                            if (getConsoleLogResult(config.consoleLogging)) {
                                console.debug(sendMessageResponse);
                            }
                        })
                        .catch((err) => {
                            throw err;
                        });
                }
            } catch (err) {
                const logError = {
                    message: `${config.type} error send message to ${config.webHookUrl}`,
                    error: err,
                    detailInfo: {
                        logPrefix: `${__filename}[${Log.name}]`,
                        config: config,
                        responseBody: (err as RequestError)?.response?.body,
                    },
                };

                if (getConsoleLogResult(config.consoleLogging)) {
                    console.error(logError);
                }
            }
        })();
    };
}

if (require.main === module) {
    // ##DEBUG_JVR
    const webHookUrl =
        'https://chat.googleapis.com/v1/spaces/AAAA6x2HikY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=ysYMD7pVp7GsOCLDTvTjC2gkozSl5XGQHaY7Xfa9_9Y%3D';

    const config: IGoogleHangoutAppenderConfiguration = {
        type: 'log4js-google-hangout',
        webHookUrl: webHookUrl,
        layout: undefined,
        threadName: undefined,
    };
    //const s = webHookUrl.match(/.{1,20}/g);
    //console.debug(s);
    sendMessage(config, {
        message: webHookUrl,
    });
}
