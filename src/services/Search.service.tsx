import AWS from 'aws-sdk'

export default class Search {

  static filter(params: any) {
    return new Promise((resolve, reject) => {
      const cloudsearch = new AWS.CloudSearch();
      cloudsearch.buildSuggesters(params, function (err, data) {
        if (err) reject(err)
        else     resolve(data)
      });
    })
  }

}