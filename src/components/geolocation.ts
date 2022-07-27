import { PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const requestLocationPermission = async () => {
  // if (PermissionsAndroid.RESULTS.GRANTED === 'granted') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Data Permission',
        message: 'This app needs to access to GPS property of this device.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // setTimeout(() => Alert.alert('Geolocation has been permitted'), 500);
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('Geolocation permission denied');
      return false;
    }
  } catch (err) {
    console.error('LocationPermission Error' + err);
    return false;
  }
};

type ResponseType = {
  status: string;
  lat: number;
  lng: number;
};

export function getCurrentLocation(): Promise<ResponseType> {
  return new Promise(async (reslove, reject) => {
    // permission condition for never ask again if it gotten.
    const hasLocationPermission: boolean = await requestLocationPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const result = {
            status: 'ok',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          reslove(result);
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    } else {
      reject(new Error('hasLocationPermission is false'));
    }
  });
}
