    const fontIncludeCashMap = new Map();

    // 总行数
    let rowCount = 0;

    // 普通总价 和 现金总价
    let generalTotal = 0;
    let cashTotal = 0;


    // 显示弹框
    function showModal(row, colIndex) {
      const modal = document.getElementById('modal');
      modal.dataset.rowIndex = row.rowIndex; // 保存行号
      modal.dataset.colIndex = colIndex; // 保存列号
      modal.style.display = 'block';
      document.getElementById('overlay').style.display = 'block';
    }

    function closeModal() {
      const modal = document.getElementById('modal');
      modal.style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
    }


    // 显示 cash 的逻辑
    function showTotal(showTotalType) {
      printTotal(showTotalType);
      closeModal();
    }


    // 双击行的任意位置，修改价格
    document.querySelectorAll('#my_table tbody tr').forEach(row => {
      row.addEventListener('dblclick', (event) => {

        // 获取被双击的元素 找到最近的<td>祖先元素
        let targetTd = event.target.closest('td');

        // 如果被双击的元素不是<td>（可能是<td>内的某个子元素），则不执行任何操作
        if (!targetTd || !row.contains(targetTd)) {
          return;
        }

        // 获取被双击的<td>元素在其父<tr>中的索引（即列号，注意索引是从0开始的）
        let columnIndex = Array.prototype.indexOf.call(row.children, targetTd);
        let rowIdxWeight = columnIndex < 5 ? 3 : 8;
        let rowIdxPrice = columnIndex < 5 ? 4 : 9;
        let rowIdxTotal = columnIndex < 5 ? 5 : 10;
        const weightCell = row.querySelector(`td:nth-child(${rowIdxWeight}) .weight`);
        const priceCell = row.querySelector(`td:nth-child(${rowIdxPrice}) .price`);
        const totalCell = row.querySelector(`td:nth-child(${rowIdxTotal}) .total`);


        if (weightCell && weightCell.value && weightCell.value !== '' &&
          priceCell && priceCell.value && priceCell.value !== '' && (priceCell.value !== 'total' || priceCell.value !== 'cash') &&
          totalCell && totalCell.value && totalCell.value !== '') {
          alert("Warnning!!! Data exists in the current row, Disallowed operation, pleace check!")
          return;
        }

        processIncludeFont('cash');

        // 根据列号调用showModal函数
        showModal(row, columnIndex < 5 ? 4 : 9)


      });
    });


    // 处理是否包含cash字样
    function processIncludeFont(fontName) {
      // 寻找表单信息
      const table = document.getElementById('my_table');
      // 遍历表格的所有行（<tr>元素）
      rowCount = table.rows.length - 1;
      generalTotal = 0;
      cashTotal = 0;
      for (let i = 1; i < rowCount; i++) {
        const row = table.rows[i];
        const firstCol = row.querySelector(`td:nth-child(1) .cash`); // 获取第一列
        const sixCol = row.querySelector(`td:nth-child(6) .cash`); // 获取第6列

        // 检查单元格的文本内容是否包含'cash'字样
        if (firstCol && firstCol.value && firstCol.value.includes(fontName)) {
          fontIncludeCashMap.set("5-" + i, 'Y');
        }

        if (sixCol && sixCol.value && sixCol.value.includes(fontName)) {
          fontIncludeCashMap.set("10-" + i, 'Y');
        }
        // 计算左列和右列金额

        const leftTotalCol = row.querySelector(`td:nth-child(5) .total`);
        if (fontIncludeCashMap.get("5-" + i) !== 'Y' &&
          leftTotalCol && leftTotalCol.value &&
          (row.querySelector(`td:nth-child(4) .price`).value !== 'cash' && row.querySelector(`td:nth-child(4) .price`).value !== 'total')) {
          generalTotal += parseFloat(leftTotalCol.value) || 0;
        }
        if (fontIncludeCashMap.get("5-" + i) === 'Y' &&
          leftTotalCol && leftTotalCol.value &&
          (row.querySelector(`td:nth-child(4) .price`).value !== 'cash' && row.querySelector(`td:nth-child(4) .price`).value !== 'total')) {
          cashTotal += parseFloat(leftTotalCol.value) || 0;
        }

        const rightTotalCol = row.querySelector(`td:nth-child(10) .total`);
        if (fontIncludeCashMap.get("10-" + i) !== 'Y' &&
          rightTotalCol && rightTotalCol.value &&
          (row.querySelector(`td:nth-child(9) .price`).value !== 'cash' && row.querySelector(`td:nth-child(9) .price`).value !== 'total')) {
          generalTotal += parseFloat(rightTotalCol.value) || 0;
        }
        if (fontIncludeCashMap.get("10-" + i) === 'Y' &&
          rightTotalCol && rightTotalCol.value &&
          (row.querySelector(`td:nth-child(9) .price`).value !== 'cash' && row.querySelector(`td:nth-child(9) .price`).value !== 'total')) {
          cashTotal += parseFloat(rightTotalCol.value) || 0;
        }
      }
    }

    // 输出总价
    function printTotal(showTotalType) {

      const modal = document.getElementById('modal');
      const rowIndex = modal.dataset.rowIndex;
      const colIndex = parseInt(modal.dataset.colIndex, 10); // 使用10作为基数来解析整数
      const totalPrint = document.getElementById('my_table').rows[rowIndex].querySelector(`td:nth-child(${(colIndex + 1)}) .total`);
      const pricePrint = document.getElementById('my_table').rows[rowIndex].querySelector(`td:nth-child(${colIndex}) .price`);

      if (showTotalType === 'total') {
        pricePrint.value = showTotalType;
        totalPrint.value = generalTotal.toFixed(2);
      }

      if (showTotalType === 'cash') {
        pricePrint.value = showTotalType;
        totalPrint.value = cashTotal.toFixed(2);
      }

      if (showTotalType === 'clear') {
        if (totalPrint && totalPrint.value && totalPrint.value !== '') {
          pricePrint.value = '';
          totalPrint.value = '';
        }
      }
    }

    // 输入事件，用于实时计算单行总计
    function calculateTotal(element) {
      const row = element.parentElement.parentElement; // 获取当前行
      const cells = row.querySelectorAll('td'); // 获取当前行的所有单元格

      // 第一组（第3、4格子到第5格子）
      const weight1 = parseFloat(cells[2].querySelector('.weight').value) || 0;
      const price1 = parseFloat(cells[3].querySelector('.price').value) || 0;
      const total1 = cells[4].querySelector('.total');

      if (weight1 && price1) {
        total1.value = calculateResult(weight1, price1); // 计算并更新总计
      } else {
        total1.value = ''; // 输入不全时清空
      }

      // 第二组（第8、9格子到第10格子）
      const weight2 = parseFloat(cells[7].querySelector('.weight').value) || 0;
      const price2 = parseFloat(cells[8].querySelector('.price').value) || 0;
      const total2 = cells[9].querySelector('.total');

      if (weight2 && price2) {
        total2.value = calculateResult(weight2, price2); // 计算并更新总计
      } else {
        total2.value = ''; // 输入不全时清空
      }
    }

    function calculateResult(weight, price) {
      const result = weight * price;
      return Number.isInteger(result) ? result : result.toFixed(2); // 整数不显示小数点，小数保留两位
    }
