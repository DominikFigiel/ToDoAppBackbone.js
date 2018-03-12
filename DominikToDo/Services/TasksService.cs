using DominikToDo.DataAccess;
using DominikToDo.Models;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DominikToDo.Services
{
    public class TasksService
    {
        private readonly NhSessionDb _nhSessionDb;

        public TasksService(NhSessionDb nhSessionDb)
        {
            _nhSessionDb = nhSessionDb;
        }

        public Task Add(Task task)
        {
            using (var session = _nhSessionDb.ReadAndWrite())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var _taskRepository = new TaskRepository(session);
                    var newTask = _taskRepository.SaveOrUpdate(task);
                    transaction.Commit();
                    return newTask;
                }
                    
            }
        }

        public void Delete(Task task)
        {
            using (var session = _nhSessionDb.ReadAndWrite())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var _taskRepository = new TaskRepository(session);
                    _taskRepository.Delete(task);
                    transaction.Commit();
                }

            }
        }

        public void Edit(Task task)
        {
            using (var session = _nhSessionDb.ReadAndWrite())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var _taskRepository = new TaskRepository(session);
                    var existingTask = _taskRepository.Get(task.Id);
                    _taskRepository.Delete(task);
                    transaction.Commit();
                }

            }
        }

        public Task Get(int id)
        {
            using (var session = _nhSessionDb.Read())
            {
                var _taskRepository = new TaskRepository(session);
                return _taskRepository.Get(id);
            }
        }

        public IEnumerable<Task> GetAll()
        {
            using (var session = _nhSessionDb.Read())
            {
                var _taskRepository = new TaskRepository(session);
                return _taskRepository.GetAll();
            }
        }

        public IEnumerable<Task> GetAllBy(DateTime date)
        {
            using (var session = _nhSessionDb.Read())
            {
                var _taskRepository = new TaskRepository(session);
                return _taskRepository.GetAllBy(date);
            }
        }

        public IEnumerable<Task> GetAllByText(string text)
        {
            using (var session = _nhSessionDb.Read())
            {
                var _taskRepository = new TaskRepository(session);
                return _taskRepository.GetAllByText(text);
            }
        }

        public IEnumerable<Task> GetAllByStatus(string text)
        {
            using (var session = _nhSessionDb.Read())
            {
                var _taskRepository = new TaskRepository(session);
                return _taskRepository.GetAllByStatus(text);
            }
        }

        public Task GetOneById(int id)
        {
            using (var session = _nhSessionDb.Read())
            {
                var _taskRepository = new TaskRepository(session);
                return _taskRepository.Get(id);
            }
        }

    }
}