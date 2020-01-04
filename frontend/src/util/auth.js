import { web3 } from "../eth/contract";

const oneHour = 60 * 60 * 1000; //token expiration

class Auth {
  static getAuth() {
    let user = web3.currentProvider.selectedAddress;
    let data = localStorage.getItem(user);
    if (!data) return null;
    data = JSON.parse(data);
    let now = Date.now();
    if (now - data.timestamp > oneHour) return null;
    return data.token;
  }

  static setAuth(token) {
    let user = web3.currentProvider.selectedAddress;
    let timestamp = Date.now();
    let data = JSON.stringify({ timestamp, token });
    localStorage.setItem(user, data);
  }
}

export default Auth;
