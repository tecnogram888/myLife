/**
	* Requires a dataModel to be loaded prior to this file being loaded
	*/

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
				// check for duplicate
				var task = self.createTask(this.value);
				self.model.taskList[task.id] = task;
				localStorage.setItem('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		});

		$('#completeTask').on('click', function(e) {
			e.preventDefault();
			var selectedTasks = $('#taskList input:checked');
			for (i = 0; i < selectedTasks.length; i++)
			{
				var taskId = self.getTRID(selectedTasks[i].parentElement);
				var task = self.model.taskList[taskId];
				task.completeTime = new Date();
				localStorage.setItem('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		})

		$('#deleteTask').on('click', function(e) {
			e.preventDefault();
			var selectedTasks = $('#taskList input:checked');
			for (i = 0; i < selectedTasks.length; i++)
			{
				var taskId = self.getTRID(selectedTasks[i].parentElement);
				delete self.model.taskList[taskId];
				localStorage.setItem('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		})
	},

	displayTaskList: function(){
		var self = this,
			taskList = this.model.taskList;
		this.elements['taskList'].innerHTML = generateTR(true);
		$taskList = $(this.elements['taskList']);
		$taskList.append('<tbody>');
		for (property in taskList){
			$taskList.append(generateTR(false, taskList[property]));
		}
		$taskList.append('</tbody>');
		// $taskList.DataTable();
		self.bindTaskListEvents();

		// ========== TR API ===============================
		function generateTR(genTitle, task){
			if (genTitle)
			{
				return '<thead><tr>' + 
				'<th>' + 'Task' + '</th>' + 
				'<th>' + 'Completion Status' + '</th>' +
				'<th>' + 'Frequency' + '</th>' +
				'<th>' + '</th>' +
				'</tr></thead>';
			}

			var today = new Date();
			var tr = '<tr>' + 
				'<td data-id="' + task.id + '">' + task.name + '</td>';
			if (task.completeTime){
				var completeTime = new Date(task.completeTime);
				var daysAgo = self.getDaysAgo(today, completeTime);
				tr += '<td class="' + ((daysAgo <= self.getFrequency(task)) ? 'greenBG' : 'redBG') + '">'
					+ self.getDaysAgo(today, completeTime) + ' days ago' + '</td>';
			}
			else
			{
				tr += '<td class="redBG">Incomplete</td>';
			}
			tr += '<td>' + '<input type="text" value="' + self.getFrequency(task) + '"/>' + '</td>'
			tr += '<td><input type="checkbox"/></td>' + '</tr>';
			return tr;
		}
	},

	bindTaskListEvents: function(){
		var self = this;

		$('#taskList input[type="text"]').on('keyup', function(e) {
			$input = $(e.currentTarget);
			var freq = $input.val();
			var id = self.getTRID(e.currentTarget.parentElement);
			// Save the frequency
			var task = self.model.taskList[id];
			task.frequency = freq;
			localStorage.setItem('taskList', JSON.stringify(self.model.taskList));
			self.displayTaskList();
		});
	},

	// Helpers

	createTask: function(taskName){
		var self = this,
		task = {};
		var idCounter = localStorage.getItem('taskId');
		if (idCounter)
		{
			task.id = parseInt(idCounter) + 1;
			localStorage.setItem('taskId', task.id);
		}
		else
		{
			task.id = 1;
			localStorage.setItem('taskId', 1);
		}
		task.name = taskName;
		// task.createTime = new Date();
		task.completeTime = 0;
		// task.completeByTime = 0;
		return task;
	},

	getTRID: function(td) {
		return td.parentElement.firstChild.dataset.id;
	},

	getDaysAgo: function(today, time) {
		return (Math.floor((today - time)/(24*60*60*1000))) + 1;
	},

	getFrequency: function(task) {
		switch(task.frequency) {
			case 'w':
				return 'monthly';

			case 'w':
				return 'weekly';

			default:
				return task.frequency;
		}
	}
};

myLife.home.init();