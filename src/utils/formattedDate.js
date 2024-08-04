export  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  