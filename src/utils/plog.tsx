import { DateTime } from "luxon";
import { MessageL } from "./HADSObjectsLocal";

declare const window: any;

export function WriteLog(log: MessageL) {

    let newLog = {
        date: DateTime.now().toFormat('yyyy-MM-dd T:hh'),
        message: log.content,
        idMeeting: log.idConversation
    };

    const existingLog = localStorage.getItem('log') || '[]';
    const logArray = JSON.parse(existingLog);
    logArray.push(newLog);

    localStorage.setItem('log', JSON.stringify(logArray));
    console.log(newLog.date + ': ' + newLog.idMeeting + ': ' + log.content);

};


export function getLog() {
    const log = localStorage.getItem('log');
    return JSON.parse(log) || [];
};


window.getLog = getLog();