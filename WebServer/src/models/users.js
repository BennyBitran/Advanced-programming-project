const crypto = require("crypto");

const users = [];

function createUser({username, password, name, image}) {
    let finalUsername = username.trim();
    if (users.some((user) => user.username === finalUsername)) {
        throw new Error("Username already exists.");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
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
        starred : []
    };
    users.push(newUser);
    return newUser;
}

function getUserById(id) {
    return users.find((user) => user.id === id) || null;
}

function findUserByCredentials(username, password) {
    return users.find((user) => user.username === username && user.password === password) || null;
} 

function starFile(userId, fileId) {
    const user = getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.starred.includes(fileId)) {
        user.starred.push(fileId);
    }
}

function unstarFile(userId, fileId) {
    const user = getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.starred = user.starred.filter(id => id !== fileId);
}

function getStarredFiles(userId) {
    const user = getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user.starred;
}
    

module.exports = {
    createUser,
    getUserById,
    findUserByCredentials,
};