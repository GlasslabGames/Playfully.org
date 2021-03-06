angular.module('register.const', [])

.constant('REGISTER_CONSTANTS', {
    states: ['Not in United States', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    "ccInfo": {
        name: null,
        card_type: "Visa",
        number: null,
        exp_month: null,
        exp_year: null,
        cvc: null,
        address_line1: null,
        address_line2: null,
        address_city: null,
        address_state: null,
        address_zip: null,
        address_country: null
    },
    "school": {
        name: null,
        zipCode: null,
        address: null,
        state: null,
        city: null
    },
    "poInfo": {
        firstName: null,
        phone: null,
        email: null,
        lastName: null,
        payment: 0
    },
    "cardTypes": ["Visa", "MasterCard", "American Express", "Discover", "Diners Club", "JCB"]
});