import React, { useState, useEffect } from 'react';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location)
      }
    }
    fetch()
  }, [])
  return location
}
export default useLocation