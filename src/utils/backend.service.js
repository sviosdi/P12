import {
    USER_MAIN_DATA,
    USER_ACTIVITY,
    USER_AVERAGE_SESSIONS,
    USER_PERFORMANCE,
} from './mocked-data'

export class API {
    constructor(baseUrl = null) {
        this.baseUrl = baseUrl
    }

    async getUserData(userId) {
        if (this.baseUrl !== null) {
            const response = await fetch(`${this.baseUrl}/user/${userId}`).then(
                (res) => {
                    if (!res.ok) return { data: undefined }
                    return res.json()
                }
            )
            if (response === undefined) return response
            else return response.data
        } else {
            return USER_MAIN_DATA.filter((u) => u.id === userId)[0]
        }
    }

    async getUserActivity(userId) {
        if (this.baseUrl !== null) {
            const response = await fetch(
                `${this.baseUrl}/user/${userId}/activity`
            ).then((res) => {
                if (!res.ok) return { data: { sessions: undefined } }
                return res.json()
            })
            if (response === undefined) return response
            else return response.data.sessions
        } else {
            const activity = USER_ACTIVITY.filter((u) => u.userId === userId)[0]
            return activity ? activity.sessions : undefined
        }
    }

    async getTimes(userId) {
        if (this.baseUrl !== null) {
            const response = await fetch(
                `${this.baseUrl}/user/${userId}/average-sessions`
            ).then((res) => {
                if (!res.ok) return { data: { sessions: undefined } }
                return res.json()
            })
            if (response === undefined) return response
            else return response.data.sessions
        } else {
            const times = USER_AVERAGE_SESSIONS.filter(
                (u) => u.userId === userId
            )[0]
            return times ? times.sessions : undefined
        }
    }

    async getPerformances(userId) {
        if (this.baseUrl !== null) {
            const response = await fetch(
                `${this.baseUrl}/user/${userId}/performance`
            ).then((res) => {
                if (!res.ok)
                    return { data: { kind: undefined, data: undefined } }
                return res.json()
            })
            if (response === undefined) return response
            else return { kind: response.data.kind, data: response.data.data }
        } else {
            return USER_PERFORMANCE.filter((u) => u.userId === userId)[0]
        }
    }
}
