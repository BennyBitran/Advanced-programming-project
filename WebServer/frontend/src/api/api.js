export async function registerUser({ username, name, image, password }) {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, name, image, password }),
    });

    if (!response.ok) {
        let msg = `HTTP ${response.status}` 
        try {
            const data = await response.json();
            if (data.error && data) {
                msg = data.error;
            }
        } catch {}
        throw new Error(msg);
    }
}