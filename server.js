const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 使用 CORS 中间件
app.use(cors());

// 定义调用 CPK Conventor.exe 的路由
app.post('/run-cpk-conventor', (req, res) => {
    console.log('Received request to run CPK Conventor');
    const exePath = path.join(__dirname, 'CPK Conventor.exe');
    execFile(exePath, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing CPK Conventor:', error);
            return res.json({ success: false, error: error.message });
        }
        console.log('CPK Conventor output:', stdout);
        res.json({ success: true });
    });
});

// 执行 CPK 按钮点击事件
document.getElementById('executeCpkBtn').addEventListener('click', function() {
    if (excelData.length === 0) {
        alert('請先上傳 Excel 文件！');
        return;
    }

    // 功能 1: 删除 "S/N" 前面的所有行，但保留 "S/N" 的上一行
    let snRowIndex = -1;
    for (let i = 0; i < excelData.length; i++) {
        if (excelData[i].some(cell => String(cell).includes('S/N'))) {
            snRowIndex = i;
            break;
        }
    }

    if (snRowIndex === -1) {
        alert('未找到含有 "S/N" 的行！');
        return;
    }

    // 保留 "S/N" 的上一行
    const startRowIndex = Math.max(0, snRowIndex - 1);
    let filteredData = excelData.slice(startRowIndex);

    // 功能 2: 删除 "Program Result" 列中等于 0 的行
    const headerRow = filteredData[0];
    const programResultIndex = headerRow.findIndex(cell => String(cell).includes('Program Result'));

    if (programResultIndex === -1) {
        alert('未找到 "Program Result" 列！');
    } else {
        filteredData = filteredData.filter((row, rowIndex) => {
            // 保留表头行或 "Program Result" 列不等于 0 的行
            return rowIndex === 0 || row[programResultIndex] !== 0;
        });
    }

    // 更新表格预览
    displayTable(filteredData);

    // 更新全局数据
    excelData = filteredData;

    alert('已完成以下操作：\n1. 刪除含有 "S/N" 前面的所有行，但保留 "S/N" 的上一行。\n2. 刪除 "Program Result" 中等於 0 的行！');
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});