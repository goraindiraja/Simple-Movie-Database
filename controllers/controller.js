const {User, Profile, Rating, Movie, Wishlist} = require('../models');
const { Op } = require("sequelize");
const convertDuration = require('../helper/convertDuration');
const bcryptjs = require('bcryptjs');
const { error } = require('console');

class Controller{
    //----- Login Form -----//
    static async loginForm(req, res){
        try {

            let error = req.query.error
            
            let errorMessage = []
            if(error){
                errorMessage = error.split(",")
            }
            
            res.render('login', {errorMessage})

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async handleLogin(req, res){
        try {
            console.log(req.body);
            let {username, password} = req.body
            console.log(username, password);

            let user = await User.findOne({
                where: {
                    username
                }
            })

            if(!user){
                throw Error("User Not Found")
            }

            if(!username || !password){
                // let errors = 'Username or Password Cannot be Empty'
                throw Error('Username or Password Cannot be Empty')
            }
            
            let isFound = bcryptjs.compareSync(password, user.password)

            if(isFound){
                if(user.role === "Admin"){
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                    res.redirect("/movies-admin")

                } else{
                    // res.send("Member")
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                    res.redirect("/movies")
                }

            } else{
                throw Error("Password Wrong")
            }

            
        } catch (error) {
            if(error.name === 'SequelizeValidationError'){
                let errors = error.errors.map(error => {
                    return error.message
                })

                res.redirect(`/login?error=${errors}`)
            } else{
                console.log(error);
                res.redirect(`/login?error=${error.message}`)
            }
        }
    }

    //----- Register Form -----//
    static async registerForm(req, res){
        try {

            let error = req.query.error
            
            let errorMessage = []
            if(error){
                errorMessage = error.split(",")
            }

            console.log(errorMessage);
            res.render('register', {errorMessage})

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleRegister(req, res){
        try {
            console.log(req.body);
            let {firstName, lastName, username, password, email, dateOfBirth, role} = req.body
            
            let data = await User.create({
                username,
                password,
                role
            })

            await Profile.create({
                firstName,
                lastName,
                email,
                dateOfBirth,
                UserId: data.id
            })

            res.redirect('/login')

        } catch (error) {
            if(error.name === 'SequelizeValidationError'){
                let errors = error.errors.map(error => {
                    return error.message
                })

                res.redirect(`/register?error=${errors}`)
            } else{
                console.log(error);
                res.redirect(`/register?error=${error.message}`)
            }
        }
    }

    static async showAllMovies(req, res){
        try {

            let {deleted} = req.query
            let {search} = req.query

            let opt = {
                attributes: ['id', 'title', 'duration', 'genre', 'imageURL', 'votes', 'releasedYear'],
                include:{
                    model: Rating,
                    attributes: ['name']
                }
            }

            if(search){
                opt = {
                    attributes: ['id', 'title', 'duration', 'genre', 'imageURL', 'votes', 'releasedYear'],
                    include:{
                        model: Rating,
                        attributes: ['name']
                    },
                    where:{
                        title: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                }
            }

            let data = await Movie.findAll(opt);
            res.render('movies', {data, convertDuration})
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    
    static async showAllMoviesAdmin(req, res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }

            let {deleted} = req.query
            let {search} = req.query

            let opt = {
                attributes: ['id', 'title', 'duration', 'genre', 'imageURL', 'votes', 'releasedYear'],
                include:{
                    model: Rating,
                    attributes: ['name']
                }
            }

            if(search){
                opt = {
                    attributes: ['id', 'title', 'duration', 'genre', 'imageURL', 'votes', 'releasedYear'],
                    include:{
                        model: Rating,
                        attributes: ['name']
                    },
                    where:{
                        title: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                }
            }

            let data = await Movie.findAll(opt);

            res.render('movies-admin', {data, deleted, convertDuration})

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async movieDetails(req, res){
        try {
            let data = await Movie.findOne({
                include: {
                    model: Rating,
                },
                where: {
                    id: req.params.id
                }
            })

            res.render('movies-detail', {data, convertDuration})

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async movieDetailsAdmin(req, res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }

            let data = await Movie.findOne({
                include: {
                    model: Rating,
                },
                where: {
                    id: req.params.id
                }
            })

            res.render('movies-detail-admin', {data, convertDuration})

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async addMovieForm(req,res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }

            let error = req.query.error
            
            let errorMessage = []
            if(error){
                errorMessage = error.split(",")
            }
            
            let data = await Rating.findAll();

            res.render('movies-add', {data, errorMessage})

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async postMovieForm(req, res){
        try {

            let {title, releasedYear, director, duration, genre, RatingId, trailerURL, synopsis} = req.body
            
            let buffer = ""
            let decodeBuffer = ""
            let changeImg = ""
            
            if(req.file){
                buffer = req.file.buffer
                decodeBuffer = Buffer.from(buffer).toString("base64")
                changeImg = `data:${req.file.mimetype};base64,${decodeBuffer}`
            }

            await Movie.create({
                title, 
                releasedYear, 
                director, 
                duration, 
                genre, 
                RatingId, 
                trailerURL, 
                synopsis,
                imageURL: changeImg
            })

            res.redirect('/movies-admin')

        } catch (error) {
            if(error.name === 'SequelizeValidationError'){
                let errors = error.errors.map(error => {
                    return error.message
                })

                res.redirect(`/movies-admin/add?error=${errors}`)
            } else{
                console.log(error);
                res.send(error)
            }
        }
    }

    static async editMovieForm(req,res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }

            let error = req.query.error
            
            let errorMessage = []
            if(error){
                errorMessage = error.split(",")
            }

            let data = await Movie.findOne({
                where: {
                    id: req.params.id
                }
            })

            // console.log(data);

            let rating = await Rating.findAll()

            res.render('movies-edit', {data, rating, errorMessage})
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async postEditForm(req, res){
        try {
            let {id} = req.params

            await Movie.update(req.body, {
                where:{
                    id
                }
            })
            
            res.redirect(`/movies/${id}`)

        } catch (error) {
            let {id} = req.params

            if(error.name === 'SequelizeValidationError'){
                let errors = error.errors.map(error => {
                    return error.message
                })

                res.redirect(`/movies-admin/${id}/edit?error=${errors}`)
            } else{
                console.log(error);
                res.send(error)
            }
        }
    }

    static async deleteMovies(req, res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }

            let {id} = req.params
            
            let deleted = await Movie.findOne({
                attributes: ['id', 'title'],
                where: {
                    id
                }
            })

            await Movie.destroy({
                where: {
                    id
                }
            })

            res.redirect(`/movies-admin?deleted=${deleted.title}`)
            
        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async addWatchlist(req, res){
        try {
            // console.log(req.session.user.id, "<<<<<");
            await Wishlist.create({
                UserId: req.session.user.id,
                MovieId: req.params.id,
            })

            res.redirect(`/movies/${req.params.id}`)

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async addWatchlistAdmin(req, res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }
            // console.log(req.session.user.id, "<<<<<");
            await Wishlist.create({
                UserId: req.session.user.id,
                MovieId: req.params.id,
            })
            
            res.redirect(`/movies-admin/${req.params.id}`)

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    //----- Wishlist -----//
    static async showWishlist(req, res){
        try {
            let data = await User.findOne({
                include: Movie,
                through: {Wishlist},
                where: {
                    id: req.session.user.id
                }
            })

            // res.send(data)
            // console.log(data.Movies.Wishlist);
            res.render("wishlist", {data, convertDuration})


        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showWishlistAdmin(req, res){
        try {

            if(req.session.user.role !== "Admin"){
                throw Error("Access Denied")
            }

            let data = await User.findOne({
                include: Movie,
                through: {Wishlist},
                where: {
                    id: req.session.user.id
                }
            })

            // res.send(data)
            // console.log(data.Movies.Wishlist);
            res.render("wishlist-admin", {data, convertDuration})


        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    //----- Users Page -----//
    static async showAllUsers(req, res){
        try {
            let data = await Profile.findAll({
                include: {
                    model: User
                }
            })

            console.log(data);
            // console.log(data[0].Profiles[0].firstName);
            // res.send(data)
            res.render('users', {data})

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async deleteUser(req, res){
        try {
            let {userId} = req.params
            await User.destroy({
                where: {
                    id: userId
                }
            })

            await Profile.destroy({
                where: {
                    UserId: userId
                }
            })

            res.redirect("/users")

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async changeStatus(req, res){
        try {
            await Wishlist.update({
                status: "Finished"
            },{ where: {
                MovieId: req.params.id
            }})


            // console.log(data);
            res.redirect("/wishlist")

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }
    static logout(req, res) {
        req.session.destroy((err) => {
            if (!err) {
                res.redirect('/')
            }
        })
    } 
}

module.exports = Controller