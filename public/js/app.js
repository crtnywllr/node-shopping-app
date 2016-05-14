//Step1
var itemList;

function getItems() {
    var ajax = $.ajax('/items', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(response) {
        itemList = response;
        //Updating user view after each call
        $('.shopping-list').empty();
        for (var i=0; i < response.length; i++){
            var item = itemList[i];
            appendItem(item);
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
function appendItem(item) {
    //https://api.jquery.com/data/
    //Each row would need to have _id as hidden data attribute
    var row = $('<li data-id='+ item._id + '><button class="checkbox"><i class="fa fa-check" aria-hidden="true"></i></button><span>' + item.name + '</span><button class="delete"><i class="fa fa-remove" aria-hidden="true"></i></button></li>');
    //add after previous list items
    $('.shopping-list').append(row);
}


//Step 2
$(document).ready(function () {
    getItems();
    $('#add').on('click', function () {
        addItem();
    });
    $('.clear').on('click', function () {
            clearList();
        })
    $('.popular li').on('click', function () {
        var itemValue = $(this).text();
        var item = {
            'name': itemValue
        };
         var ajax = $.ajax('/items', {
            type: 'POST',
            data: JSON.stringify(item),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax.done(function() {
            getItems()
        });
    })

});
$(document).on('click', '.checkbox', checkItem);
$(document).on('click', '.delete', function() {
   var id = ($(this).parent().data('id'));
        deleteItem(id);
    });
    

//add on enter
$(document).on('keypress', function (key) {
    //keyCode == 13 is the ENTER key
    if (key.keyCode == 13) {
        addItem();
    }
});
