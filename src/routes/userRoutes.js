const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//get back all the users
router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.json({ message: err });
    }
})

//submit a user
router.post('/', (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    user.save()
        .then(data => {
            res.json(data);
        })
        .catch(err =>{
            res.json({message: err});
        });
});

router.post('/login', async (req,res)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user) return res.json({success: false, message:'User not found'});

    
    if(user.password !== req.body.password){
        return res.json({success: false, message:'Invalid credentials'});
    }
    const token = jwt.sign({_id: user._id}, 'secret');
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 *60 * 1000 //1 day
    });

    res.json({firstName: user.firstName});
});

router.get('/one', async(req,res)=>{
    try{
        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, 'secret');

        if(!claims){
            return res.status(401).send({
                message: 'Unauthenticated'
            });
        }

        const user = await User.findOne({_id:claims._id});
        const {password, ...data} = await user.toJSON()

        res.send(data);
    }catch(e){
        return res.status(401).send({
            message: 'Unauthenticated'
        });
    }
})

router.post('/logout', (req,res)=>{
    res.cookie('jwt', '', {maxAge: 0});

    res.send({
        message: 'success'
    });
})
module.exports = router;