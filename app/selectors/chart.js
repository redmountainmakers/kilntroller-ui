export function getChartRange(state) {
    return state.chart.range;
}

export function getDataRange(state) {
    const data = state.chart.data;

    if (data.length) {
        return {
            min : data[0].timestamp,
            max : data[data.length - 1].timestamp,
        };
    } else {
        return {
            min : Infinity,
            max : -Infinity,
        };
    }
}

export function chartHasAnyData(state) {
    const chartRange = state.chart.range;
    const dataRange  = getDataRange(state);

    if (chartRange.min > dataRange.max) {
        return false;
    } else if (chartRange.max < dataRange.min) {
        return false;
    } else {
        return true;
    }
}

export function getChartData(state) {
    if (!chartHasAnyData(state)) {
        return null;
    }

    const chartData  = state.chart.data;
    const chartRange = getChartRange(state);

    return chartData.filter(point => (
        point.timestamp >= chartRange.min &&
        point.timestamp <= chartRange.max
    ));
}

export function getNextChartDataRequest(state) {
    if (state.errors.dataRequest) {
        return null;
    }

    const chartRange = state.chart.range;
    const dataRange  = getDataRange(state);

    if (chartRange.min > dataRange.max || chartRange.max < dataRange.min) {
        return {
            count : 500,
            ...chartRange,
        };
    } else if (chartRange.max > dataRange.max) {
        // ...
        return null;
    } else if (chartRange.min < dataRange.min) {
        // ...
        return null;
    } else {
        return null;
    }
}

export function isRequestingChartData(state) {
    return (
        state.chart.requests.pending.length > 0 &&
        !state.errors.dataRequest
    );
}
