import Constants from 'expo-constants'

type Environment = {
  searchId: string;
  searchSecret: string;
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

  /**
   * Environment related configuration
   */

  static envs: Environments = {
    // Development configuration
    dev: {
      searchId: 'AKIAVF7FTF2SA4RZ726I',
      searchSecret: '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',
      stripeAPIKey: 'pk_test_yh5IzAEMtyw6mdm2Bzzh5VRV00zvoP4wsq',
      firebaseOptions: {
        apiKey: 'AIzaSyD_X9jW8-os50OfOPxa_l2I-HrLDfh8mm4',
        authDomain: 'all-is-good-cd01a.firebaseapp.com',
        databaseURL: 'https://all-is-good-cd01a.firebaseio.com',
        projectId: 'all-is-good-cd01a',
        storageBucket: 'all-is-good-cd01a.appspot.com',
        messagingSenderId: '234727941894',
        appId: '1:234727941894:web:16a53a15fbca6c6b646087',
      },
    },
    // Production configuration
    prod: {
      searchId: '',
      searchSecret: '',
      stripeAPIKey: 'pk_live_47m8CICYtroXZAGB3M2nZHYj00BVpO9G9r',
      firebaseOptions: {
        apiKey: 'AIzaSyD_X9jW8-os50OfOPxa_l2I-HrLDfh8mm4',
        authDomain: 'all-is-good-cd01a.firebaseapp.com',
        databaseURL: 'https://all-is-good-cd01a.firebaseio.com',
        projectId: 'all-is-good-cd01a',
        storageBucket: 'all-is-good-cd01a.appspot.com',
        messagingSenderId: '234727941894',
        appId: '1:234727941894:web:16a53a15fbca6c6b646087',
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
