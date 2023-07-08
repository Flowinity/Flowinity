type ErrorObject = {
    error?: string
    path?: string
    value?: string
    message?: string
    name?: string
    status?: number
}

type ErrorArray = {
    errors: ErrorObject[]
}
