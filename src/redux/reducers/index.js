import { LOGIN, ADMIN_LOGIN, LOGOUT } from '../actions';
import { combineReducers } from 'redux';

const initialState = {
    userId: '',
    isAdmin: false,
};

const loginReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:
            return Object.assign({}, state, {
                userId: action.userId,
                isAdmin: false,
            });
        case ADMIN_LOGIN:
            return Object.assign({}, state, {
                userId: action.userId,
                isAdmin: true,
            });
        case LOGOUT:
            return Object.assign({}, state, {
                userId: '',
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