import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { apiOrigin } from '../utilities/routes';

export default function useFetchAuth() {
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const navigate = useNavigate();

    const fetchAuth = (
        endpoint,
        method = 'post',
        body = null,
        contentType
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
            // console.log("login needed");
            return new Promise((res) => { res(null); });
        }
        endpoint = apiOrigin + endpoint;
        let headers = {
            "Authorization": `Bearer ${cookies.token}`
        };
        if (contentType === 'json') {
            headers["Content-Type"] = "application/json; charset=UTF-8";
            body = JSON.stringify(body);
        }
        if (contentType === 'file') {
            const formData = new FormData();
            formData.append('photo', body);
            body = formData;
            // headers["Content-Type"] = 'multipart/form-data'; :)))))))))))))
        }
        let options = {
            method: method.toUpperCase(),
            headers: headers
        };
        if (body != null) {
            options = {
                ...options,
                body: body
            };
        }
        return fetch(endpoint, options);
    }

    return fetchAuth;
}