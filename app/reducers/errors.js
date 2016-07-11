export default function(state = {}, action) {
    switch (action.type) {
        case 'DATA_REQUEST_ERROR':
            return {
                ...state,
                dataRequest : action.error.message,
            };
    }

    return state;
}
