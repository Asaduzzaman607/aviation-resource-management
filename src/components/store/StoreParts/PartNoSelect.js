import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import {useEffect, useMemo, useRef, useState} from 'react';
import API from '../../../service/Api';
import {CONSUMABLE} from "./constants";

export default function PartNoSelect({
                                         debounceTimeout = 1000,
                                         mapper = (v) => ({value: v.id, label: v.name}),
                                         url,
                                         selectedValue,
                                         type = '',
                                         params = {},
                                         searchParam = 'query',
                                         debounceVal,
                                         ...props
                                       }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);

  const { disabled } = props;

  const fetchOptions = useMemo(() => async (searchQuery) => {

    const { partClassification, acType} = params;
    if (!partClassification) return [];
    if (!acType && partClassification !== CONSUMABLE) return;

    const {data} = await API.post(url, {
      [searchParam]: searchQuery, isActive: true, ...params,
    });

    return data.model.map(mapper);
  }, [searchParam, params, url, mapper]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    if (disabled) return;

    const { partClassification, acType} = params;
    // if (!partClassification) return;
    //
    // if (partClassification === CONSUMABLE) {
    //   debounceFetcher();
    // }
    //
    // if (!partClassification && !acType) return;
    //
    debounceFetcher();

  }, [params, debounceFetcher, disabled]);

  return (<>
      {type === 'multi' ? (<Select
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          {...props}
          options={options}
        />) : (<Select
          labelInValue
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          {...props}
          options={options}
          value={selectedValue}
        />)}
    </>);
}
