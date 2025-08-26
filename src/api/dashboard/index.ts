import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';


export const getDashboard = {
  useQuery: (opt?: UseQueryOptions<DashboardType, Error>) => {
    return useQuery<DashboardType, Error>({
      queryKey: ['dashboard'],
      queryFn: async () => {
        const response = await axios.get(`/Dashboard/Dashboard`);
        return response.data.data; 
      },
      ...opt,
    });
  },
};
