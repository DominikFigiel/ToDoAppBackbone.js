using DominikToDo.Models;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DominikToDo.DataAccess
{
    public class TaskMapping : ClassMap<Task>
    {
        public TaskMapping()
        {
            Table("Tasks");

            Id(x => x.Id)
                .Column("Id")
                .CustomType<int>()
                .GeneratedBy.Identity();

            Map(x => x.Content)
                .Column("Content")
                .CustomType<String>();

            Map(x => x.Date)
                .Column("Date")
                .CustomType<DateTime>();

            Map(x => x.IsDone)
                .Column("IsDone")
                .CustomType<bool>();

        }
    }
}