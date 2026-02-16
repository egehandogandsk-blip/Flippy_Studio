import { toPng, toJpeg, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useDocumentStore } from '../store/documentStore';

export const handleExport = async (nodeId: string, format: string, scale: number) => {
    const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (!nodeElement) {
        console.error('Node element not found');
        return;
    }

    const node = useDocumentStore.getState().nodes[nodeId];
    const name = node?.name || 'export';
    const filename = `${name}-${format}-${scale}x.${format}`;

    // Options for html-to-image
    const options = {
        quality: 1,
        pixelRatio: scale,
        backgroundColor: 'transparent',
    };

    try {
        let dataUrl: string | null = null;

        switch (format) {
            case 'png':
                dataUrl = await toPng(nodeElement, options);
                break;
            case 'jpg':
                dataUrl = await toJpeg(nodeElement, { ...options, backgroundColor: '#ffffff' });
                break;
            case 'svg':
                dataUrl = await toSvg(nodeElement, options);
                break;
            case 'pdf':
                const imgData = await toPng(nodeElement, { ...options, pixelRatio: scale });
                const pdfWidth = node.width;
                const pdfHeight = node.height;
                const pdfDoc = new jsPDF({
                    orientation: pdfWidth > pdfHeight ? 'l' : 'p',
                    unit: 'px',
                    format: [pdfWidth, pdfHeight]
                });
                pdfDoc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdfDoc.save(`${name}-pdf-${scale}x.pdf`);
                return;
        }

        if (dataUrl) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
        }

    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed. Please check console.');
    }
};

// Multi-node export handler
export const handleMultiExport = async (nodeIds: string[], format: string, scale: number) => {
    for (const nodeId of nodeIds) {
        await handleExport(nodeId, format, scale);
        // Small delay between exports to prevent browser throttling
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};
