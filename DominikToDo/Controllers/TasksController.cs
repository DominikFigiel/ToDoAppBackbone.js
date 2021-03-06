﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DominikToDo.DataAccess;
using DominikToDo.Models;
using DominikToDo.Services;
using DominikToDo.Utils;
using DominikToDo.ViewModels;

namespace DominikToDo.Controllers
{
    public class TasksController : Controller
    {
        private TasksService tasksService;
        public TasksController()
        {
            var nhSessionDb = new NhSessionDb(App.ConnectionString);

            tasksService = new TasksService(nhSessionDb);
        }

        // GET: Tasks
        public ActionResult Index()
        {
            return View();
        }

        // Get Tasks
        //[AcceptVerbs(HttpVerbs.Get)]
        [HttpGet]
        public ActionResult GetAll()
        {
            return Json(tasksService.GetAll(), JsonRequestBehavior.AllowGet);
        }

        // POST: Task/Create
        [HttpPost]
        public ActionResult Create(TaskViewModel model)
        {
            try
            {
                // TODO: Add insert logic here
                var task = model.ToModel();
                var newTask = tasksService.Add(task);

                return Json(newTask, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Tasks/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
                var task = tasksService.Get(id);

                task.Content = collection["Content"];
                task.Date = Convert.ToDateTime(collection["Date"]);
                if (collection["IsDone"].Equals("false"))
                    task.IsDone = false;
                else
                    task.IsDone = true;

                var newTask = tasksService.Add(task);

                return Json(newTask, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult Delete(int? id)
        {
            try
            {
                // TODO: Add insert logic here
                if (id.HasValue)
                {
                    var task = tasksService.Get(id.Value);
                    tasksService.Delete(task);
                }

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

    }
}