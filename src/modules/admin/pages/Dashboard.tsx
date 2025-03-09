import { getDashboardStats } from '@app/services/admin/dashboardService';
import { ContentHeader } from '@components';
import { useEffect, useState } from 'react';

interface Stats {
  students: number,
  classes: number,
  basicSub: number,
  premiumSub: number
}

const Dashboard = () => {

  const [stats, setStats] = useState <Stats>();

  const getStats = async () => {
    try{
    let stats = await getDashboardStats();
    setStats(stats.stats);

    }
    catch(error: any){
    }
  }

  useEffect(() => {
    getStats();
  }, []);
  return (
    <div>
      <ContentHeader title="Dashboard" />

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{stats?.students}</h3>

                  <p>Students</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
                <a href="/admin/students" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>
                    {stats?.classes}<sup style={{ fontSize: '20px' }}></sup>
                  </h3>

                  <p>Classes</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
                <a href="/admin/classroom" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{stats?.basicSub}</h3>

                  <p>Basic Subscription</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <a href="#" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{stats?.premiumSub}</h3>

                  <p>Premium</p>
                </div>
                <div className="icon">
                  <i className="ion ion-pie-graph" />
                </div>
                <a href="#" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
