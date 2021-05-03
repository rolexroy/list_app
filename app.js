
const express = require("express");
const mysql = require('mysql');
const session = require('express-session');

const app = express();

app.use(
    session({
        secret: 'vitu fishi',
        resave: false,
        saveUninitialized: false
    })
)

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cheruiyot',
    database: 'list_app'
});

// connection.connect();

// connection.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
  
//     console.log('connected as id ' + connection.threadId);
//   });

app.use(express.static('public'));

//Config to get access to form values
app.use(express.urlencoded({extended: false}));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
     if(req.session.userId === undefined){
        console.log('You are not logged in');
        // res.redirect('/');
    }else{
        console.log('You are logged in. ');
        res.locals.username = req.session.username;   
    }
    next();
})

// index page
app.get('/', (req , res ) => {  
    res.render("index",{name : "vitu fishi"});
});

//items page 
app.get('/items',(req,res) => {   
     connection.query(
        'SELECT * FROM items WHERE user_id = ?', req.session.userId,
        (error, results) => {
            console.log('User ID: ' + req.session.userId);
            res.render('items' , {items:results});
        }
    );
});

// edit page
app.get('/items/:id',(req,res) => {
    // get route parameter (id)
    let id = Number(req.params.id);

    connection.query(        
        'SELECT * FROM items WHERE id = ? AND user_id = ?',[id, req.session.userId] ,
        (error,results) => {
            if(results.length === 1){
                res.render ('edit' , {item : results[0]});
            }else{
                res.render ('error');
            }
        }
    );
    
})

//grab form to add item
app.get('/create', (req,res) => {
    res.render('create');
});

//submit form with newly added item
app.post('/create',(req, res) =>{
    //grab input data & add to the list
    let itemName = req.body.newItem;
    connection.query('INSERT INTO items (name) VALUES (?)',itemName,
    (error,results) => {
        res.redirect('/items')
    });
    // console.log(items);
    //redirect to items page
 
});


//update item
app.post('/update/:id', (req, res) => {
    let id = Number(req.params.id);
    let name = req.body.newItem;

    connection.query('UPDATE items SET name = ? WHERE id = ?',
        [name,id],
        (error, results) => {
            res.redirect('/items');
        }
    );
});

//delete item
app.post('/delete/:id', (req ,res) => {
    const id = Number(req.params.id);
    connection.query('DELETE FROM items WHERE id = ?', id,
        (error, results) => {
        res.redirect('/items');
        }
    );
})

//get Login form
app.get('/login', (req,res) =>{
    res.render('login');
})

//submit Login form
app.post('/login', (req,res) =>{
    let email = req.body.email;
    let password = req.body.password;

    // TODO : Add validations

    connection.query(
        'SELECT * FROM users WHERE email = ?', email,
        (error, results) => {
            if(password === results[0].pw){
                req.session.userId = results[0].id;
                req.session.username = results[0].username;
                console.log('correct password')
                res.redirect('/items');
            }else{
                console.log('incorrect password')
                res.redirect('/');
            }
        }
    )
})

//get signup form
app.get('/signup', (req,res) =>{
    res.render('signup');
})

//submit submit form
app.post('/signup', (req,res) => {
    let email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        confirmPassword = req.body.confirmPassword;

        // TODO : Add validation

        if(password === confirmPassword){
            connection.query(
                'INSERT INTO users (username,pw,email) VALUES (?,?,?)',
                [username, password, email],
                res.redirect('/login')
            )
            console.log('Account created successfully');
        } else{
            console.log('Password/Confirm Password mismatch');
        }
})
app.listen(8080);