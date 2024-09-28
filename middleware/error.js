module.exports.apiNotFound = (async(req, res, next) =>{
    const obj = {
        http_code: 404,
        status: 'error',
        message: `Requested api not found on this server.`
    }
    return res.status(obj.http_code).send(obj)
})

module.exports.manageError = (async(error, req, res, next) =>{
    const { http_code = 500, message} = error

    const obj = {
        http_code,
        status: 'error',
        message
    }
    return res.status(obj.http_code).send(obj)
})