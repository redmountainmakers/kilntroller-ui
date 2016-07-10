import moment from 'moment';

export function date(timestamp, local = true) {
    const date = moment.utc(timestamp);

    if (local) {
        return date.local().toDate();
    } else {
        return date.toDate();
    }
}
