export const LOGIN = 'LOGIN';
export const ADMIN_LOGIN = 'ADMIN_LOGIN';
export const LOGOUT = 'LOGOUT';

export function login(userId) {
    return {
        type: LOGIN,
        userId: userId,
    };
}

export function adminLogin(userId) {
    return {
        type: ADMIN_LOGIN,
        userId: userId,
    };
}

export function logout(){
    return {
        type: LOGOUT,
    }
}