(function(window) {
  'use strict';
  var FORM_SELECTOR = '[data-coffee-order="form"]';
  var CHECKLIST_SELECTOR = '[data-coffee-order="checklist"]';
  var SERVER_URL = 'http://coffeerun-v2-rest-api.herokuapp.com/api/coffeeorders';
  var App = window.App;
  var Truck = App.Truck;
  var RemoteDataStore = App.RemoteDataStore;
  var DataStore = App.DataStore;
  var FromHandler = App.FormHandler;
  var Validation = App.Validation;
  var CheckList = App.CheckList;
  var webshim = window.webshim;
  var ds = new RemoteDataStore(SERVER_URL);
  ds.checkAccess.then(function () {
    appBody(ds);
  }, function () {
    appBody(new DataStore());
  });
  
  function appBody(ds) {
    var myTruck = new Truck('DeLorean_DMC-12', ds);
    window.myTruck = myTruck;
    var checklist = new CheckList(CHECKLIST_SELECTOR);
    var formHandler = new FromHandler(FORM_SELECTOR);
    
    checklist.addClickHandler(myTruck.deliverOrder.bind(myTruck));

    formHandler.addSubmitHandler(function (data) {
      return myTruck.createOrder.call(myTruck, data)
        .then(function () {
          checklist.addRow.call(checklist, data);
        });
      
    });

    formHandler.addRangeHandler();

    formHandler.addInputHandler(Validation.isCompanyEmail);

    myTruck.printOrders(checklist.addRow.bind(checklist));
    
    webshim.polyfill('forms forms-ext');
    webshim.setOptions('forms', { addValidators: true, lazyCustomMessages: true });
  }
})(window);
