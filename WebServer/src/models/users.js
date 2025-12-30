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

function findUserByCredentials(username, password) {
    return users.find(
        (user) => user.username === username && user.password === password
    ) || null;
}   
    

module.exports = {
    createUser,
    getUserById,
    findUserByCredentials,
};