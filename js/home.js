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
		this.elements['taskList'] = document.getElementById('taskList');
		this.elements['createTask'] = document.getElementById('createTask');
		this.elements['completeTask'] = document.getElementById('completeTask');
		this.elements['deleteTask'] = document.getElementById('deleteTask');
		this.elements['taskFilter'] = document.getElementById('taskFilter');
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

		$(this.elements['createTask']).on('keypress', function(event){
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

		$(this.elements['completeTask']).on('click', function(e) {
			e.preventDefault();
			var selectedTasks = $('#taskList input:checked');
			for (i = 0; i < selectedTasks.length; i++)
			{
				var taskId = self.getTRID(selectedTasks[i].parentElement);
				var task = self.model.taskList[taskId];
				self.completeTask(task);
				localStorage.setItem('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		})

		$(this.elements['deleteTask']).on('click', function(e) {
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

		$(this.elements['taskFilter']).on('keypress', function(event) {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode == 13){
				event.preventDefault();
				self.displayTaskList(this.value);
			}
		});
	},

	displayTaskList: function(categoryFilter){
		var self = this,
			taskList = this.model.taskList;
		taskList = filterTaskList(taskList, categoryFilter);
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
				generateCWF(true, task) +
				'<th>' + '</th>' +
				'</tr></thead>';
			}

			var today = new Date();
			var tr = '<tr>' + 
				'<td data-id="' + task.id + '">' + task.name + '</td>';
			var completeTime = self.getCompleteTime(task)
			if (completeTime){
				completeTime = new Date(completeTime);
				var daysAgo = self.getDaysAgo(today, completeTime);
				tr += '<td class="' + ((daysAgo <= self.getFrequency(task)) ? 'greenBG' : 'redBG') + '">'
					+ self.getDaysAgo(today, completeTime) + ' days ago' + '</td>';
			}
			else
			{
				tr += '<td class="redBG">Incomplete</td>';
			}
			tr += '<td>' + '<input type="text" value="' + self.getFrequency(task) + '"/>' + '</td>'
			tr += generateCWF(false, task);
			tr += '<td><input type="checkbox"/></td>' + '</tr>';
			return tr;
		}

		// completions within frequency
		function generateCWF(genTitle, task){
			if (genTitle)
			{
				return '<th>' + 'Completions within Frequency' + '</th>';
			}

			var count = 0;
			var today = new Date();
			var freq = self.getFrequency(task);
			for (i in task.completeTimes)
			{
				var completeTime = new Date(task.completeTimes[i]);
				if (self.getDaysAgo(today, completeTime) < freq)
				{
					count++;
				}
			}

			return '<td>' + count + '</td>'
		}

		function filterTaskList(taskList, categoryFilter){
			if (!categoryFilter)
			{
				return taskList;
			}
			var task;
			var filteredTaskList = [];
			for (property in taskList)
			{
				task = taskList[property];
				if (task.category && task.category.indexOf(categoryFilter) > 0)
				{
					filteredTaskList.push(task);
				}
			}
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
			self.setFrequency(task, freq);
			localStorage.setItem('taskList', JSON.stringify(self.model.taskList));
			self.displayTaskList();
		});

		$('td[data-id]').on('click', function(e) {
			var id = this.dataset.id;
			self.displayTaskHistory(id);
		})
	},

	displayTaskHistory: function(id)
	{
		var task = this.model.taskList[id];
		console.log(task)
		// TODO
		// times of last completion (for editing?)
		// 
	},

	// Helpers

	// TASK =========
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
		task.completeTimes = [];
		// task.completeByTime = 0;
		return task;
	},

	getCompleteTime: function(task){
		var completeTimes = task.completeTimes;
		var nTimes = completeTimes.length;
		if (nTimes)
		{
			return completeTimes[nTimes-1];
		}
		else
		{
			return 0;
		}
	},

	completeTask: function(task){
		task.completeTimes.push(new Date());
	},

	// TD =================
	getTRID: function(td) {
		return td.parentElement.firstChild.dataset.id;
	},

	getDaysAgo: function(today, time) {
		if (today.toLocaleDateString() == time.toLocaleDateString())
		{
			return 0;
		}
		else
		{
			return (Math.floor((today - time)/(24*60*60*1000))) + 1;
		}
	},

	setFrequency: function(task, freq) {
		task.frequency = freq;
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