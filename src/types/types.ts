import { IJsonLayoutConfig } from 'log4js-layouts/dist/types/types.js';

/**
 * @description Google hangout configuration definition
 *
 * @export
 * @interface IGoogleHangoutAppenderConfiguration
 */
export interface IGoogleHangoutAppenderConfiguration {
    /** @description Type name */
    type: 'log4js-google-hangout';
    /** @description Parent connection to mongoDb or connection properties to mongoDb*/
    webHookUrl: string;
    /** @description Layout definition */
    layout: IJsonLayoutConfig | undefined;
    /** @description thread name in google hangout */
    threadName?: string | undefined;
    /** @description Console log for messages default logic is true - in case consoleLogging is null or undefined then result is true  */
    consoleLogging?: boolean | undefined;
    /**
     * @description Count of messages in case message is array (as result of layout operation) or message is larger then 4096 characters
     *  In case of null or undefined then 1 is returned
     *
     * @type {(number | undefined)}
     * @memberof IGoogleHangoutAppenderConfiguration
     */
    multiMessageCount?: number | undefined;
}

/** @description Hangout error  */
export interface IHangoutResult {
    name: string;
    sender: {
        name: string;
        displayName: string;
        type: string;
    };
    createTime: Date;
    text: string;
    thread: {
        name: string;
        retentionSettings: {
            state: string;
        };
    };
    space: {
        name: string;
        type: string;
        displayName: string;
        spaceThreadingState: string;
    };
    argumentText: {
        message: string;
    };
    retentionSettings: {
        state: string;
    };
}
