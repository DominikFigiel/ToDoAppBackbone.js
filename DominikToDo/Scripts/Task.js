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
            Id: 0,
            Content: 'Unknown',
            Date: 'Unknown',
            IsDone: false
        },
        destroy: function (options) {
            console.log('/Tasks/delete/' + this.id);
            var opts = _.extend({ url: '/Tasks/delete/' + this.id }, options || {});
            return Backbone.Model.prototype.destroy.call(this, opts);
        },
        save:  function (attributes,  options)  {
            options = _.defaults((options || {}), { url:  "/Tasks/create/" });
            return  Backbone.Model.prototype.save.call(this,  attributes,  options);
          }
    });

    // Task Collection
    var TaskCollection = Backbone.Collection.extend({
        model: Task,
        url: '/Tasks/GetAll/'
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
            "click .Edit": 'EditTask',
            "click .Delete": 'DeleteTask'
        },
        EditTask: function () {
            this.model.set({ Date: 'Unknown' });
            var self = this;
            this.model.save(this.model, {
                success: function () {
                    $("input:button", $(self.el)).button();
                }
            });
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
            "click #btnCreateNew": "AddNewTask"
        },
        AddNewTask: function () {
            console.log('Add Task....');
            this.counter++;
            var newTask = new Task({ Id: this.counter, Content: 'Unknown ' + this.counter, Date: '1522101600000' + this.counter, IsDone: false});
            this.collection.add(newTask);
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
        }
    });

    var tasks = new TaskCollection();
    var view = new AppView({ collection: tasks });

    tasks.fetch({
        success: function () {
            //view.render();

        }
    });
});
