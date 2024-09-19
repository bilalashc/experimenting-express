import express from 'express'
import bcrypt from 'bcrypt'

const router = express.Router()
const users = []

router.post('/register', async (request, response) => {
    const {username, password} = request.body

    if (!username || !password){
        response.status(400).json({message: "Username and Password are required"})
    }

    const exisitingUser = users.find(user => user.username === username)
    if (exisitingUser){
        response.status(400).json({message: "Sorry the username already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username: username, password: hashedPassword})

    response.status(201).json({message: "New user created successfully"})

})

router.post('/login', async (request, response) => {
    const {username, password} = request.body

    const user = users.find(user => user.username === username)

    if (!user){
        return response.status(400).json({message: "Invalid Credentials"})
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch){
        return response.status(400).json({message: "Invalid Credentials"})
    }

    request.session.user = {username}
    return response.status(201).json({message: "User logged in successfully"})

})

router.delete('/logout', (request, response) => {
    request.session.destroy();
    response.status(201).json({message: "User logged out successfully"})
})

export default router;