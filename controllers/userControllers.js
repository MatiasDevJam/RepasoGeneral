const fs = require('fs');
const path = require('path')
const bcrypt = require('bcrypt');
const users_db = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

const {validationResult} = require('express-validator');

module.exports = {
    register: (req, res)=>{
        res.render('register')
    },
    processRegister: (req, res)=>{

        let errores = validationResult(req);

        if(!errores.isEmpty()){
            return res.render('register', {
                errores: errores.errors
            })
        }else{

        const {username, email, pass} = req.body;
        
        let lastID = 0;
        users_db.forEach(user => {
            if(user.id > lastID){
                lastID = user.id
            }
        });

        let hashPass = bcrypt.hashSync(pass, 12)

        let newUser = {
            id: +lastID +1,
            username,
            email,
            pass: hashPass,
            avatar: req.files[0].filename
        };

        users_db.push(newUser);

        fs.writeFileSync('./data/users.json', JSON.stringify(users_db, null, 2));

        return res.redirect('/users/login')
    }
    },
    login: (req, res)=>{
        res.render('login')
    },
    processLogin: (req, res)=>{
        
        

        let errores = validationResult(req);

        if(!errores.isEmpty()){
            return res.render('login', {
                errores: errores.errors
            })
        }else{
            const {email,pass,recordar} = req.body;

            let result = users_db.find(user => user.email === email);

            if(result){
                if(bcrypt.compareSync(pass.trim(), result.pass)){

                    req.session.user = {
                        id: result.id,
                        username: result.username,
                        avatar: result.avatar
                    }

                    if(recordar != 'undefined'){
                        res.cookie('userCom4', req.session.user,{
                            maxAge: 1000 * 60
                        })
                    }

                    return res.redirect('/users/profile')
                }
            }
            return res.render('login', {
                errores: [
                    {
                        msg: "credenciales inválidas"
                    }
                ]
            })
            }
        },
        profile: (req, res)=>{
            res.render('profile')
        },del: (req,res)=>{
            
            users_db.forEach(user =>{
            if(user.id === +req.params.id){
                if(fs.existsSync(path.join('public', 'images', user.avatar))){
                    fs.unlinkSync(path.join('public', 'images', user.avatar))
                }
                aEliminar = users_db.indexOf(user);
                users_db.splice(aEliminar,1)
            }
        });
            fs.writeFileSync('./data/users.json', JSON.stringify(users_db,null,2));
            res.redirect('/');

        },
        logout: (req,res)=>{
            req.session.destroy();
            if(req.cookies.userCom4){
                res.cookie('userCom4','',{
                    maxAge: -1
                })
            }
            res.redirect('/')
        }
    }



