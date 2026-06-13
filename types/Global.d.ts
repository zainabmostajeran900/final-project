interface IChildren {
  children: React.ReactNode | React.JSX.Element | React.JSX.Element[];
}
interface IReqGetData {
  page?: string;
  limit?: string;
  deliveryStatus?: boolean;
}

interface IReqGetById {
  id: string;
}
