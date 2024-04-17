import { getDashboardStats } from '@app/services/student/dashboardService';
import { ContentHeader } from '@components';
import { useEffect, useState } from 'react';

interface Stats {
  total_assignment: number,
  classes: number,
  assign_sub: number,
}

const StudentDashboard = () => {

  const [stats, setStats] = useState<Stats>();

  const getStats = async () => {
    try {
      let stats = await getDashboardStats();
      setStats(stats.stats);

    }
    catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStats();
  }, []);
  return (
    <div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{stats?.total_assignment}</h3>

                  <p>Total Assignments</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
                <a href="/assignments" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>
                    {stats?.classes}<sup style={{ fontSize: '20px' }}></sup>
                  </h3>

                  <p>Classes Available</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
                <a href="/classroom" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{stats?.assign_sub}</h3>

                  <p>Assignments Completed</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <a href="/" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div>
            {/* <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{stats?.premiumSub}</h3>

                  <p>Premium</p>
                </div>
                <div className="icon">
                  <i className="ion ion-pie-graph" />
                </div>
                <a href="/" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
