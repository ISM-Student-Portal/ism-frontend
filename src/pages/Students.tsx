import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'

const Students = () => {
  const columns = [
    {name: 'Name', selector: (row:any) => row.name},
  ];
  const data = [
    {
      name: "Ommodamola"
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
