import { UserDocument } from "src/models/user";

const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function unlockUser(user: UserDocument) {
    const lockedAt = Number(user.lockedAt);
    const currentTime = Date.now();

    if (currentTime - lockedAt >= LOCKOUT_DURATION) {
        user.locked = false;
        user.loginAttempts = 0; // Reset login attempts
        await user.save();
        return { status: 401, message: 'Account locked. Please try again later.' };
    } else {
        const timeRemaining = Math.round((LOCKOUT_DURATION - (currentTime - lockedAt)) / 1000);
        const minutesRemaining = Math.ceil(timeRemaining / 60);
        return { status: 403, message: `Account locked. Please try again in ${minutesRemaining} minutes.` };
    }
}

export default unlockUser;