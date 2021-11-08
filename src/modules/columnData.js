import { Sparklines, SparklinesLine } from 'react-sparklines';

export const userColumns = [
    {
      title: "Currency",
      dataIndex: "name",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ['ascend' | 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: "Trend",
      render: (data) => {
        return (
        <Sparklines data={data.amounts} width={100} height={20} margin={5}>
            <SparklinesLine color="blue" />
        </Sparklines>
        )
      }
    },
  ];
  