const DATE_STRING_OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

const getOrderDateString = ():String => getOrderDate().toLocaleString('en-US', DATE_STRING_OPTIONS);

const getOrderDate = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const last = first + 6;
  
    return new Date(today.setDate(last));
}

export { getOrderDateString, getOrderDate}