
const express = require("express");
const app = express();
app.use(express.static('public'))
app.set('views', './views');
app.set('view engine', 'ejs');

const items = [{id:1, name:'potatoes'},{id:2, name:'chilli'},{id:3, name:'yams'}]

app.get('/', (req , res ) => {  
    res.render("index",{name : "vitu fishi"})
});

app.get('/items',(req,res) =>{
    res.render('items' , {items: items});
})

app.get('/create', (req,res) => {
    res.render('add');
});

app.listen(3000)