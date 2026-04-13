import { IUser } from "@interfaces";
import {DBRepository} from "@repository";
import { userModel } from '@models';

class UserRepository extends DBRepository<IUser>{
    constructor(){
        super(userModel)
    }
}

export default UserRepository