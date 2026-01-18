// one func to handle all CRUD operations
export async function apiRequest(path, method = "GET", body, headers = {}, withAuth = false) {
    const config = {
        method,
        headers: { ...headers },
    };
    if (withAuth && typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
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
        if (data && data.error) {
            msg = data.error;
        }
        throw new Error(msg);
    }
    return data;
}



// sends a POST request to our node backend to register a new user
export async function registerUser({ username, name, image, password }) {
    return apiRequest("/api/users", "POST", { username, name, image, password });
}

export async function loginUser({ username, password }) {
    return apiRequest("/api/tokens", "POST", { username, password });
}

export async function listFiles(parentId = null) {
    // Construct path with query param if an ID is provided to list files under a specific folder
    const path = parentId ? `/api/files?parentId=${parentId}` : "/api/files";
    return apiRequest(path, "GET", undefined, {}, true);
}

export async function uploadFile(fileData) {
    return apiRequest("/api/files", "POST", fileData, {}, true);
}

export async function deleteFile(fileId) {
    return apiRequest(`/api/files/${fileId}`, "DELETE", undefined, {}, true);
}
