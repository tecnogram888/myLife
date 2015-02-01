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
		var self = this,
			taskList = this.model.taskList;
		this.elements['taskList'].innerHTML = generateTR(true);
		$taskList = $(this.elements['taskList']);
		$taskList.append('<tbody>');
		for (property in taskList){
			$taskList.append(generateTR(false, property, new Date(taskList[property])));
		}
		$taskList.append('</tbody>');
		// $taskList.DataTable();

		$('#completeTask').on('click', function(e) {
			e.preventDefault();
			var selectedTasks = $('#taskList input:checked');
			for (i = 0; i < selectedTasks.length; i++)
			{
				var task = selectedTasks[i].dataset.task;
				self.model.taskList[task] = new Date();
				self.model.dataModel.put('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		})

		$('#deleteTask').on('click', function(e) {
			e.preventDefault();
			var selectedTasks = $('#taskList input:checked');
			for (i = 0; i < selectedTasks.length; i++)
			{
				var task = selectedTasks[i].dataset.task;
				delete self.model.taskList[task];
				self.model.dataModel.put('taskList', JSON.stringify(self.model.taskList));
				self.displayTaskList();
			}
		})

		function generateTR(genTitle, task, timeLastCompleted){
			if (genTitle)
			{
				return '<thead><tr>' + 
				'<th>' + 'Task' + '</th>' + 
				'<th>' + 'Completion Status' + '</th>' +
				'<th>' + '</th>' +
				'</tr></thead>';
			}

			var today = new Date();
			return '<tr>' + 
				'<td>' + task + '</td>' + 


				'<td' + (today.toDateString() == timeLastCompleted.toDateString() ? 
						' class="greenBG">Yes' : ' class="redBG">' + 

						(Math.floor((today - timeLastCompleted)/(24*60*60*1000)))

						+ ' days ago') + '</td>' +

				'<td><input type="checkbox" data-task="' + task + '"/></td>'
				'</tr>';
		}
	}
};

myLife.home.init();