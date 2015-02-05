// Grocery products
Products = new Mongo.Collection("products");



if (Meteor.isClient) {

  Template.body.helpers({
    products: function() {
      return Products.find({}, {sort: {name: 1}});
    }
  });

  Template.body.events({

    "submit .new_product": function(event) {
      event.preventDefault();
      event.stopPropagation();
    
      var name = event.target.text.value;
      
      Products.insert({
        //TODO Should check for existing products of the same name.
        name: name,
        createdAt: new Date(),
        isNeeded: true
      });

      event.target.text.value = "";
    },

    "change #shoppinglist li label input[type~=checkbox]": function(event) {
      Products.update(this._id, {$set: {isNeeded: !this.isNeeded}});
    },

    "dragenter #shoppinglist li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      //console.log('dragenter');
      $(event.target).addClass("drop_target");
    },

    "dragover #shoppinglist li": function(event) {
      event.preventDefault();
      event.stopPropagation();
    },

    "dragleave #shoppinglist li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('dragleave');
      $(event.target).removeClass("drop_target");
    },

    "drop #shoppinglist li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      //console.log("drop event");
      
      
      if(event.originalEvent.dataTransfer){
        var product_id = $(event.currentTarget).attr("id");
        var files = event.originalEvent.dataTransfer.files;
          if(files.length) {
            for (var f in files) {
              if (files[f] instanceof File) {
                window.fileinquestion = files[f];
                var old_name = files[f].name;
                var ext = old_name.substr(old_name.lastIndexOf('.'));
                var new_name = product_id + ext;
                Meteor.saveFile(files[f], product_id + ext); 
                Products.update(product_id, {$set: {"image": new_name }});
              }
            }
          }   
      }
    }

  });







}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
