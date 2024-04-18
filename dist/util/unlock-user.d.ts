import { UserDocument } from "src/models/user";
declare function unlockUser(user: UserDocument): Promise<{
    status: number;
    message: string;
}>;
export default unlockUser;
