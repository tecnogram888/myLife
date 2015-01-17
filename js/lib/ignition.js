// Implements the algorithm for loading modules

var ignition = {};

ignition.ignite = function(dataModel){
	var ignitionKey = dataModel.get('ignitionKey');
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

ignition.unpack = function(module){
};