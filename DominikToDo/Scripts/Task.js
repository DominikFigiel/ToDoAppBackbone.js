$(function () {

    // Task Model
    var Task = Backbone.Model.extend({
        idAttribute: "Id",
        url: function () {
            var base = '/Tasks';
            if (this.isNew())
                return base;
            return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
        },
        initialize: function () {
            console.log('Task Constructor Triggered');
        },
        defaults: {
            Id: null,
            Content: 'Unknown',
            Date: 'Unknown',
            IsDone: false
        },
        destroy: function (options) {
            console.log('/Tasks/delete/' + this.id);
            var opts = _.extend({ url: '/Tasks/delete/' + this.id }, options || {});
            return Backbone.Model.prototype.destroy.call(this, opts);
        },
        save: function () {
            var model = this;

            $.ajax({
                url: '/Tasks/Create',
                type: 'POST',
                data: model.toJSON(),
                success: function (data) {
                    model.set('Id', data.Id);
                }
            });
        },
        validate: function (attributes) {
            var errors = [];
            if (!attributes.Content) {
                errors.push({ name: 'Content', message: 'Wpisz treść zadania.' });
            }
            if (!attributes.Date) {
                errors.push({ name: 'Date', message: 'Wybierz datę.' });
            }
            else {
                var myDate = Date.parse(attributes.Date);
                var myDateFormatted = moment(myDate).format('YYYYMMDD');

                var now = new Date();
                var nowFormatted = moment(now).format('YYYYMMDD');

                if (myDateFormatted < nowFormatted)
                {
                    errors.push({ name: 'Date', message: 'Wybrana data nie może być datą z przeszłości.' });
                }
            }

            if (errors.length > 0)
            {
                $(".task-validation-error").empty();
                $(".task-validation-error").removeClass('hidden');
                for (var key in errors) {
                    $(".task-validation-error").append("<p><strong>" + (parseInt(key) + 1) + ":</strong> " + errors[key].message + "</p>");
                }
            }

            return errors.length > 0 ? errors : false;
        }
    });

    // Task Collection
    var TaskCollection = Backbone.Collection.extend({
        model: Task,
        url: '/Tasks/GetAll/',
        initialize: function () {
            this.bind("reset", function (model, options) {
                console.log("Inside event");
                console.log(model);
            });
            this.fetch();
        }
    });

    // Task View - el returns the template enclosed within a tr
    var TaskView = Backbone.View.extend({
        template: _.template($('#Task-Template').html()),
        tagName: "tr",
        initialize: function () {
            console.log('TaskView Constructor Triggered');
            this.model.bind('change', this.render, this);
            this.model.bind('remove', this.unrender, this);
        },
        render: function () {
            console.log('Rendering...');
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        unrender: function () {
            console.log('Un-Rendering...');
            $(this.el).remove();
            return this;
        },
        events: {
            "click .TaskEdit": 'EditTask',
            "click .Delete": 'DeleteTask'
        },
        EditTask: function () {
            var model = this;
            var data = this.model.toJSON();
            console.log(moment(data.Date).toDate());

            var now = moment(data.Date).toDate();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);

            var today = (now.getFullYear() + '-' + month + '-' + day);

            $(".modal-body #editTaskIdInput").val(data.Id);
            $(".modal-body #editTaskContentInput").val(data.Content);
            $(".modal-body #editTaskDateInput").val(today);

            var id = data.Id;
            if (data.IsDone == true) {
                $('#editTaskIsDoneInput')[0].checked = true;
                $('#task-' + id + '-checkbox')[0].checked = true;
            }

            else
            {
                $('#editTaskIsDoneInput')[0].checked = false;
                $('#task-' + id + '-checkbox')[0].checked = false;
            }
               
        },
        DeleteTask: function () {
            this.model.destroy();
        }
    });

    // Actual App view
    var AppView = Backbone.View.extend({
        initialize: function () {
            this.collection.bind('add', this.AppendTask, this);
        },
        el: '#Task_Container',
        counter: 20  ,
        events: {
            "click #btnCreateNew": "AddNewTask",
            "click #SaveChanges": "EditExistingTask",
            "input #searchInput": "Search"
        },
        AddNewTask: function () {

            console.log('Add Task....');
            this.counter++;
            var newTask = new Task({ Content: $('#newTaskContentInput').val(), Date: $('#newTaskDateInput').val(), IsDone: false });

            if (!newTask.isValid()) {
                console.log("Pola nie zostały wypełnione prawidłowo.");
                return; //Do not save
            } else {
                this.collection.add(newTask);
                newTask.save();   //write the save logic here
                this.unrender();
                this.render();

                $('#taskModal').modal('toggle');
            }

        },
        EditExistingTask: function () {
            var model = this.collection.get($('#editTaskIdInput').val());

            var newTask = new Task();

            newTask.set('Id', $('#editTaskIdInput').val() );
            newTask.set('Content', $('#editTaskContentInput').val());
            newTask.set('Date', $('#editTaskDateInput').val());

            if ($('#editTaskIsDoneInput')[0].checked == true)
                newTask.set('IsDone', true);
            else
                newTask.set('IsDone', false);

            if (!newTask.isValid()) {
                console.log("Pola nie zostały wypełnione prawidłowo.");
                return; //Do not save
            } else {
                var newTaskJSON = newTask.toJSON();

                model.set('Content', newTaskJSON.Content);
                model.set('Date', newTaskJSON.Date);
                model.set('IsDone', newTaskJSON.IsDone);

                $.ajax({
                    url: '/Tasks/Edit/' + newTask.toJSON().Id,
                    type: 'POST',
                    data: newTask.toJSON(),
                    success: function (data) {
                        console.log(data);
                    }
                });

                $(".task-validation-error").empty();
                $(".task-validation-error").addClass('hidden');
                $('#taskEditModal').modal('toggle');

            }

        },
        AppendTask: function (task) {
            var taskView = new TaskView({ model: task });
            $(this.el).find('table').append(taskView.render().el);
        },
        render: function () {
            if (this.collection.length > 0) {
                this.collection.each(this.AppendTask, this);
            }
            $("input:button", "#Task_List").button();
        },
        unrender: function () {
            $(this.el).find('table td').remove();
        },
        Search: function () {
            var search = $('#searchInput').val().toLowerCase();
            var lista = this.collection.filter(function (model) {
                var content = model.get('Content').toLowerCase();
                if (content.indexOf(search) > -1) {
                    return model;
                }
            });
            this.unrender();
            this.collection = new TaskCollection(lista);
            this.render();
        }
    });

    var tasks = new TaskCollection();


    var view = new AppView({ collection: tasks });
    
});

