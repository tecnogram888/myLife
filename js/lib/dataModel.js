// API for storing and getting data, so that frontend is isolated from implementation

var dataModel = {};

dataModel.put = function(key, value){
	localStorage.setItem(key, value);
};

dataModel.get = function(key){
	localStorage.getItem(key);
};