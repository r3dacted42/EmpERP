export default class EmployeeSalaryModel {
    constructor(data) {
        this.id = data.id;
        this.employee_id = data.employee_id;
        this.payment_date = data.payment_date;
        this.amount = data.amount;
        this.description = data.description;
    }
}