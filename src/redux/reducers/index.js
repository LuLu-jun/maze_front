import { LOGIN, LOGOUT } from '../actions';
import { combineReducers } from 'redux';

const initialState = {
    id: '',
    isAdmin: false,
};

const loginReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:
            return Object.assign({}, state, {
                id: action.id,
                isAdmin: action.isAdmin,
            });
        case LOGOUT:
            return Object.assign({}, state, {
                id: '',
                isAdmin: false,
            });
        default:
            return state;
    }
}

const reducer = combineReducers({
   login : loginReducer,
});

export default reducer;