// Grocery products
Products = new Mongo.Collection("products");
Ailes = new Mongo.Collection("ailes");
// Stores = new Mongo.Collection("stores");



if (Meteor.isClient) {



  Template.body.helpers({
    selected_product: function() {
      var product = Products.findOne(Session.get("selected_product"));
      return product;
    }
  });






  Template.shopping_list.helpers({
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
      // console.log(evt.target.value);
      var needle = evt.target.value;

      // filter Product
      $("#shoppinglist li").css("display", "block");
      $("#shoppinglist li:not(:contains(" + needle + "))").css("display", "none");
    },

    "search .new_product": function(evt) {
      // get the needle
      // console.log(evt.target.value);
      var needle = evt.target.value;

      // filter Product
      $("#shoppinglist li").css("display", "block");
      $("#shoppinglist li:not(:contains(" + needle + "))").css("display", "none");
    },

    "click ul li": function(evt) {
      $("nav ul li").removeClass("active");
      $(evt.target).addClass("active");
      // shoppinglist
      // console.log($(evt.target).data("filter"));
      $("#shoppinglist").removeClass().addClass($(evt.target).data("filter"));
    }

  });





  


  Template.product.events({

    "click li": function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if (event.altKey) {
        Session.set("selected_product", this._id);
        // console.log("show selected product details");
      } else {
        Products.update(this._id, {$set: {isNeeded: !this.isNeeded}});
      }
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



  Template.detail.helpers({
    selected_product: function() {
      var product = Products.findOne(Session.get("selected_product"));
      return product;
    },

    ailes: function() {
      // var product = Session.get("selected_product");

      var ailes = Ailes.find({}, {sort: {name: 1}});

      return ailes;
    },

    inaile: function() {
      var product = Products.findOne(Session.get("selected_product"));
      return (product.aile && product.aile==this.name) ? "checked" : '';
    }
  });


  Template.detail.events({
    "click #close_button": function(evt) {
      Session.set("selected_product", null);
    },

    "click #delete_button": function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      Products.remove(Session.get("selected_product"));
      Session.set("selected_product", null);
    },

    
    "submit form": function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var product_id = Session.get("selected_product");
      var new_name = evt.target.name.value;
      var new_aile = $("#detail form input[name=aile]:checked").val();

      Products.update(product_id, {$set: {name: new_name, aile: new_aile}});

      Session.set("selected_product", null);

      // upload file
      var uploads = $(evt.currentTarget).find("input[type=file]")[0].files;
      for (var f in uploads) {
        if (uploads[f] instanceof File) {
          var ext = uploads[f].name.substr(uploads[f].name.lastIndexOf('.'));
          Meteor.saveFile(uploads[f], product_id + ext);
          Products.update(product_id, {$set: {"image": product_id  + ext }});
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
