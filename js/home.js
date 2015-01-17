var myLife = {}

myLife.home = {
	elements: {},
	model: {dataModel: dataModel},

	init: function(){
		this.initElements();
		this.loadData();
		this.bindEvents();
		this.displayTaskList();
	},

	initElements: function(){
		this.elements['createTask'] = document.getElementById('createTask');
		this.elements['taskList'] = document.getElementById('taskList');
		this.elements['newTask'] = document.getElementById('newTask');
	},

	loadData: function(){
		var taskList = localStorage.getItem('taskList');
		if (taskList){
			taskList = JSON.parse(taskList);
		}
		else{
			taskList = {};
		}
		this.model.taskList = taskList;
	},

	bindEvents: function(){
		var self = this;

		$(this.elements['newTask']).on('keypress', function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode == 13){
				event.preventDefault();
				self.model.taskList[this.value] = new Date();
				self.model.dataModel.put('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		});
	},

	displayTaskList: function(){
		this.elements['taskList'].innerHTML = ''
		for (property in this.model.taskList){
			var tn = document.createTextNode(property + ' last completed');
			var p = document.createElement('p');
			p.appendChild(tn);
			this.elements['taskList'].appendChild(p);
		}
	}
};

myLife.home.init();