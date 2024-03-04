const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');
const { ListCollectionsCursor } = require('mongodb');
const { render } = require('ejs');

const url = "mongodb://localhost:27017/todolistDB";
mongoose.connect(url);

const app = express();

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    customListItems: [itemsSchema]
};

const List = mongoose.model('List', listSchema);

const Item = mongoose.model('Item', itemsSchema);

const temp = new Item({ name: 'temp' });

let myItems = function () {
    return Item.find({}).then(token => { return token; });
}

let deleteItem = function (checkedItemName) {
    return Item.deleteOne({ name: checkedItemName }).then(token => { return token; });
}

let findCustomListItems = function (customListName) {
    return List.find({ name: customListName }).then(token => { return token; });
}

let findOneCustumListAndUpdate = function (customListName, update) {
    return List.findOneAndUpdate({ name: customListName }, { $set: { customListItems: update } }).then(token => { return token; });
}

let checkExistence = function (customListName) {
    return List.exists({ name: customListName }).then(token => { return token; });
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    const day = date.getDate();
    let items = myItems();
    items.then(function (result) {
        res.render('list', { listTitle: day, listItems: result });
    });
});

app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName;
    var exists = false;
    let checking = checkExistence(customListName);
    checking.then(function (result) {
        if (result === null) {
            const list = new List({
                name: customListName,
                customListItems: [temp]
            });
            list.save();
        }
        let findingCustomList = findCustomListItems(customListName);
        findingCustomList.then(function (result) {
            res.render('list', { listTitle: customListName, listItems: result[0].customListItems });
        });
    });
});

app.post('/delete/:custumListNameDel', (req, res) => {
    const day = date.getDate();
    const custumListNameDel = req.params.custumListNameDel;
    const checkedItemName = req.body.checkBox;
    if (_.lowerCase(custumListNameDel) === _.lowerCase(day)) {
        console.log(checkedItemName);
        deleteItem(checkedItemName);
        res.redirect('/');
    }
    else {
        let findingCustomList = findCustomListItems(custumListNameDel);
        findingCustomList.then(function (result) {
            let update = result[0].customListItems;
            let item = {};
            console.log(checkedItemName);
            update.forEach((element) => {
                console.log(element._id);
                if (element.name === checkedItemName) {
                    console.log(element._id.toString())
                    update.remove(element);
                }
            })
            console.log(item);
            //console.log(update);
            let findingcustomListAndUpdate = findOneCustumListAndUpdate(custumListNameDel, update);
            findingcustomListAndUpdate.then(function (result) {
                res.redirect('/' + custumListNameDel);
            });
        });
    }
});

app.post('/:customListName', (req, res) => {
    const customListName = req.params.customListName;
    if (_.lowerCase(customListName) === _.lowerCase(date.getDate())) {
        const item = new Item({ name: req.body.newItem });
        item.save();
        res.redirect('/');
    }
    else {
        const item = new Item({ name: req.body.newItem });
        console.log(item);
        let findingCustomList = findCustomListItems(customListName);
        findingCustomList.then(function (result) {
            let update = result[0].customListItems;
            update.push(item);
            console.log(update);
            let findingcustomListAndUpdate = findOneCustumListAndUpdate(customListName, update);
            findingcustomListAndUpdate.then(function (result) {
                res.redirect('/' + customListName);
            });
        });
    }
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(3000, () => { console.log('listening on port 3000'); });