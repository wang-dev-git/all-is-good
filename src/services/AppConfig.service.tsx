import Constants from 'expo-constants'

type Environment = {
  searchId: string;
  searchSecret: string;
  stripeAPIKey: string;
  firebaseOptions: any;
  googleClientID: string;
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

  /**
   * Environment related configuration
   */

  static envs: Environments = {
    // Development configuration
    dev: {
      searchId: 'AKIAVF7FTF2SA4RZ726I',
      searchSecret: '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',
      stripeAPIKey: 'pk_test_yh5IzAEMtyw6mdm2Bzzh5VRV00zvoP4wsq',
      googleClientID: '467075255307-eh5vm2tf5397ruc7lgc8qpo9uvp9qrg4.apps.googleusercontent.com',
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
      searchId: '',
      searchSecret: '',
      stripeAPIKey: 'pk_live_47m8CICYtroXZAGB3M2nZHYj00BVpO9G9r',
      googleClientID: '1039569656278-jhc5iqcvlisu3k5i0jodogq0pb8juft1.apps.googleusercontent.com',
      firebaseOptions: {
        apiKey: "AIzaSyB7zLRgccH8E9oNBmtME_lan7zAkI2P3ds",
        authDomain: "all-is-good-prod.firebaseapp.com",
        databaseURL: "https://all-is-good-prod.firebaseio.com",
        projectId: "all-is-good-prod",
        storageBucket: "all-is-good-prod.appspot.com",
        messagingSenderId: "1039569656278",
        appId: "1:1039569656278:web:f034aaef5395c99242ac77",
        measurementId: "G-9WC0Q75J2R"
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
