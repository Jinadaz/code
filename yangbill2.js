        // Set current date for all date fields
        function setDates() {
            const currentDate = new Date().toLocaleDateString('en-GB');
            for(let i = 1; i <= 4; i++) {
                document.getElementById(`date-${i}`).value = currentDate;
            }
        }

        // Format numbers with thousand separator
        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // Calculate amount for each row
// 修改这两个函数
function calculateJumlah(element) {  // 移除了 decimals 参数
    const row = element.parentElement.parentElement;
    const kg = parseFloat(row.querySelector('.kg').value) || 0;
    const harga = parseFloat(row.querySelector('.harga').value) || 0;
    const result = (kg * harga).toFixed(2);  // 直接使用 2 位小数
    row.querySelector('.jumlah').value = formatNumber(result);
    
    // 找到当前发票编号
    const container = element.closest('.container');
    const totalInput = container.querySelector('[id^="jumlah-total-"]');
    const invoiceNum = totalInput.id.split('-')[2];
    
    calculateTotal(invoiceNum);
}

function calculateTotal(invoiceNum) {
    const container = document.querySelector(`#jumlah-total-${invoiceNum}`).closest('.container');
    const jumlahFields = container.querySelectorAll('.jumlah');
    let total = 0;
    
    jumlahFields.forEach(field => {
        const value = parseFloat(field.value.replace(/,/g, '')) || 0;
        total += value;
    });
    
    document.getElementById(`jumlah-total-${invoiceNum}`).value = formatNumber(total.toFixed(2));
}
        // Initialize dates when page loads
        window.onload = setDates;