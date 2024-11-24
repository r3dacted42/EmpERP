import { apiOrigin } from "../utilities/routes";

export default class Employee {
    constructor(data) {
        this.id = data.id;
        this.employee_id = data.employee_id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.title = data.title;
        this.department_id = data.department_id;
        this.department_name = data.department_name;
        this.photo_url = `${apiOrigin}/employees/${data.employee_id}/photo`;
    }

    get fullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}