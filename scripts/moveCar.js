import axios from 'axios';

const CLIENT_ID = 'vbp7UQ6MJVoQQMClqaMJjlOSfCqGAErS';
const CLIENT_SECRET = 'i5AbtdXktpvoETUmDdusTc5b3hknccM66M2fv9aGxeikkk3ZJuBQOOgHA7bT82Fw';
const API_BASE_URL = 'http://159.223.182.187:3000/api';
const THINGS_ID = 'a69b9f59-4fec-4123-beef-ba978f9f8a54';

async function getToken() {
    const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: 'https://api2.arduino.cc/iot'
    });

    try {
        const response = await axios.post(
            `${API_BASE_URL}/iot/v1/clients/token`,
            data,
        );

        console.log("Token obtenido correctamente: " + ['access_token']);
        return axios.create({
            baseURL: API_BASE_URL, // Replace with your base URL
            headers: {
                'Authorization': `Bearer ${response.data.access_token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error("Failed getting an access token: " + error);
        return null;
    }
}

async function movement(energize, direction) {
    const authAxios = await getToken();
    let pid = "";
    switch (direction) {
        case "UP":
            pid = "02f5934b-ac88-44bf-a98c-4bcc4264bf66"; // Forward
            break;
        case "LEFT":
            pid = "a5343249-e782-4e94-a196-1d5154ec6342"; // Left
            break;
        case "DOWN":
            pid = "cb03085b-3424-4610-aabe-d6b8565e6a0b"; // Down
            break;
        case "RIGHT":
            pid = "383ff582-a3e2-48b1-90b5-3eabff680a22"; // Right
            break;
        default:
            console.error("Invalid direction");
            return;
    }

    if (!pid) {
        console.error("Invalid PID");
        alert("Invalid PID, exiting...");
        return
    }

    const propertyValue = { value: energize };

    try {
        const response = await authAxios.put(`/iot/v2/things/${THINGS_ID}/properties/${pid}/publish`, propertyValue);
        console.log('API called successfully.', response.data);
    } catch (error) {
        console.error(error);
    }
}

async function useController(use) {
    const authAxios = await getToken();
    let pid = "77e53dcf-fb67-4a9f-8d0f-d9e8532e3ad9";
    const propertyValue = { value: use };

    try {
        const response = await authAxios.put(`/iot/v2/things/${THINGS_ID}/properties/${pid}/publish`, propertyValue);
        console.log('API called successfully.', response.data);
    } catch (error) {
        console.error(error);
    }
}

export { movement, useController };
