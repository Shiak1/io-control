const NotFound = require('../exceptions/not-found');
const User = require('../services/user');

module.exports = async () => {
    try {
        const created = await User.createIfNotExists({
            username: 'Admin',
            password: 'admin1',
            role: 'Admin',
        });

        console.log(
            created ? `Admin user created with password 'admin1'` : 'Admin user already exists.'
        );
    } catch (error) {
        console.error(error);
    }
};
