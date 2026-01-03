const crypto = require("crypto");
// pid: unique permission id
// each permission: {pid, fileId, userId, permissionType}
const permissions = [];

function listFilePermissions(fileId) {
    return permissions.filter((perm) => perm.fileId === fileId);
}

function listUserPermissions(userID) {
    return permissions.filter((perm) => perm.userId === userID);
}

function checkUserPermission(fileId, userId, permissionType) {
    const permission = permissions.find((perm) => perm.fileId === fileId && perm.userId === userId);
    if (!permission) {
        return false;
    }
    return permissionType === 'read' || ( permissionType === 'write' && permission.permissionType === 'write');
}

function addPermission(fileId, userId, permissionType) {
    if(permissionType !== 'read' && permissionType !== 'write') {
        return null;
    }
    if(permissions.some((perm) => perm.fileId === fileId && perm.userId === userId)) {
        return null;
    }
    let pid;
    do {
        pid = crypto.randomUUID();
    } while (permissions.some((perm) => perm.pid === pid));
    const newPermission = {
        pid,
        fileId,
        userId,
        permissionType,
    };
    permissions.push(newPermission);
    return newPermission;
}


function updatePermission(permissionId, newPermissionType) {
    if(newPermissionType !== 'read' && newPermissionType !== 'write') {
        return false;
    }
    const permission = permissions.find((perm) => perm.pid === permissionId);
    if(!permission) {
        return false;
    }
    permission.permissionType = newPermissionType;
    return true;
}


function removePermission(permissionId) {
    const index = permissions.findIndex((perm) => perm.pid === permissionId);
    if(index === -1) {
        return false;
    }
    permissions.splice(index, 1);
    return true;
}

function getPermissionById(permissionId) {
    return permissions.find((perm) => perm.pid === permissionId) || null;
}
module.exports = {
    listFilePermissions,
    listUserPermissions,
    addPermission,
    updatePermission,
    removePermission,
    getPermissionById,
    checkUserPermission,
};