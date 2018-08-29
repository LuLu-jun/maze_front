export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function login(id, isAdmin) {
    return {
        type: LOGIN,
        id: id,
        isAdmin: isAdmin,
    };
}

export function logout(){
    return {
        type: LOGOUT,
    }
}