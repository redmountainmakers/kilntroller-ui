import ajax from './ajax';

const apiReadRoot  = 'http://www.redmountainmakers.org/kiln/api';
const apiWriteRoot = 'http://chip1.internal.redmountainmakers.org:3000';

function jsonRequest(method, url, settings, cb) {
    if (typeof settings === 'function') {
        cb = settings;
        settings = {};
    }
    ajax({
        ...settings,
        method,
        url,
        dataType : 'json',
        success  : (data, status, xhr) => {
            if (data && data.ok) {
                cb(null, data);
            } else if (data && data.error) {
                cb(new Error(data.error));
            } else {
                cb(new Error('Unknown error'));
            }
        },
        error : (xhr, status, error) => {
            if (xhr.status) {
                cb(new Error('HTTP ' + xhr.status));
            } else if (error) {
                cb(new Error(error));
            } else {
                cb(new Error('Unknown error'));
            }
        },
    });
}

export function getData(min, max, count, cb) {
    jsonRequest('GET', apiReadRoot + '/data', {
        data : { min, max, count },
    }, (err, result) => {
        cb(err, result);
    });
}