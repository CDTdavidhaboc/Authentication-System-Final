  import pool from './db.js'
    import validator from 'validator';
    import bcrypt from 'bcryptjs';
    import jwt from "jsonwebtoken";

    export const getUser = async (id) => {
        if(parseInt(id) === NaN){
            throw  new Error ("Invalid Id");
        }
        const [user] =await pool.query('Select * FROM users WHERE id = ?', [id]);
        return user;
    }

    export const createUser = async (userProfile, email, password, role) => {
        //if empty
        if (email === ''){
            throw new Error('Invalid email');
        }

        //invalid format
        if (!validator.isEmail(email)){
            throw new Error('Invalid email format');
        }

        // if existing
        const user = await pool.query(
            'SELECT * From users WHERE email = ?',
            [email]
        )

    if(user.length === 1){
        throw new Error(`The email ${email} is already used`);
        }

        //if password is empty
        if(password === ''){
            throw new Error('Invalid Password');
        }
        //if weak password
        if(!validator.isStrongPassword(password)){
            throw new Error('Password too weak.');
        }

        const salt = bcrypt.genSaltSync(10);
        const newPassword = bcrypt.hashSync(password, salt);

            const response = await fetch(
            'https://users-api-we0n.onrender.com/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userProfile)
            });

            const result = await response.json();

            console.log(result);

        const newUser = await pool.query(
            'INSERT INTO users(email, password, role) VALUES(?,?,?)',
            [email, newPassword, role]
        )   

            return newUser.insertId;
        
    }

    export const login = async (email, password) => {
        if(email === '' || password === ''){
            throw new Error('Email and password are required');
        }

        const[user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if(user.length === 0){
            throw new Error(`An account with email:${email} does not exist.`);
        }

        if(!bcrypt.compareSync(password, user[0].password)){
            throw new Error('Incorrect Password.');
        }

        const token =jwt.sign({id: user[0].id, role:user.role}, process.env.SECRET, {expiresIn:'1d'})


        return token;
    }
