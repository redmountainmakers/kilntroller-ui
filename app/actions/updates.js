export function receiveStatusUpdate(update) {
    return {
        type   : 'STATUS_UPDATE_RECEIVE',
        status : update,
    };
}

export function receiveScheduleUpdate(update) {
    return {
        type     : 'SCHEDULE_UPDATE_RECEIVE',
        schedule : update,
    };
}
