import React, { useState, useEffect } from 'react';

import { Maps } from '../../services'

const useAddresses = (input: string) => {
  const [addresses, setAddresses] = useState([]);
  const fetch = async () => {
    if (input.length === 0)
      setAddresses([])
    else if (input.length >= 4) {
      const res = await Maps.getAddresses(input)
      setAddresses(res)
    }
  }
  useEffect(() => {
    fetch()
  }, [input])
  return addresses
}
export default useAddresses