export type Customer = {
    address: FormDataEntryValue
    email: FormDataEntryValue
    name: FormDataEntryValue
    phone: FormDataEntryValue
    recurringOrders?: RecurringOrder[]
    userId?: FormDataEntryValue
};

export type RecurringOrder  = {
    orderType: FormDataEntryValue
    total: FormDataEntryValue
    items: FormDataEntryValue[]
}