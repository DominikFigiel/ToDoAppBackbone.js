using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace DominikToDo
{
    public static class App
    {
        public static string ConnectionString { get { return ConfigurationManager
            .ConnectionStrings["TasksModel"].ConnectionString;
            } }
    }
}