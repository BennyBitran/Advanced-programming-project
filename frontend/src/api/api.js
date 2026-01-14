// sends a POST request to our node backend to register a new user
export async function registerUser({ username, name, image, password }) {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // convert the user data to a JSON string
        body: JSON.stringify({ username, name, image, password }),
    });
    // if the response is not ok, throw an error with the message from the server
    if (!response.ok) {
        let msg = `HTTP ${response.status}` 
        try {
            // try to extract the error message from the response body
            const data = await response.json();
            if (data && data.error) {
                msg = data.error;
            }
        } catch {}
        throw new Error(msg);
    }
}

export async function loginUser({username, password}) {
    const response = await fetch("/api/tokens", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({username, password}),
    });
    if(!response.ok) {
        let msg = `HTTP ${response.status}`
        try {
            const data = await response.json()
            if (data && data.error) {
                msg = data.error
            }

        } catch {}
        throw new Error(msg)
    }
    const data = await response.json();
    return data;
}