var mysql = require("mysql");
var inquirer = require("inquirer")
var itemsAvailable = [];


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Colina213!",
    database: "bamazonDB"
});

connection.connect(function () {
    //if (err) throw err;
    displayItems();
        });
        function displayItems() {
    connection.query("SELECT id, product_name, deparment_name, price, stock_quantity FROM products",
        function (err, results) {
        for (var i = 0; i < results.length; i++) {
                console.log("Id: " + results[i].item_id +
            " || Product: " + results[i].product_name + 
            " || Price: " + results[i].price);
            // ask them the ID of the product they would like to buy.
        inquirer
        .prompt({
        name: "customerChoice",
        type: "input",
        message: "Enter the ID for the item you want to buy: "
        })
        // once the customer has placed the order, check if your store has enough of the product to meet the customer's request.
        .then(function(answer){
        var item = results[answer.customerChoice - 1];
        var itemName = item.product_name;
        var itemQuantity = item.stock_quantity;
        console.log("You have chosen " + itemName + ". We have " + itemQuantity + " in stock.");
        
        // ask how many units of the product they would like to buy.
        inquirer
            .prompt({
            name: "howMany",
            type: "input",
            message: "Hot many would you like to buy?"
        })
        // if your store _does_ have enough of the product, you should fulfill the customer's order.
        // show the customer the total cost of their purchase.
        .then(function(answer){
            var stock = parseInt(itemQuantity) - parseInt(answer.howMany);
          var totalCost = parseInt(item.price) * parseInt(answer.howMany);
            console.log("Your order: " + answer.howMany + " " + itemName);
            console.log("Your total is: $" + totalCost);
            console.log("We now have " + stock + " " + itemName + " remaining.");
            // update the SQL database to reflect the remaining quantity.
            connection.query("UPDATE products SET ? WHERE ?",
            [{
            stock_quantity: stock
            },
            {
            item_id: item.item_id
            }
            ],
            function(err){
            if (err) throw err;
            console.log("Database updated!");
            connection.end();
            });
            })
        })
    };
})}
        
//If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
    
// displayProducts();

// function displayProducts(){
//     connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     console.log(res); 
// });
// };

// inquirer
//         .prompt({
//             name: "userInput",
//             type: "input",
//             message: "What is the ID of the item you would like to purchase?"
//         })
// // once the customer has placed the order, check if your store has enough of the product to meet the customer's request.
//         .then(function(answer){
//             var item = res[answer.userInput - 1];
//             var itemName = item.product_name;
//             var itemQuantity = item.stock_quantity;
//             console.log("You have chosen " + itemName + ". We have " + itemQuantity + " in stock.")
