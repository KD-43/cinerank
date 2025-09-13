import { v4 as uuidv4 } from '../../node_modules/uuid';

const USER_ID_KEY = 'tierList-anon-user-id';

export function getAnonUserId () {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = uuidv4();
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
}