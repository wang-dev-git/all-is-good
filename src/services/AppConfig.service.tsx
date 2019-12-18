import Constants from 'expo-constants'

type Environment = {
  stripeAPIKey: string;
  firebaseOptions: any;
}

type Environments = {
  dev: Environment,
  prod: Environment;
}

export default class AppConfig {

  /**
   * Fixed app config
   */

  // Default tab for the main Tab Bar
  static defaultTab: number = 0;

  // Facebook ID
  static facebookId: string = '2609459805809503'

  // IsClothing Application fee (Percentage)
  static applicationFee: number = 0.10

  /**
   * Environment related configuration
   */

  static envs: Environments = {
    // Development configuration
    dev: {
      stripeAPIKey: 'pk_test_ZqfQqyALkPrkNMasg3kwvFE5',
      firebaseOptions: {
        apiKey: "AIzaSyBXkiqx8Q3OgS1HlGYMfknFcZj8y8topKU",
        authDomain: "all-is-good-dev.firebaseapp.com",
        databaseURL: "https://all-is-good-dev.firebaseio.com",
        projectId: "all-is-good-dev",
        storageBucket: "all-is-good-dev.appspot.com",
        messagingSenderId: "467075255307",
        appId: "1:467075255307:web:c31e6277e1d9dcfb460b0e",
        measurementId: "G-P5QKKZXYZY"
      },
    },
    // Production configuration
    prod: {
      stripeAPIKey: '',
      firebaseOptions: {
        apiKey: "AIzaSyBXkiqx8Q3OgS1HlGYMfknFcZj8y8topKU",
        authDomain: "all-is-good-dev.firebaseapp.com",
        databaseURL: "https://all-is-good-dev.firebaseio.com",
        projectId: "all-is-good-dev",
        storageBucket: "all-is-good-dev.appspot.com",
        messagingSenderId: "467075255307",
        appId: "1:467075255307:web:c31e6277e1d9dcfb460b0e",
        measurementId: "G-P5QKKZXYZY"
      }
    }
  }

  static isProd() {
    return (Constants &&
      Constants.manifest &&
      Constants.manifest.releaseChannel === 'prod')
  }

  static get(): Environment {
    return this.isProd() ? this.envs.prod : this.envs.dev
  }
}
