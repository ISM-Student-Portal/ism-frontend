import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'

const Students = () => {
  const columns = [
    {name: 'First Name', selector: (row:any) => row.first_name},
    {name: 'Last Name', selector: (row:any) => row.last_name},
  ];
  const data = [
    {
      first_name: "Ommodamola",
      last_name: "Oladeji"
    },
    {
      name: "Gbemisola"
    }
  ];
  return (
    <div>
      <ContentHeader title="Students" />
      <section className="content">
        <div className="container-fluid">
          <DataTable columns={columns} data={data} />          
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Students;
