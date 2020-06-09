import React, { useState, useEffect } from 'react';

import { Maps } from '../../services'

const useAddresses = (input: string) => {
  const [addresses, setAddresses] = useState([]);
  const fetch = async () => {
    if (input.length === 0)
      setAddresses([])
    else if (input.length >= 4) {
      const arr: any[] = []
      const res = await Maps.getAddresses(input)
      for (const addr of res) {
        const full_addr = await Maps.getAddress(addr.geometry.location.lat, addr.geometry.location.lng)
        if (full_addr.length)
          arr.push(full_addr[0])
      }
      setAddresses(arr)
    }
  }
  useEffect(() => {
    fetch()
  }, [input])
  const clearAddresses = () => setAddresses([])
  return { addresses, clearAddresses } 
}
export default useAddresses