const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');
const { ListCollectionsCursor } = require('mongodb');
const { render } = require('ejs');

const app = express();

const ToDoListRoute = "https://threebdojapi.onrender.com/todolist"

function encodeFormData(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

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

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    const day = date.getDate();
    fetch(ToDoListRoute)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((result) => {
            console.log(result);
            res.render('list', { listTitle: day, listItems: result });
        });
});

app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName;
    fetch(ToDoListRoute + '/' + customListName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((result) => {
            console.log(result);
            res.render('list', { listTitle: customListName, listItems: result.customListItems });
        });
});

app.post('/delete/:custumListNameDel', (req, res) => {
    const day = date.getDate();
    const custumListNameDel = req.params.custumListNameDel;
    const chechedItemId = req.body.checkBox;
    const chechedItemName = req.body.name;
    console.log(chechedItemName);
    if (_.lowerCase(custumListNameDel) === _.lowerCase(day)) {
        fetch(ToDoListRoute, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeFormData({
                id: chechedItemId
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Delete successful:', data);
                res.redirect('/');
            })
            .catch(error => {
                console.error('There was a problem with the delete operation:', error);
            });
    }
    else {
        fetch(ToDoListRoute + '/' + custumListNameDel, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeFormData({
                ItemName: chechedItemName
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response;
            })
            .then(data => {
                console.log('Delete successful:', data);
                res.redirect('/' + custumListNameDel);
            })
            .catch(error => {
                console.error('There was a problem with the delete operation:', error);
            });
    }
});

app.post('/:customListName', (req, res) => {
    const customListName = req.params.customListName;
    if (_.lowerCase(customListName) === _.lowerCase(date.getDate())) {
        fetch(ToDoListRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodeFormData({
                newItem: req.body.newItem
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response;
            })
            .then(data => {
                console.log('Success:', data);
                res.redirect('/');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    else {
        fetch(ToDoListRoute + "/" + customListName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodeFormData({
                customListNewItemName: req.body.newItem
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response;
            })
            .then(data => {
                console.log('Success:', data);
                res.redirect("/" + customListName);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(3000, () => { console.log('listening on port 3000'); });