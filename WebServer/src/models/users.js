const crypto = require("crypto");

const users = [];

function createUser({username, password, name, image}) {
    let finalUsername = username.trim();
    if (finalUsername.length === 0) {
        throw new Error("Username is required.");
    }
    if (users.some((user) => user.username === finalUsername)) {
        throw new Error("Username already exists.");
    }

    let id;
    do {
        id = crypto.randomUUID();
    } while (users.some((user) => user.id === id));
    const newUser = {
        id,
        username: finalUsername,
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