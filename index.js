const express = require("express");
const https = require('https');
const app = express();
var bodyParser = require('body-parser');
const { default: axios } = require("axios");
//const { response } = require("express");



const port = 8081;
app.use(bodyParser.json())

// to get all todos without userId
//url => localhost:8081/todo
app.get('/todo', (request, response) => {
    console.log('called')
    axios.get('https://jsonplaceholder.typicode.com/todos').then((resp) => {
        // console.log(resp.data);
        let data = resp.data;
        data = data.map(item => ({
            "id": item.id,
            "title": item.title,
            "completed": item.completed
        }))
        response.send(data);
        response.end();
    }, (erro) => {
        console.log(erro);
    })
})


// to get all todos without userdata
//url => localhost:8081/users/:userId
//userid should valid User Id
app.get('/users/:userId', async (request, response) => {
    const userId = parseInt(request.params.userId);
    const userUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
    const todoUrl = 'https://jsonplaceholder.typicode.com/todos';
    var userTodo = [];

    userTodo = await getUserdata(todoUrl, userTodo, userId)
    await axios.get(userUrl).then((resp) => {
        let user = resp.data;
        // console.log(userTodo);
        user.Todos = userTodo;
        response.send(user);
        response.end();

    }, (erro) => { console.log(erro) })

})

// function is created cause we need fetch data 
async function getUserdata(todoUrl, userTodo, userId) {
    await axios.get(todoUrl).then((resp) => {
        // console.log(resp.data);
        let data = resp.data;
        for (let index = 0; index < data.length; index++) {
            if (data[index].userId === userId) {
                let Mdata = {
                    "id": data[index].id,
                    "title": data[index].title,
                    "completed": data[index].completed
                }

                userTodo.push(Mdata);
            }

        }
        //console.log(userTodo)
    }, (erro) => {
        console.log(erro);
    })
    return userTodo;
}



var server = app.listen(port, () => {
    console.log(`server is running at ${server.address().port}`);
})