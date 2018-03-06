using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DominikToDo.DataAccess
{
    public class NhSessionDb
    {
       public ISessionFactory Session { get; set; }

        public NhSessionDb(string connectionString)
        {
            OpenSession(connectionString);
        }

        public void OpenSession(string connectionString)
        {
            Session = Fluently.Configure()
                .Database(MsSqlConfiguration.MsSql2008
                    .ConnectionString(connectionString)
                    .FormatSql())
                //.ShowSql())
                .Mappings(m =>
                    m.FluentMappings
                        .AddFromAssemblyOf<TaskMapping>())
                .ExposeConfiguration(cfg =>
                {
                    new SchemaExport(cfg).Create(false, false);
                    cfg.SetProperty("command_timeout", "500");
                })
                .BuildSessionFactory();
        }


        public ISession Read()
        {
            var session = Session.OpenSession();
            session.FlushMode = FlushMode.Never;
            session.DefaultReadOnly = true;

            return session;
        }

        public ISession ReadAndWrite()
        {
            var session = Session.OpenSession();
            session.FlushMode = FlushMode.Commit;
            session.DefaultReadOnly = false;

            return session;
        }

    }

}
