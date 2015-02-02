/**
	* Implements the algorithm for loading modules
	* 
	* ignite(dataModel) unpacks all modules from the dataModel
 	*/

var ignition = function(dataModel){
	this.dataModel = dataModel;
};

ignition.prototype.ignite = function(dataModel){
	this.ignitionKey = dataModel.get('ignitionKey');
	if (!ignitionKey)
	{
		return;
	}

	for (key in ignitionKey)
	{
		var val = ignitionKey[key];
		this.unpack(val);
	}
};

ignition.prototype.pack = function(moduleName){
	var ignitionKey = this.ignitionKey ? this.ignitionKey : datamodel.get('ignitionKey');
}

ignition.prototype.unpack = function(moduleName){
	
};
