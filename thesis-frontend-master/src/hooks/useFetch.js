import { useEffect, useState } from "react";

import { axiosPrivate } from "../api/axios";

// Custom hook for fetching data
function useFetch(url, id, refetch) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (refetch) {
      if (id === -1) {
        setLoading(true);
        const fetchData = async () => {
          try {
            const response = await axiosPrivate
              .get(url)
              .finally(() => setLoading(false));
            setData(response.data);
          } catch (err) {
            setError(err);
          }
        };
        fetchData();
      } else {
        const fetchData = async () => {
          try {
            const response = await axiosPrivate
              .get(`${url}/${id}`)
              .finally(() => setLoading(false));
            setData(response.data);
          } catch (err) {
            setError(err);
          }
        };

        if (id) {
          setLoading(true);
          fetchData();
        }
      }
    }
  }, [url, id, refetch]);

  return { data, loading, error };
}

export default useFetch;
