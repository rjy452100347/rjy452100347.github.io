function print() {
  const printWindow = window.open("/print", "_blank");
  printWindow.onload = function () {
    printWindow.print();
    // Close the print window after a delay
    setTimeout(() => printWindow.close(), 500);
  };
}

function generatePDF() {
  const printURL = window.location.origin + "/print";

  fetch(printURL)
    .then((response) => response.text())
    .then((html) => {
      // 创建临时容器并插入到 DOM
      const container = document.createElement("div");
      container.innerHTML = html;
      container.classList.add("pdf-export");
      document.body.appendChild(container);

      // 获取名字（从容器中查找）
      const nameElement = container.querySelector(".name");
      const name = nameElement ? nameElement.textContent : "Resume";
      const filename = `${name.replace(/\s+/g, "_")}_Resume.pdf`;

      // 配置 PDF 生成参数
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      // 生成 PDF
      html2pdf()
        .set(opt)
        .from(container)
        .save()
        .then(() => {
          // 导出完成后清理 DOM
          document.body.removeChild(container);
        })
        .catch((err) => console.error("Error generating PDF:", err));
    })
    .catch((err) => console.error("Error fetching print layout:", err));
}
