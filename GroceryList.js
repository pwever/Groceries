// Grocery products
Products = new Mongo.Collection("products");



if (Meteor.isClient) {

  Template.body.helpers({
    products: function() {
      return Products.find({}, {sort: {name: 1}});
    }
  });




  

  Template.nav.events({

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

    "keyup .new_product": function(evt) {
      // get the needle
      console.log(evt.target.value);
      var needle = evt.target.value;

      // filter Product
      $("#shoppinglist li").css("display", "block");
      $("#shoppinglist li:not(:contains(" + needle + "))").css("display", "none");
    },

    "search .new_product": function(evt) {
      // get the needle
      console.log(evt.target.value);
      var needle = evt.target.value;

      // filter Product
      $("#shoppinglist li").css("display", "block");
      $("#shoppinglist li:not(:contains(" + needle + "))").css("display", "none");
    },

    "click ul li": function(evt) {
      $("nav ul li").removeClass("active");
      $(evt.target).addClass("active");
      // shoppinglist
      console.log($(evt.target).data("filter"));
      $("#shoppinglist").removeClass().addClass($(evt.target).data("filter"));
    }

  });












  Template.product.events({

    "change li label input[type~=checkbox]": function(event) {
      Products.update(this._id, {$set: {isNeeded: !this.isNeeded}});
    },

    "dragenter li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      //console.log('dragenter');
      $(event.target).addClass("drop_target");
    },

    "dragover li": function(event) {
      event.preventDefault();
      event.stopPropagation();
    },

    "dragleave li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('dragleave');
      $(event.target).removeClass("drop_target");
    },

    "drop li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if(event.originalEvent.dataTransfer){
        var uploads = event.originalEvent.dataTransfer.files;
          if(uploads.length) {
            for (var f in uploads) {
              if (uploads[f] instanceof File) {
                var ext = uploads[f].name.substr(uploads[f].name.lastIndexOf('.'));
                Meteor.saveFile(uploads[f], this._id + ext); 
                Products.update(this._id, {$set: {"image": this._id + ext }});
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
