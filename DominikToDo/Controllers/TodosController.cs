using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using DominikToDo.DataAccess;
using DominikToDo.Models;
using DominikToDo.Services;

namespace DominikToDo.Controllers.Apis
{
    public class TodosController : ApiController
    {
        private TasksService tasksService;

        public TodosController()
        {
            var nhSessionDb = new NhSessionDb(App.ConnectionString);

            tasksService = new TasksService(nhSessionDb);
        }

        // GET api/Default1 
        public IEnumerable<Task> GetTodoes()
        {
            return tasksService.GetAll();
        }

        // GET api/Default1/5 
        public Task GetTodo(int id)
        {
            Task todo = tasksService.Get(id);
            if (todo == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return todo;
        }

        // PUT api/Default1/5 
        public HttpResponseMessage PutTodo(int id, Task todo)
        {
            if (ModelState.IsValid && id == todo.Id)
            {

                try
                {
                    tasksService.Add(todo);
                }
                catch (DbUpdateConcurrencyException)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // POST api/Default1 
        public HttpResponseMessage PostTodo(Task todo)
        {
            if (ModelState.IsValid)
            {
                tasksService.Add(todo);

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, todo);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = todo.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Default1/5 
        public HttpResponseMessage DeleteTodo(int id)
        {
            Task todo = tasksService.Get(id);
            if (todo == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            try
            {
                tasksService.Delete(todo);
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, todo);
        }

        protected override void Dispose(bool disposing)
        {
            //db.Dispose();
            base.Dispose(disposing);
        }
    }
}