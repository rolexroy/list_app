
const express = require("express");
const app = express();
app.use(express.static('public'))

//Config to get access to form values
app.use(express.urlencoded({extended: false}))
app.set('views', './views');
app.set('view engine', 'ejs');

const items = [{id:1, name:'potatoes'},{id:2, name:'chilli'},{id:3, name:'yams'}]

app.get('/', (req , res ) => {  
    res.render("index",{name : "vitu fishi"})
});

app.get('/items',(req,res) => {
    res.render('items' , {items: items});
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
app.listen(8080);