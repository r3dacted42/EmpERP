import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { apiOrigin } from '../utilities/routes';

export function useFetchAuth() {
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const navigate = useNavigate();

    const fetchAuth = (
        endpoint,
        method = 'post',
        body = null,
        contentType = 'json'
    ) => {
        let expired = true;
        if (cookies.token) {
            let data = jwtDecode(cookies.token)
            let expTime = data.exp * 1000;
            expired = Date.now() > expTime;
        }
        if (!(cookies.token && cookies.username) || expired) {
            removeCookies('username');
            removeCookies('token');
            // navigate("/login");
            console.log("login needed");
            return new Promise((res) => { res(null); });
        }
        endpoint = apiOrigin + endpoint;
        let headers = {
            "Authorization": `Bearer ${cookies.token}`
        };
        if (contentType === 'json') {
            headers["Content-Type"] = "application/json; charset=UTF-8";
        }
        let options = {
            method: method.toUpperCase(),
            headers: headers
        };
        if (body != null) {
            options = {
                ...options,
                body: JSON.stringify(body)
            };
        }
        return fetch(endpoint, options);
    }

    return fetchAuth;
}