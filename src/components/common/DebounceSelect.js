import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import API from '../../service/Api';

export default function DebounceSelect({
  debounceTimeout = 1000,
  mapper = (v) => ({ value: v.id, label: v.name }),
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

  //console.log("searchParams",searchParam)
  //console.log({params})

  const fetchOptions = useMemo(
    () => async (searchQuery) => {
      const { data } = await API.post(url, {
        [searchParam]: searchQuery,
        isActive: true,
        ...params,
      });

      return data.model.map(mapper);
    },
    [url]
  );

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      setOptions([]);
      setFetching(true);

      fetchOptions(value)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          setOptions(
            newOptions.length > 0
              ? newOptions
              : [{ label: 'No Data Found', value: -1, disabled: true }]
          );
          setFetching(false);
        })
        .catch(() => {
          setOptions([{ label: 'No Data Found', value: -1, disabled: true }]);
          setFetching(false);
        });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    debounceFetcher();
  }, [params.id, params.partType, params.partId]);

  return (
    <>
      {type === 'multi' ? (
        <Select
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small" /> : null}
          {...props}
          options={options}
        />
      ) : (
        <Select
          labelInValue
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small" /> : null}
          {...props}
          options={options}
          value={selectedValue}
        />
      )}
    </>
  );
}
