
const express = require("express");
const mysql = require('mysql');

const app = express();
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

// index page
app.get('/', (req , res ) => {  
    res.render("index",{name : "vitu fishi"});
});

//items page 
app.get('/items',(req,res) => {
    connection.query(
        'SELECT * FROM items',
        (error, results) => {
            res.render('items' , {items:results});
        }
    );
});

// edit page
app.get('/items/:id',(req,res) => {
    // get route parameter (id)
    let id = Number(req.params.id);

    connection.query(        
        'SELECT * FROM items WHERE id = ?', id,
        (error,results) => {
            if(results){
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
app.listen(8080);