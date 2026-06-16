import {users} from '../data/users.js';
import userModel from '../models/userModel.js';
const seedUser = async () => {

    try {
        // insert users
        const inserted = await userModel.insertMany(users);
        console.log(`✅ Seeded ${inserted.length} users successfully`);

    } catch (error) {
        console.error('❌ Error seeding users:', error);
    }

}


export default seedUser;