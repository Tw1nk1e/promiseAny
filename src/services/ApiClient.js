import axios from 'axios';

export default class ApiClient {
    static params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    static get = async (url) => {
        return await axios.get(url, this.params);
    };
}
