// one func to handle all CRUD operations
export async function apiRequest(path, method = "GET", body, headers = {}) {
    const config = {
        method,
        headers: { ...headers,},
    };
    if (body !== undefined) {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(body);
    }
    const response = await fetch(path, config);
    let data = null;
    try {
        data = await response.json();
    } catch {}

    if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
            const data = await response.json();
            if (data && data.error) {
                msg = data.error;
            }
        } catch {}
        throw new Error(msg);
    }
    return data;
}



// sends a POST request to our node backend to register a new user
export async function registerUser({ username, name, image, password }) {
    return apiRequest("/api/users", "POST", { username, name, image, password });
    
}

export async function loginUser({username, password}) {
    return apiRequest("/api/tokens", "POST", {username, password});
}

export async function listFiles() {
    return apiRequest("/api/files");
}
export async function uploadFile(fileData) {
    return apiRequest("/api/files", "POST", fileData);
}

export async function deleteFile(fileId) {
    return apiRequest(`/api/files/${fileId}`, "DELETE");
}