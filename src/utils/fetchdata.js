export const getUserData = async (userId) => {
    const response = await fetch(`http://localhost:3000/user/${userId}`).then(
        (res) => {
            if (!res.ok) return { data: undefined }
            return res.json()
        }
    )
    return response.data
}

export const getUserActivity = async (userId) => {
    const response = await fetch(
        `http://localhost:3000/user/${userId}/activity`
    ).then((res) => {
        if (!res.ok) return { data: { sessions: undefined } }
        return res.json()
    })
    console.log(response)
    return response.data.sessions
}

export const getTimes = async (userId) => {
    const response = await fetch(
        `http://localhost:3000/user/${userId}/average-sessions`
    ).then((res) => {
        if (!res.ok) return { data: { sessions: undefined } }
        return res.json()
    })
    return response.data.sessions
}

export const getPerformances = async (userId) => {
    const response = await fetch(
        `http://localhost:3000/user/${userId}/performance`
    ).then((res) => {
        if (!res.ok) return { data: { kind: undefined, data: undefined } }
        return res.json()
    })
    return { kind: response.data.kind, data: response.data.data }
}
