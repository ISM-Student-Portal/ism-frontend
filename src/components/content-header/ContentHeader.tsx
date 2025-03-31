import { useSelector } from "react-redux";


const ContentHeader = ({ title }: { title: string }) => {
  const profile = useSelector((state: any) => state.profile.profile);
  

  return (
    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h3>{title}</h3>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href={profile.is_student? '/' : profile.is_admin ? '/admin' : '/lecturer'}>Home</a>
              </li>
              <li className="breadcrumb-item active">{title}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentHeader;
