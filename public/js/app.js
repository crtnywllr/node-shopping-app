//Step1
var itemList;

function getItems() {
    var ajax = $.ajax('/items', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(response) {
        itemList = response;
        console.log(response);
        //Updating user view after each call
        $('.shopping-list').empty();
        for (var i=0; i < response.length; i++){
            appendItem(response[i]._id);
        }
    });
};
//Adding items

function addItem() {
    //POST user input to database
    var name = $('#new-item').val();
    if (name.length === 0) {
        alert('Please add an item!');
    }
    else {
        var item = {
            'name': name
        };
        var ajax = $.ajax('/items', {
            type: 'POST',
            data: JSON.stringify(item),
            dataType: 'json',
            contentType: 'application/json'
        });
        //Call to update list with new info
        ajax.done(function() {
            getItems()
        });
        
        itemValue = $('#new-item').val('');
    }
};

    
//check item
function checkItem() {
    $(this).parent().toggleClass('click');
}

//delete item
function deleteItem(id) {
    var ajax = $.ajax('/items/' + id, {
        type: 'DELETE',
        dataType: 'json'
    });
    ajax.done(function() {
        getItems()
    });
};


//clear list
function clearList() {
    //delete ajax call for all list items (forEach?)
    $('.shopping-list').empty();
    //alert("I've just activated the clearList() function");
}

//append item
//will need to be instructions to the GET ajax call of how to display the data
function appendItem(itemValue) {
    var row = $('<li><button class="checkbox"><i class="fa fa-check" aria-hidden="true"></i></button><span>' + itemValue + '</span><button class="delete"><i class="fa fa-remove" aria-hidden="true"></i></button></li>');
    //add after previous list items
    $('.shopping-list').append(row);
}


//Step 2
$(document).ready(function () {
    getItems();
    /*on click(#add) function addItem()*/
    $('#add').on('click', function () {
        addItem();
    });
    /*on click(.clear) function clearList ()*/
    $('.clear').on('click', function () {
            clearList();
        })
        /*on click(.popular li) function addBottom ()*/
    $('.popular li').on('click', function () {
        var itemValue = $(this).text();
        appendItem(itemValue);

    })

});
/*on click (.checkbox) function checkItem()*/
$(document).on('click', '.checkbox', checkItem);
/*on click(.delete) function deleteItem ()*/
$(document).on('click', '.delete', function() {
   var id = ($(this).parent().text());
   console.log(id);
    deleteItem(id);
    });
    

//add on enter
$(document).on('keypress', function (key) {
    //keyCode == 13 is the ENTER key
    if (key.keyCode == 13) {
        addItem();
    }
});
