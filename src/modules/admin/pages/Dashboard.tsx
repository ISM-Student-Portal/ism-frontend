import { getDashboardStats } from '@app/services/admin/dashboardService';
import { ContentHeader } from '@components';
import { useEffect, useState } from 'react';
import { ColorRing } from 'react-loader-spinner';

interface Stats {
  students: number,
  classes: number,
  basicSub: number,
  premiumSub: number,
  paidStudent: number,
  partPaymentStudent: number
}

const Dashboard = () => {

  const [stats, setStats] = useState<Stats>();

  const getStats = async () => {
    try {
      let stats = await getDashboardStats();
      setStats(stats.stats);

    }
    catch (error: any) {
    }
  }

  useEffect(() => {
    getStats();
  }, []);
  return (
    <div>
      {stats ? (<div>
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

                    <p>Courses</p>
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
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-light">
                  <div className="inner">
                    <h3>{stats?.paidStudent}</h3>

                    <p>Students Paid</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-bag" />
                  </div>
                  <a href="/admin/payments" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-light">
                  <div className="inner">
                    <h3>{stats?.partPaymentStudent}</h3>

                    <p>Students Paid Part</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-bag" />
                  </div>
                  <a href="/admin/payments" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>
            </div>

            <div className="row">

            </div>
          </div>
        </section>
      </div>) : (
        <div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
          visible={true}
          height="150"
          width="150"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

        />Loading... Please wait </div>
      )}

    </div>
  );
};

export default Dashboard;
