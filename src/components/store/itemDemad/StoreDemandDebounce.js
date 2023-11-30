import {useEffect, useMemo, useRef, useState} from "react";
import API from "../../../service/Api";
import debounce from "lodash/debounce";
import {Select, Spin} from "antd";

export default function StoreDemandDebounce({
                                         debounceTimeout = 1000,
                                         mapper = (v) => ({value: v.id, label: v.name}),
                                         url,
                                         selectedValue,
                                         type = '',
                                         params = {},
                                         searchParam = 'query',
                                         filter,
                                         ...props
                                       }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  console.log("partId",filter)

  const fetchOptions = useMemo(
    () => async (searchQuery) => {
      const {data} = await API.post(url, {
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
              : [{label: 'No Data Found', value: -1, disabled: true}]
          );
          setFetching(false);
        })
        .catch(() => {
          setOptions([{label: 'No Data Found', value: -1, disabled: true}]);
          setFetching(false);
        });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    debounceFetcher();
  }, [filter]);

  return (
    <>
      {type === 'multi' ? (
        <Select
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          {...props}
          options={options.filter(item => item.value !== filter)}
        />
      ) : (
        <Select
          labelInValue
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          {...props}
          options={options.filter(item => item.value !== filter)}
          value={selectedValue}
        />
      )}
    </>
  );
}