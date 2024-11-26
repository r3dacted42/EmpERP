export default class DepartmentModel {
    constructor(data) {
        this.department_id = data.department_id;
        this.name = data.name;
        this.capacity = data.capacity;
        this.strength = data.strength;
    }
}