/**
 * Print Utility Helper
 * Supports direct window printing and new popup window print fallbacks.
 */

export function triggerPrint(containerId?: string, documentTitle: string = 'Laporan Supervisi SI SUPER') {
  if (containerId) {
    const el = document.getElementById(containerId);
    if (el) {
      openPrintWindow(el.innerHTML, documentTitle);
      return;
    }
  }

  // Standard window.print()
  try {
    window.print();
  } catch (err) {
    console.error('window.print error:', err);
    alert('Terjadi kendala saat membuka dialog cetak. Gunakan tombol kombinasi Ctrl+P / Cmd+P.');
  }
}

export function openPrintWindow(htmlContent: string, title: string) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    // If pop-up is blocked, fallback to standard window.print()
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 24px;
          background: #ffffff;
          color: #0f172a;
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print();" style="background: #4f46e5; color: white; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
          🖨️ Cetak / Simpan ke PDF
        </button>
      </div>
      <div id="print-content">
        ${htmlContent}
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
