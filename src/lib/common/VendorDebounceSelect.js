import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import {useEffect, useMemo, useRef, useState} from 'react';
import API from '../../service/Api';

export default function VendorDebounceSelect({
                                               debounceTimeout = 1000,
                                               mapper = (v) => ({value: v.id, label: v.name,title:v.workflowName}),
                                               url,
                                               selectedValue,
                                               type = '',
                                               params = {},
                                               searchParam = 'query',
                                               ...props
                                             }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const fetchOptions = useMemo(
    () => async (searchQuery) => {
      const {data} = await API.post(url, {
        [searchParam]: searchQuery,
        isActive: true,
        ...params,
      });

      return data.model.map(mapper);
    },
    [url, params]
  );

  const debounceFetcher = useMemo(() => {
    const {vendorType} = params;
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      setOptions([]);
      setFetching(true);

     if(vendorType){
       fetchOptions(value)
         .then((newOptions) => {
           if (fetchId !== fetchRef.current) {
             // for fetch callback order
             return;
           }
           setOptions(
             newOptions.length > 0
               ? newOptions
               : [{label: 'No Data Found', value: -1, disabled: true}]
           );
           setFetching(false);
         })
         .catch(() => {
           setOptions([{label: 'No Data Found', value: -1, disabled: true}]);
           setFetching(false);
         });
     }else {
       setOptions([{label: 'No Data Found', value: -1, disabled: true}])
     }
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    debounceFetcher();
  }, [params, debounceFetcher]);

  return (
    <>
      {type === 'multi' ? (
        <Select
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          {...props}
          options={options}
        />
      ) : (
        <Select
          labelInValue
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          {...props}
          options={options}
          value={selectedValue}
        />
      )}
    </>
  );
}
