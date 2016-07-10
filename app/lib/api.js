import qs from 'qs';

import d3 from 'd3';

const apiRoot = 'http://www.redmountainmakers.org/kiln/api';

export function getData(min, max, count, cb) {
    const apiUrl = apiRoot + '/data?' + qs.stringify({ min, max, count });
    d3.json(apiUrl, (err, result) => {
        if (result && !result.ok) {
            cb(new Error(result.error));
        } else {
            cb(err, result);
        }
    });
}
