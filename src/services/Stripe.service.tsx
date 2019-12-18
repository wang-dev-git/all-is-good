import AppConfig from './AppConfig.service'
import Fire from './Fire.service'

import * as FileSystem from 'expo-file-system';

export default class Stripe {

  static async getToken(data: any = {}) {
    const apiKey = AppConfig.get().stripeAPIKey
    let formBody: any[] = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const res = await fetch('https://api.stripe.com/v1/tokens', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + apiKey
      },
      body: formBody
    });
    return await res.json()
  }

  static async updateAccount(data: any, rib?: string, doc?: any) {
    const birth = this.extractBirth(data.birthday)
    const phone = this.extractPhone(data.phone)
    const payload = {
      "account[business_type]": "individual",
      "account[individual][first_name]": data.first_name, 
      "account[individual][last_name]": data.last_name,
      "account[individual][email]": data.email,
      "account[individual][phone]": phone,
      "account[individual][dob][day]": birth.day,
      "account[individual][dob][month]": birth.month,
      "account[individual][dob][year]": birth.year,
      "account[individual][address][city]": data.city,
      "account[individual][address][country]": "FR",
      "account[individual][address][postal_code]": data.postal_code,
      "account[individual][address][line1]": data.address,
      "account[tos_shown_and_accepted]": true,
    }
    if (doc) {
      if (doc.front_id)
        payload["account[individual][verification][document][front]"] = doc.front_id
      if (doc.back_id)
        payload["account[individual][verification][document][back]"] = doc.back_id
    }

    const token = await this.getToken(payload)
    console.log(token)
    const tokens: any = {
      token: token.id,
    }
    if (rib) {
      const bankPayload = {
        "bank_account[country]": "FR",
        "bank_account[currency]": "EUR",
        "bank_account[account_number]": rib,
      }
      const bankToken = await this.getToken(bankPayload)
      tokens.bankToken = bankToken.id
    }
    const res = await Fire.cloud('updateStripeAccount', tokens)
    return res
  }

  /**
   * Helpers
   */

  private static extractBirth(birthday: string) {
    const parts = birthday.split('/')
    if (parts.length != 3)
      throw 'invalid birthdate'
    return {
      day: parseInt(parts[0]),
      month: parseInt(parts[1]),
      year: parseInt(parts[2]),
    }
  }

  private static extractPhone(phone: string) {
    if (!phone || phone === '')
      return ''
    return '+33' + phone.substr(1)
  }

  static async uploadFile(uri: string) {
    const name = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(name);
    let type = match ? `image/${match[1]}` : `image`;
    if (type === 'image/jpg')
      type = 'image/jpeg'

    const file = await Fire.uploadFile('/stripe/' + name, uri)
    const fileId = await Fire.cloud('uploadStripeFile', { uri: file })
    return fileId
  }

}