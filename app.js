
const express = require("express");
const mysql = require('mysql');

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'list_app'
});

// connection.connect();

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
  });

app.use(express.static('public'));

//Config to get access to form values
app.use(express.urlencoded({extended: false}));
app.set('views', './views');
app.set('view engine', 'ejs');

const items = [{id:1, name:'potatoes'},{id:2, name:'chilli'},{id:3, name:'yams'}]

app.get('/', (req , res ) => {  
    res.render("index",{name : "vitu fishi"});
});

app.get('/items',(req,res) => {
    // res.render('items' , {items: items});
    connection.query(
        'SELECT * FROM items',
        (error, results) => {
            console.log(results);
        }
    );
});

app.get('/items/:id',(req,res) => {
    // res.status(404).send("Sorry can't find that!")
    // get route parameter (id)
    // console.log(req.params.id);
    let id = Number(req.params.id);
    let item = items.find(item => item.id === id);
    // console.log(req.params.id);
    if(item){
        res.render ('item' , {item : item});
    }
    else{
        res.render ('error');
    }
    // console.log(item);
    
})

//grab form
app.get('/create', (req,res) => {
    res.render('create');
});

//submit form
app.post('/create',(req, res) =>{
    //grab input data & add to the list
    let count = items.length + 1;
    items.push({id: count, name: req.body.newItem});
    // console.log(items);
    //redirect to items page
    res.redirect('items');
 
});

//update item
app.get('/update/:id', (req, res) => {
    res.render('edit');
});
app.listen(8080);