import Constants from 'expo-constants'

type Environment = {
  stripeAPIKey: string;
  firebaseOptions: any;
  expertAPI: string;
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
  static facebookId: string = '379489816318205'

  // IsClothing Application fee (Percentage)
  static applicationFee: number = 0.10

  /**
   * Environment related configuration
   */

  static envs: Environments = {
    // Development configuration
    dev: {
      stripeAPIKey: 'pk_test_r3QcefZfJ7ntGG2VTxbIwyFC00lOt0oVA7',
      expertAPI: 'https://isclothing-authentifier.herokuapp.com',

      firebaseOptions: {
        apiKey: "AIzaSyBvx5Dao_zC19TkxT8kIA5lk8eP9OZxl40",
        authDomain: "isclothing.firebaseapp.com",
        databaseURL: "https://isclothing.firebaseio.com",
        projectId: "isclothing",
        storageBucket: "gs://isclothing.appspot.com",
        messagingSenderId: "184806855267",
        appId: "1:184806855267:web:8466e7a62c46e51d"
      },
    },
    // Production configuration
    prod: {
      stripeAPIKey: 'pk_live_3Sn8TxxwCAHekanrJATCN8Ws00F2IPhKpm',
      expertAPI: 'https://isclothing-authentifier-prod.herokuapp.com',

      firebaseOptions: {
        apiKey: "AIzaSyAcKpqHBuYjGZTWH8a8hR2wOr4rIU7nfUY",
        authDomain: "isclothing-prod.firebaseapp.com",
        databaseURL: "https://isclothing-prod.firebaseio.com",
        projectId: "isclothing-prod",
        storageBucket: "isclothing-prod.appspot.com",
        messagingSenderId: "14784278073",
        appId: "1:14784278073:web:75f4dfd2e0f75d85fd67e8",
        measurementId: "G-FE09H2HSLE"
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
