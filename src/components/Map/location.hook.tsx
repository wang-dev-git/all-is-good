import { useState, useEffect } from 'react';

import * as Location from 'expo-location';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync()
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