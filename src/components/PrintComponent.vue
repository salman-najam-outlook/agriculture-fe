<template>
    <div id="printable-content" style="display: none;">
      <slot></slot>
    </div>
  </template>
  
  <script>
  import printJS from 'print-js';
  import html2pdf from 'html2pdf.js';
  
  export default {
    props: {
      filename: {
        type: String,
        default: 'document.pdf',
      },
      config: {
        type: Object,
        default: () => ({
          margin: [0.2, 0.2, 0.2, 0.2],
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        }),
      },
      printStyle: {
        type: Object,
        default: () => ({
          border: '1px solid black',
          borderCollapse: 'collapse',
          th: {
            border: '1px solid black',
            padding: '8px',
            textAlign: 'left',
            backgroundColor: 'teal',
            color: 'white',
          },
          td: {
            border: '1px solid black',
            padding: '8px',
            textAlign: 'left',
          },
        }),
      },
    },
    methods: {
      async printContent() {
        const element = document.querySelector("#printable-content");
  
        // Apply specific styles to the printable content
        element.style.display = 'block';
        element.style.width = '100%';
        element.style.border = this.printStyle.border;
        element.style.borderCollapse = this.printStyle.borderCollapse;
        element.querySelectorAll('th').forEach(cell => {
          Object.assign(cell.style, this.printStyle.th);
        });
        element.querySelectorAll('td').forEach(cell => {
          Object.assign(cell.style, this.printStyle.td);
        });
  
        let opt = {
          ...this.config,
          filename: this.filename,
        };
  
        let worker = await html2pdf()
          .set(opt)
          .from(element)
          .toCanvas()
          .outputPdf("blob", this.filename);
        let file = new File([worker], this.filename, {
          type: "application/pdf",
        });
        var pdfUrl = await URL.createObjectURL(file);
        await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
  
        // Reset styles after printing
        element.style.display = 'none';
        element.querySelectorAll('th').forEach(cell => {
          Object.assign(cell.style, { border: '', padding: '', textAlign: '', backgroundColor: '', color: '' });
        });
        element.querySelectorAll('td').forEach(cell => {
          Object.assign(cell.style, { border: '', padding: '', textAlign: '' });
        });
      },
    },
  };
  </script>