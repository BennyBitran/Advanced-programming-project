const crypto = require("crypto");

const users = [];

function createUser({username, password, name, image}) {
    let id;
    do {
        id = crypto.randomUUID();
    } while (users.some((user) => user.id === id));
    const newUser = {
        id,
        username,
        password,
        name,
        image,
    };
    users.push(newUser);
    return newUser;
}

function getUserById(id) {
    return users.find((user) => user.id === id) || null;
}

module.exports = {
    createUser,
    getUserById,
};