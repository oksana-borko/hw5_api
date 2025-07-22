import {UserService} from "./UserService.ts";
import {User} from "../model/userTypes.ts";

export  class UserServiceEmbeddedImpl implements UserService{
    private users: User[] = [];
    addUser(user: User): boolean {
        if(this.users.findIndex((u:User) => u.id === user.id) === -1)
        {
            this.users.push(user);
            return true;
        }
        return false;
    }

    getAllUsers(): User[] {
        return [...this.users];
    }

    getUserById(id: number): User {
       const user = this.users.find(item => item.id === id);
       if(!user) throw "404";
        return user;
    }

    removeUser(id: number): User {
        const index = this.users.findIndex(item => item.id === id);
        if(index === -1) throw "404";
        const removed = this.users[index];
        this.users.splice(index, 1);
        return removed;
    }

    updateUser(newUser: User): void {
        const index = this.users.findIndex(item => item.id === newUser.id);
        if(index === -1) throw "404";
        this.users[index] = newUser;
    }
}