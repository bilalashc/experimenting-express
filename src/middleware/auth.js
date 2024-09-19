function auth (request, response, next){
    if (request.session && request.session.user){
        next()
    } else{
        response.status(400).json({message: "Unauthorized Access"})
    }
}

export default auth